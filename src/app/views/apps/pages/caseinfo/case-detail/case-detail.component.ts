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
    .card {
      border: none;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    .card-header {
      background: linear-gradient(135deg, #FFD700 0%, #C5A000 100%);
      color: #000;
      border-radius: 12px 12px 0 0;
      padding: 1.25rem;
    }
    .card-title {
      font-weight: 600;
      margin: 0;
    }
    .section-title {
      color: #FFD700;
      font-weight: 600;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #FFD700;
    }
    .info-table {
      margin-bottom: 0;
    }
    .info-table th {
      width: 40%;
      background-color: rgba(255, 215, 0, 0.1);
      font-weight: 600;
      color: #FFD700;
      border: none;
    }
    .info-table td {
      background-color: #fff;
      border: none;
    }
    .badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
    }
    .badge-pending {
      background-color: #ffc107;
      color: #000;
    }
    .badge-approved {
      background-color: #28a745;
      color: #fff;
    }
    .badge-rejected {
      background-color: #dc3545;
      color: #fff;
    }
    .editable-section {
      background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
      border-radius: 10px;
      padding: 1.5rem;
      margin-top: 1.5rem;
      border: 1px solid #cbd5e0;
    }
    .form-control:focus {
      border-color: #FFD700;
      box-shadow: 0 0 0 0.2rem rgba(255, 215, 0, 0.25);
    }
    .form-label {
      font-weight: 500;
      color: #FFD700;
      margin-bottom: 0.5rem;
    }
    .btn-primary {
      background: linear-gradient(135deg, #FFD700 0%, #C5A000 100%);
      border: none;
      padding: 0.5rem 1.5rem;
      font-weight: 500;
      color: #000;
    }
    .btn-primary:hover {
      background: linear-gradient(135deg, #FFE44D 0%, #FFD700 100%);
    }
    .btn-secondary {
      background-color: #6c757d;
      border: none;
      padding: 0.5rem 1.5rem;
      font-weight: 500;
    }
    .file-alert {
      background-color: rgba(255, 215, 0, 0.1);
      border-left: 4px solid #FFD700;
      border-radius: 8px;
    }
    .note-item {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 100%);
      border-left: 4px solid #FFD700;
      transition: all 0.2s ease;
    }
    .note-item:hover {
      transform: translateX(5px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .notes-list {
      max-height: 400px;
      overflow-y: auto;
    }
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
        background-color: #FFD700;
        color: #000;
        padding: 0.75rem;
      }
      .info-table td {
        padding: 0.75rem;
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
          text: error.error?.errorMessage || 'Failed to load case details.'
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
        text: 'Please fill all required fields correctly.'
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
            timer: 1500
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
          text: error.error?.errorMessage || 'Failed to update case information.'
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/apps/caseinfo/case-list']);
  }
}
