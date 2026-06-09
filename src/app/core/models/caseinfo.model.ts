export interface CaseInfo {
  id: number;
  caseId: string;
  caseType: string;
  date: string;
  userId: number;
  userName?: string;
  lawyerId: number | null;
  lawyerName?: string | null;
  submissionMethod: string;
  file_Location: string;
  file_Path: string;
  appointment_Type: string;
  appointmentDate: string;
  status: string;
  caseNumber: string | null;
  court: string | null;
  scheduleStatus: string | null;
  nextHearing: string | null;
  under_Section: string | null;
  advocate: string | null;
  createdBy: string;
  createdOn: string;
  updatedBy: string;
  updatedOn: string;
}

export interface CaseInfoNote {
  id: number;
  caseId: string;
  date: string;
  notes: string;
  createdBy: string | null;
  createdOn: string;
  updatedBy: string | null;
  updatedOn: string | null;
}

export interface CaseInfoDetail {
  caseInfo: CaseInfo;
  notes: CaseInfoNote[];
}

export interface EditableFields {
  lawyerId: number | null;
  caseNumber: string | null;
  court: string | null;
  nextHearing: string | null;
  scheduleStatus: string | null;
  under_Section: string | null;
  advocate: string | null;
}

export interface CaseInfoDetailResponse {
  status: string;
  data: {
    caseInfo: CaseInfo;
    notes?: CaseInfoNote[];
    editableFields?: EditableFields;
  };
  statusCode: number;
  errorMessage: string | null;
}

export interface CaseInfoListResponse {
  status: string;
  data: {
    items: CaseInfo[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
  statusCode: number;
  errorMessage: string | null;
}

export interface CaseInfoUpdateRequest {
  id: number;
  lawyerId?: number | null;
  caseNumber?: string | null;
  court?: string | null;
  nextHearing?: string | null;
  scheduleStatus?: string | null;
  under_Section?: string | null;
  advocate?: string | null;
  notes?: string;
}

export interface CaseInfoUpdateResponse {
  status: string;
  data: {
    caseInfo: CaseInfo;
    editableFields: EditableFields;
  };
  statusCode: number;
  errorMessage: string | null;
}

export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
}
