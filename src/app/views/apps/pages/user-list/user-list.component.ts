import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { UserService } from '@core/services/user.service';
import { User } from '@core/models/user.model';
import { PaginationComponent, PaginationConfig } from '@/app/shared/components/pagination/pagination.component';
import { PageTitleComponent } from '@/app/components/page-title.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIcon, PaginationComponent, PageTitleComponent],
  templateUrl: './user-list.component.html',
  styles: [`
    .table-responsive {
      overflow-x: auto;
    }
    .badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
    }
    .profile-photo {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .profile-placeholder {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 0.9rem;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    }
    .modal-backdrop {
      background-color: rgba(0, 0, 0, 0.5);
    }
    ng-icon {
      cursor: pointer;
      transition: all 0.2s ease;
    }
    ng-icon:hover {
      transform: scale(1.15);
      opacity: 0.8;
    }
    .modal-content {
      border: none;
      border-radius: 15px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    }
    .modal-header {
      border-bottom: 2px solid #f0f0f0;
      padding: 1.5rem;
      background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
      border-radius: 15px 15px 0 0;
    }
    .modal-body {
      padding: 2rem;
    }
    .modal-footer {
      border-top: 2px solid #f0f0f0;
      padding: 1.5rem;
      background-color: #fafafa;
      border-radius: 0 0 15px 15px;
    }
    .form-control:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }
    .form-label {
      font-weight: 500;
      color: #495057;
      margin-bottom: 0.5rem;
    }
  `]
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  users: User[] = [];
  loading: boolean = false;
  showEditModal: boolean = false;
  editForm!: FormGroup;
  selectedUser: User | null = null;
  
  paginationConfig: PaginationConfig = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  };

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      id: [0],
      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      address: ['', Validators.required],
      city: [''],
      profilePhoto: [''],
      userType: [''],
      isActive: [true],
      createdBy: [''],
      createdOn: [''],
      updatedBy: [''],
      updatedOn: ['']
    });
  }

  loadUsers(): void {
    this.loading = true;
    
    this.userService.getUsers({
      pageNumber: this.paginationConfig.currentPage,
      pageSize: this.paginationConfig.pageSize
    }).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.users = response.data.items;
          this.paginationConfig = {
            currentPage: response.data.pageNumber,
            pageSize: response.data.pageSize,
            totalItems: response.data.totalCount,
            totalPages: response.data.totalPages
          };
        }
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.errorMessage || 'Failed to load users. Please try again.'
        });
      }
    });
  }

  onPageChange(page: number): void {
    this.paginationConfig.currentPage = page;
    this.loadUsers();
  }

  getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  openEditModal(userId: number): void {
    this.userService.getUserById(userId).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.selectedUser = response.data;
          this.editForm.patchValue(response.data);
          this.showEditModal = true;
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.errorMessage || 'Failed to load user details.'
        });
      }
    });
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedUser = null;
    this.editForm.reset();
  }

  saveUser(): void {
    if (this.editForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Form',
        text: 'Please fill all required fields correctly.'
      });
      return;
    }

    const userData = this.editForm.value;
    
    this.userService.updateUser(userData).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'User updated successfully!',
            showConfirmButton: false,
            timer: 1500
          });
          this.closeEditModal();
          this.loadUsers();
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.errorMessage || 'Failed to update user.'
        });
      }
    });
  }

  deleteUser(userId: number, userName: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${userName}? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(userId).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'User has been deleted successfully.',
              showConfirmButton: false,
              timer: 1500
            });
            this.loadUsers();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error?.errorMessage || 'Failed to delete user.'
            });
          }
        });
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Please select an image file.'
        });
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'Image size should not exceed 5MB.'
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result;
        this.editForm.patchValue({
          profilePhoto: base64String
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeProfilePhoto(): void {
    this.editForm.patchValue({
      profilePhoto: ''
    });
    const fileInput = document.getElementById('profilePhotoFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
