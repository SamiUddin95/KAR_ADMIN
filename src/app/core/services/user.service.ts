import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { User, PaginatedResponse, PaginationParams } from '@core/models/user.model';

export interface UserResponse {
  status: string;
  data: User;
  statusCode: number;
  errorMessage: string | null;
}

export interface DeleteResponse {
  status: string;
  data: any;
  statusCode: number;
  errorMessage: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  getUsers(params: PaginationParams): Observable<PaginatedResponse<User>> {
    const httpParams = new HttpParams()
      .set('pageNumber', params.pageNumber.toString())
      .set('pageSize', params.pageSize.toString());

    return this.http.get<PaginatedResponse<User>>(`${environment.apiUrl}/Users`, { params: httpParams });
  }

  getUserById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${environment.apiUrl}/Users/${id}`);
  }

  updateUser(user: User): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${environment.apiUrl}/Users`, user);
  }

  deleteUser(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${environment.apiUrl}/Users/${id}`);
  }
}
