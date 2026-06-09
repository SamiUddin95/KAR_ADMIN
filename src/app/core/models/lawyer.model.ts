export interface Lawyer {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  biography: string;
  description: string;
  rating: number;
  reviews: number;
  profilePhoto: string;
  status: string | null;
  experience: string | null;
  total_Cases: number | null;
  win_Rate: number | null;
  active_Cases: number | null;
  expertise: string | null;
  office_hours: string | null;
  isActive: boolean;
  createdBy: string;
  createdOn: string;
  updatedBy: string;
  updatedOn: string;
}

export interface LawyerListResponse {
  status: string;
  data: {
    items: Lawyer[];
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
