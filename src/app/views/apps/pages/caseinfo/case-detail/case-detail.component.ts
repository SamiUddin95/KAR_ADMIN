import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseInfoService } from '@core/services/caseinfo.service';
import { LawyerService } from '@core/services/lawyer.service';
import { CaseInfo, CaseInfoDetailResponse, EditableFields, CaseInfoNote } from '@core/models/caseinfo.model';
import { Lawyer } from '@core/models/lawyer.model';
import { PageTitleComponent } from '@/app/components/page-title.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-case-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIcon, PageTitleComponent],
  templateUrl: './case-detail.component.html',
  styles: [`
    /* Dark Theme Cards */
    .card {
      background: rgba(26, 26, 26, 0.95);
      border: 1px solid rgba(255, 215, 0, 0.2);
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(255, 215, 0, 0.1);
    }
    
    /* Gold Gradient Card Header */
    .card-header {
      background: linear-gradient(135deg, #FFD700 0%, #FFC107 50%, #FF9800 100%);
      border-bottom: 2px solid #FFD700;
      padding: 1rem 1.5rem;
      border-radius: 12px 12px 0 0;
    }
    .card-header .card-title {
      color: #1a1a1a;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.9rem;
      letter-spacing: 0.5px;
    }
    .card-header ng-icon {
      color: #1a1a1a;
    }
    
    /* Card Body */
    .card-body {
      background: rgba(26, 26, 26, 0.98);
      color: #e0e0e0;
      padding: 1.5rem;
    }
    
    /* Info Table Dark Theme */
    .info-table {
      margin-bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      overflow: hidden;
    }
    .info-table th {
      width: 40%;
      background: linear-gradient(135deg, #FFD700 0%, #FFC107 100%);
      font-weight: 600;
      color: #1a1a1a;
      border: none;
      padding: 0.875rem 1rem;
    }
    .info-table td {
      background-color: transparent;
      border: none;
      color: #e0e0e0;
      padding: 0.875rem 1rem;
    }
    .info-table tr:nth-child(even) {
      background: rgba(255, 215, 0, 0.03);
    }
    .info-table tr:hover td {
      background: rgba(255, 215, 0, 0.05);
    }
    
    /* Badges */
    .badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-weight: 600;
    }
    .badge-pending {
      background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
      color: #000;
    }
    .badge-approved {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: #fff;
    }
    .badge-rejected {
      background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
      color: #fff;
    }
    
    /* Form Controls Dark Theme */
    .form-label {
      font-weight: 500;
      color: var(--ins-gold);
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }
    .form-control, .form-select {
      background-color: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 215, 0, 0.2);
      color: #e0e0e0;
      border-radius: 8px;
      padding: 0.75rem 1rem;
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
    
    /* Buttons Dark Theme */
    .btn-primary {
      background: linear-gradient(135deg, #FFD700 0%, #FFC107 100%);
      border: none;
      color: #000;
      font-weight: 600;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
      transition: all 0.3s ease;
    }
    .btn-primary:hover {
      background: linear-gradient(135deg, #FFE44D 0%, #FFD700 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
      color: #000;
    }
    .btn-secondary {
      background-color: rgba(108, 117, 125, 0.3);
      border: 1px solid rgba(108, 117, 125, 0.5);
      color: #e0e0e0;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      transition: all 0.3s ease;
    }
    .btn-secondary:hover {
      background-color: rgba(108, 117, 125, 0.5);
      border-color: rgba(108, 117, 125, 0.7);
      color: #ffffff;
    }
    
    /* File Alert Dark Theme */
    .file-alert {
      background-color: rgba(255, 215, 0, 0.1);
      border: 1px solid rgba(255, 215, 0, 0.2);
      border-left: 4px solid var(--ins-gold);
      border-radius: 8px;
      color: #e0e0e0;
      padding: 1rem;
    }
    .file-alert ng-icon {
      color: var(--ins-gold);
    }
    .file-alert .text-muted {
      color: #b0b0b0 !important;
    }
    
    /* Notes Dark Theme */
    .note-item {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 215, 0, 0.15);
      border-left: 4px solid var(--ins-gold);
      border-radius: 8px;
      color: #e0e0e0;
      transition: all 0.2s ease;
    }
    .note-item:hover {
      transform: translateX(5px);
      box-shadow: 0 2px 12px rgba(255, 215, 0, 0.15);
      border-color: rgba(255, 215, 0, 0.3);
    }
    .note-item strong {
      color: var(--ins-gold);
    }
    .note-item .text-muted {
      color: #b0b0b0 !important;
    }
    .notes-list {
      max-height: 400px;
      overflow-y: auto;
    }
    
    /* Section Title */
    .section-title {
      color: var(--ins-gold);
      font-weight: 600;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--ins-gold);
    }
    
    /* Editable Section */
    .editable-section {
      background: rgba(26, 26, 26, 0.5);
      border-radius: 10px;
      padding: 1.5rem;
      margin-top: 1.5rem;
      border: 1px solid rgba(255, 215, 0, 0.2);
    }
    
    /* Loading Spinner - Gold */
    .spinner-border {
      color: #FFD700 !important;
    }
    .spinner-gold {
      color: #FFD700 !important;
    }
    
    /* Text Colors */
    .text-muted {
      color: #b0b0b0 !important;
    }
    
    /* Form Text */
    .form-text {
      color: #6c757d;
      font-size: 0.875rem;
    }
    
    /* SweetAlert Dark Theme Styles */
    :host ::ng-deep .swal-dark-theme {
      border: 1px solid rgba(255, 215, 0, 0.2) !important;
      box-shadow: 0 10px 40px rgba(255, 215, 0, 0.1) !important;
    }
    :host ::ng-deep .swal-gold-button {
      background: linear-gradient(135deg, #FFD700 0%, #FFC107 100%) !important;
      color: #000000 !important;
      font-weight: 600 !important;
      border: none !important;
      border-radius: 8px !important;
      padding: 0.5rem 2rem !important;
      box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3) !important;
    }
    :host ::ng-deep .swal-gold-button:hover {
      background: linear-gradient(135deg, #FFE44D 0%, #FFD700 100%) !important;
    }
    
    /* Responsive Styles */
    @media (max-width: 992px) {
      .info-table th {
        width: 45%;
      }
    }
    @media (max-width: 768px) {
      .info-table th,
      .info-table td {
        display: block;
        width: 100%;
      }
      .info-table th {
        background: linear-gradient(135deg, #FFD700 0%, #FFC107 100%);
        color: #1a1a1a;
        padding: 0.75rem 1rem;
      }
      .info-table td {
        padding: 0.75rem 1rem;
      }
      .editable-section {
        padding: 1rem;
      }
      .card-header {
        padding: 1rem;
      }
    }
    @media (max-width: 576px) {
      .btn-primary,
      .btn-secondary {
        width: 100%;
        margin-bottom: 0.5rem;
      }
      .d-flex.gap-2 {
        flex-direction: column;
      }
    }
  `]
})
export class CaseDetailComponent implements OnInit {
  private caseInfoService = inject(CaseInfoService);
  private lawyerService = inject(LawyerService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  caseInfo: CaseInfo | null = null;
  lawyers: Lawyer[] = [];
  notes: CaseInfoNote[] = [];
  loading: boolean = false;
  loadingLawyers: boolean = false;
  saving: boolean = false;
  editableForm!: FormGroup;
  caseId: number = 0;

  ngOnInit(): void {
    this.initForm();
    this.loadLawyers();
    this.route.params.subscribe(params => {
      this.caseId = +params['id'];
      if (this.caseId) {
        this.loadCaseDetail();
      }
    });
  }

  initForm(): void {
    this.editableForm = this.fb.group({
      lawyerId: [null],
      caseNumber: [''],
      court: [''],
      nextHearing: [''],
      scheduleStatus: [''],
      under_Section: [''],
      advocate: [''],
      notes: ['']
    });
  }

  loadLawyers(): void {
    this.loadingLawyers = true;
    this.lawyerService.getLawyers({ pageNumber: 1, pageSize: 100 }).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.lawyers = response.data.items;
        }
        this.loadingLawyers = false;
      },
      error: (error) => {
        this.loadingLawyers = false;
        console.error('Failed to load lawyers:', error);
      }
    });
  }

  loadCaseDetail(): void {
    this.loading = true;
    
    this.caseInfoService.getCaseInfoById(this.caseId).subscribe({
      next: (response: CaseInfoDetailResponse) => {
        if (response.status === 'success') {
          this.caseInfo = response.data.caseInfo;
          this.notes = response.data.notes || [];
          
          // Patch editable fields if available
          if (response.data.editableFields) {
            this.editableForm.patchValue(response.data.editableFields);
          } else {
            // Patch from caseInfo if editableFields not available
            this.editableForm.patchValue({
              lawyerId: this.caseInfo.lawyerId,
              caseNumber: this.caseInfo.caseNumber,
              court: this.caseInfo.court,
              nextHearing: this.caseInfo.nextHearing,
              scheduleStatus: this.caseInfo.scheduleStatus,
              under_Section: this.caseInfo.under_Section,
              advocate: this.caseInfo.advocate
            });
          }
        }
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.errorMessage || 'Failed to load case details.',
          background: '#1a1a1a',
          color: '#ffffff',
          confirmButtonColor: '#FFD700',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'swal-dark-theme',
            confirmButton: 'swal-gold-button'
          }
        });
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'badge-pending';
      case 'approved':
        return 'badge-approved';
      case 'rejected':
        return 'badge-rejected';
      default:
        return 'badge-secondary';
    }
  }

  saveEditableFields(): void {
    if (this.editableForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Form',
        text: 'Please fill all required fields correctly.',
        background: '#1a1a1a',
        color: '#ffffff',
        confirmButtonColor: '#FFD700',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'swal-dark-theme',
          confirmButton: 'swal-gold-button'
        }
      });
      return;
    }

    this.saving = true;
    
    const updateRequest = {
      id: this.caseId,
      ...this.editableForm.value
    };

    this.caseInfoService.updateCaseInfo(updateRequest).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Case information updated successfully!',
            showConfirmButton: false,
            timer: 1500,
            background: '#1a1a1a',
            color: '#ffffff',
            customClass: {
              popup: 'swal-dark-theme'
            }
          });
          this.caseInfo = response.data.caseInfo;
          this.editableForm.patchValue(response.data.editableFields);
        }
        this.saving = false;
      },
      error: (error) => {
        this.saving = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.errorMessage || 'Failed to update case information.',
          background: '#1a1a1a',
          color: '#ffffff',
          confirmButtonColor: '#FFD700',
          confirmButtonText: 'Try Again',
          customClass: {
            popup: 'swal-dark-theme',
            confirmButton: 'swal-gold-button'
          }
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/apps/caseinfo/case-list']);
  }
}
