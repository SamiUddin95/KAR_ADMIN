import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { LawyerListResponse, PaginationParams } from '@core/models/lawyer.model';

@Injectable({
  providedIn: 'root'
})
export class LawyerService {
  private http = inject(HttpClient);

  getLawyers(params: PaginationParams): Observable<LawyerListResponse> {
    const httpParams = new HttpParams()
      .set('pageNumber', params.pageNumber.toString())
      .set('pageSize', params.pageSize.toString());

    return this.http.get<LawyerListResponse>(`${environment.apiUrl}/LawyerInfos`, { params: httpParams });
  }
}
