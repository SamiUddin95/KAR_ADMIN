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
      box-shadow: 0 2px 8px rgba(255, 215, 0, 0.2);
    }
    .profile-placeholder {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #FFD700 0%, #FFC107 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      font-weight: 600;
      font-size: 0.9rem;
      box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
    }
    .modal-backdrop {
      background-color: rgba(0, 0, 0, 0.8);
    }
    ng-icon {
      cursor: pointer;
      transition: all 0.2s ease;
    }
    ng-icon:hover {
      transform: scale(1.15);
      opacity: 0.8;
    }
    
    /* Dark Theme Modal */
    .modal-content {
      background: rgba(26, 26, 26, 0.98);
      border: 1px solid rgba(255, 215, 0, 0.2);
      border-radius: 15px;
      box-shadow: 0 10px 40px rgba(255, 215, 0, 0.15);
      color: #e0e0e0;
    }
    .modal-header {
      border-bottom: 2px solid var(--ins-gold);
      padding: 1.5rem;
      background: linear-gradient(135deg, #FFD700 0%, #FFC107 50%, #FF9800 100%);
      border-radius: 15px 15px 0 0;
    }
    .modal-title {
      color: #1a1a1a;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.95rem;
      letter-spacing: 0.5px;
    }
    .modal-header ng-icon {
      color: #1a1a1a;
    }
    .btn-close {
      filter: brightness(0);
      opacity: 0.7;
    }
    .btn-close:hover {
      opacity: 1;
      transform: scale(1.1);
    }
    .modal-body {
      padding: 2rem;
      background: rgba(26, 26, 26, 0.98);
    }
    .modal-footer {
      border-top: 1px solid rgba(255, 215, 0, 0.2);
      padding: 1.5rem;
      background: rgba(255, 215, 0, 0.05);
      border-radius: 0 0 15px 15px;
    }
    
    /* Form Controls Dark Theme */
    .form-label {
      font-weight: 500;
      color: var(--ins-gold);
      margin-bottom: 0.5rem;
    }
    .form-control, .form-select {
      background-color: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 215, 0, 0.2);
      color: #e0e0e0;
    }
    .form-control::placeholder {
      color: #6c757d;
    }
    .form-control:focus, .form-select:focus {
      background-color: rgba(0, 0, 0, 0.5);
      border-color: var(--ins-gold);
      box-shadow: 0 0 0 0.2rem rgba(255, 215, 0, 0.25);
      color: #e0e0e0;
    }
    .form-select option {
      background-color: #1a1a1a;
      color: #e0e0e0;
    }
    
    /* Toggle Switch Dark Theme */
    .form-check-input {
      background-color: rgba(0, 0, 0, 0.4);
      border-color: rgba(255, 215, 0, 0.3);
    }
    .form-check-input:checked {
      background-color: var(--ins-gold);
      border-color: var(--ins-gold);
    }
    .form-check-label {
      color: #e0e0e0;
    }
    
    /* Buttons Dark Theme */
    .btn-primary {
      background: linear-gradient(135deg, #FFD700 0%, #FFC107 100%);
      border: none;
      color: #000;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
    }
    .btn-primary:hover {
      background: linear-gradient(135deg, #FFE44D 0%, #FFD700 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
    }
    .btn-secondary {
      background-color: rgba(108, 117, 125, 0.3);
      border: 1px solid rgba(108, 117, 125, 0.5);
      color: #e0e0e0;
    }
    .btn-secondary:hover {
      background-color: rgba(108, 117, 125, 0.5);
      border-color: rgba(108, 117, 125, 0.7);
      color: #ffffff;
    }
    
    /* Upload Area Dark Theme */
    .bg-gradient {
      background: linear-gradient(135deg, #FFD700 0%, #FFC107 100%) !important;
    }
    small.text-muted {
      color: #b0b0b0 !important;
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
