export interface User {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  password: string | null;
  address: string;
  city: string | null;
  profilePhoto: string | null;
  userType: string | null;
  isActive: boolean;
  createdBy: string;
  createdOn: string;
  updatedBy: string;
  updatedOn: string;
}

export interface PaginatedResponse<T> {
  status: string;
  data: {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
  statusCode: number;
  errorMessage: string | null;
}

export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
}
