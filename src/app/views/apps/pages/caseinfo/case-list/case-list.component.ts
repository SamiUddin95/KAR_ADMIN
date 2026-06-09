import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { Router } from '@angular/router';
import { CaseInfoService } from '@core/services/caseinfo.service';
import { CaseInfo } from '@core/models/caseinfo.model';
import { PaginationComponent, PaginationConfig } from '@/app/shared/components/pagination/pagination.component';
import { PageTitleComponent } from '@/app/components/page-title.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-case-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIcon, PaginationComponent, PageTitleComponent],
  templateUrl: './case-list.component.html',
  styles: [`
    .table-responsive {
      overflow-x: auto;
    }
    .badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
    }
    .badge-pending {
      background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
      color: #000;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
    }
    .badge-approved {
      background: linear-gradient(135deg, #FFD700 0%, #DAA520 100%);
      color: #000;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
    }
    .badge-rejected {
      background: linear-gradient(135deg, #CD7F32 0%, #8B4513 100%);
      color: #fff;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(205, 127, 50, 0.3);
    }
    .case-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: linear-gradient(135deg, #FFD700 0%, #C5A000 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      font-weight: 600;
      font-size: 0.9rem;
      box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
    }
    ng-icon {
      cursor: pointer;
      transition: all 0.2s ease;
    }
    ng-icon:hover {
      transform: scale(1.15);
      opacity: 0.8;
    }
    .golden-icon {
      color: #FFD700;
      filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.5));
      transition: all 0.3s ease;
    }
    .golden-icon:hover {
      color: #FFE44D;
      filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8));
      transform: scale(1.2);
    }
    .golden-spinner {
      color: #FFD700;
      border-color: rgba(255, 215, 0, 0.25);
      border-right-color: #FFD700;
    }
    .table thead th {
      background: linear-gradient(135deg, #FFD700 0%, #B8860B 100%);
      color: #000;
      font-weight: 600;
      border: none;
      padding: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 0.85rem;
    }
    .table tbody tr {
      transition: all 0.3s ease;
      border-bottom: 1px solid rgba(255, 215, 0, 0.1);
    }
    .table tbody tr:hover {
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.05) 100%);
      transform: scale(1.01);
      box-shadow: 0 4px 15px rgba(255, 215, 0, 0.2);
    }
    .table td {
      color: #e0e0e0;
      border-color: rgba(255, 215, 0, 0.1);
    }
    .table .fw-semibold {
      color: #FFD700;
    }
    .card {
      border: none;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    .card-header {
      background: linear-gradient(135deg, #FFD700 0%, #B8860B 100%);
      color: #000;
      border-radius: 12px 12px 0 0;
      padding: 1.25rem;
      box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
    }
    .card-title {
      font-weight: 600;
      margin: 0;
    }
    @media (max-width: 768px) {
      .table-responsive {
        font-size: 0.875rem;
      }
      .case-icon {
        width: 32px;
        height: 32px;
        font-size: 0.75rem;
      }
      .badge {
        font-size: 0.65rem;
      }
    }
    @media (max-width: 576px) {
      .table thead th,
      .table tbody td {
        padding: 0.5rem;
      }
      .card-header {
        padding: 1rem;
      }
    }
  `]
})
export class CaseListComponent implements OnInit {
  private caseInfoService = inject(CaseInfoService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  caseInfos: CaseInfo[] = [];
  loading: boolean = false;
  
  paginationConfig: PaginationConfig = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  };

  ngOnInit(): void {
    this.loadCaseInfos();
  }

  loadCaseInfos(): void {
    this.loading = true;
    
    this.caseInfoService.getCaseInfos({
      pageNumber: this.paginationConfig.currentPage,
      pageSize: this.paginationConfig.pageSize
    }).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.caseInfos = response.data.items;
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
          text: error.error?.errorMessage || 'Failed to load case information. Please try again.'
        });
      }
    });
  }

  onPageChange(page: number): void {
    this.paginationConfig.currentPage = page;
    this.loadCaseInfos();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatDateTime(dateString: string): string {
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

  openDetailModal(caseId: number): void {
    this.router.navigate(['/apps/caseinfo/case-detail', caseId]);
  }
}
