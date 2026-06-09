import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';

export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, NgIcon],
  template: `
    <div class="row align-items-center text-center text-sm-start justify-content-between">
      <div class="col-sm">
        <div class="text-muted">
          Showing <span class="fw-semibold">{{ startItem }}</span> to
          <span class="fw-semibold">{{ endItem }}</span> of
          <span class="fw-semibold">{{ config.totalItems }}</span>
          {{ itemsName }}
        </div>
      </div>

      <div class="col-sm-auto mt-3 mt-sm-0">
        <ul class="pagination pagination-boxed mb-0 justify-content-center">
          <li class="page-item" [class.disabled]="!canGoPrevious">
            <button
              class="page-link"
              (click)="onPageChange(config.currentPage - 1)"
              [disabled]="!canGoPrevious"
              aria-label="Previous page"
              type="button"
            >
              <ng-icon name="tablerChevronLeft" />
            </button>
          </li>

          @for (page of visiblePages; track page) {
            @if (page === -1) {
              <li class="page-item disabled">
                <span class="page-link">...</span>
              </li>
            } @else {
              <li class="page-item" [class.active]="config.currentPage === page">
                <button class="page-link" type="button" (click)="onPageChange(page)">
                  {{ page }}
                </button>
              </li>
            }
          }

          <li class="page-item" [class.disabled]="!canGoNext">
            <button
              class="page-link"
              (click)="onPageChange(config.currentPage + 1)"
              [disabled]="!canGoNext"
              aria-label="Next page"
              type="button"
            >
              <ng-icon name="tablerChevronRight" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .page-item.disabled .page-link {
      cursor: not-allowed;
    }
    .page-link {
      color: #FFD700;
      border-color: rgba(255, 215, 0, 0.3);
      background: rgba(255, 255, 255, 0.05);
      transition: all 0.3s ease;
    }
    .page-link:hover {
      background: linear-gradient(135deg, #FFD700 0%, #C5A000 100%);
      color: #000;
      border-color: #FFD700;
      box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
    }
    .page-item.active .page-link {
      background: linear-gradient(135deg, #FFD700 0%, #C5A000 100%);
      color: #000;
      border-color: #FFD700;
      box-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
    }
    .page-item.disabled .page-link {
      color: rgba(255, 215, 0, 0.3);
      background: rgba(255, 255, 255, 0.02);
      border-color: rgba(255, 215, 0, 0.1);
    }
    .pagination-boxed .page-link {
      border-radius: 8px;
      margin: 0 2px;
    }
  `]
})
export class PaginationComponent {
  @Input() config!: PaginationConfig;
  @Input() itemsName: string = 'items';
  @Input() maxVisiblePages: number = 5;

  @Output() pageChange = new EventEmitter<number>();

  get startItem(): number {
    if (this.config.totalItems === 0) return 0;
    return (this.config.currentPage - 1) * this.config.pageSize + 1;
  }

  get endItem(): number {
    const end = this.config.currentPage * this.config.pageSize;
    return Math.min(end, this.config.totalItems);
  }

  get canGoPrevious(): boolean {
    return this.config.currentPage > 1;
  }

  get canGoNext(): boolean {
    return this.config.currentPage < this.config.totalPages;
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const total = this.config.totalPages;
    const current = this.config.currentPage;
    const max = this.maxVisiblePages;

    if (total <= max) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
      return pages;
    }

    const halfMax = Math.floor(max / 2);
    let startPage = Math.max(1, current - halfMax);
    let endPage = Math.min(total, current + halfMax);

    if (current <= halfMax) {
      endPage = max;
    } else if (current >= total - halfMax) {
      startPage = total - max + 1;
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push(-1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < total) {
      if (endPage < total - 1) {
        pages.push(-1);
      }
      pages.push(total);
    }

    return pages;
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.config.totalPages && page !== this.config.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
