import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { 
  CaseInfoListResponse, 
  CaseInfoDetailResponse, 
  CaseInfoUpdateRequest,
  CaseInfoUpdateResponse,
  PaginationParams 
} from '@core/models/caseinfo.model';

@Injectable({
  providedIn: 'root'
})
export class CaseInfoService {
  private http = inject(HttpClient);

  getCaseInfos(params: PaginationParams): Observable<CaseInfoListResponse> {
    const httpParams = new HttpParams()
      .set('pageNumber', params.pageNumber.toString())
      .set('pageSize', params.pageSize.toString());

    return this.http.get<CaseInfoListResponse>(`${environment.apiUrl}/CaseInfos/admin/list`, { params: httpParams });
  }

  getCaseInfoById(id: number): Observable<CaseInfoDetailResponse> {
    return this.http.get<CaseInfoDetailResponse>(`${environment.apiUrl}/CaseInfos/${id}`);
  }

  updateCaseInfo(request: CaseInfoUpdateRequest): Observable<CaseInfoUpdateResponse> {
    return this.http.put<CaseInfoUpdateResponse>(`${environment.apiUrl}/CaseInfos/${request.id}`, request);
  }
}
