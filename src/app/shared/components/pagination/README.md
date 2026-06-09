# Generic Pagination Component

A reusable, beautiful pagination component for all your paginated lists.

## Quick Start

### 1. Import
```typescript
import { PaginationComponent, PaginationConfig } from '@/app/shared/components/pagination/pagination.component';

@Component({
  imports: [PaginationComponent]
})
```

### 2. Setup Configuration
```typescript
paginationConfig: PaginationConfig = {
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0
};
```

### 3. Use in Template
```html
<app-pagination
  [config]="paginationConfig"
  [itemsName]="'items'"
  (pageChange)="onPageChange($event)"
/>
```

### 4. Handle Page Change
```typescript
onPageChange(page: number): void {
  this.paginationConfig.currentPage = page;
  this.loadData();
}
```

## API

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `config` | `PaginationConfig` | Required | Pagination configuration |
| `itemsName` | `string` | `'items'` | Name of items being paginated |
| `maxVisiblePages` | `number` | `5` | Maximum page numbers to show |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `pageChange` | `EventEmitter<number>` | Emits when page changes |

### PaginationConfig Interface

```typescript
interface PaginationConfig {
  currentPage: number;    // Current page number (1-based)
  pageSize: number;       // Items per page
  totalItems: number;     // Total number of items
  totalPages: number;     // Total number of pages
}
```

## Examples

### Basic Usage
```html
<app-pagination
  [config]="paginationConfig"
  (pageChange)="onPageChange($event)"
/>
```

### Custom Item Name
```html
<app-pagination
  [config]="paginationConfig"
  [itemsName]="'users'"
  (pageChange)="onPageChange($event)"
/>
```

### More Visible Pages
```html
<app-pagination
  [config]="paginationConfig"
  [maxVisiblePages]="7"
  (pageChange)="onPageChange($event)"
/>
```

## Features

- ✅ Smart page number display with ellipsis
- ✅ Shows item range (e.g., "Showing 1 to 10 of 100 items")
- ✅ Previous/Next navigation
- ✅ Direct page number navigation
- ✅ Disabled states for boundaries
- ✅ Responsive design
- ✅ Matches project theme

## Page Display Logic

- **Few pages** (≤ maxVisiblePages): Shows all pages
  - Example: `1 2 3 4 5`

- **Many pages**: Shows with ellipsis
  - Example: `1 ... 5 6 7 ... 20`
  - Current page always visible
  - First and last pages always visible
