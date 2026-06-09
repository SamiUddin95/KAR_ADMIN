import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { tap, takeWhile } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { LoginRequest, LoginResponse, UserData } from '@core/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_DATA_KEY = 'user_data';
  private readonly EXPIRES_UTC_KEY = 'expires_utc';
  
  private currentUserSubject = new BehaviorSubject<UserData | null>(this.getUserData());
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private tokenExpiryCheckInterval: any;

  constructor() {
    this.initTokenExpiryCheck();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/Auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.status === 'success' && response.data) {
            this.setSession(response.data);
            this.currentUserSubject.next(response.data);
            this.initTokenExpiryCheck();
          }
        })
      );
  }

  private setSession(userData: UserData): void {
    sessionStorage.setItem(this.TOKEN_KEY, userData.token);
    sessionStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
    sessionStorage.setItem(this.EXPIRES_UTC_KEY, userData.expiresUtc);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  getUserData(): UserData | null {
    const userData = sessionStorage.getItem(this.USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  getExpiresUtc(): string | null {
    return sessionStorage.getItem(this.EXPIRES_UTC_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_DATA_KEY);
    sessionStorage.removeItem(this.EXPIRES_UTC_KEY);
    this.currentUserSubject.next(null);
    
    if (this.tokenExpiryCheckInterval) {
      clearInterval(this.tokenExpiryCheckInterval);
    }
    
    this.router.navigate(['/sign-in']);
  }

  private initTokenExpiryCheck(): void {
    if (this.tokenExpiryCheckInterval) {
      clearInterval(this.tokenExpiryCheckInterval);
    }

    if (!this.isLoggedIn()) {
      return;
    }

    this.tokenExpiryCheckInterval = setInterval(() => {
      const expiresUtc = this.getExpiresUtc();
      
      if (!expiresUtc) {
        this.logout();
        return;
      }

      const expiryTime = new Date(expiresUtc).getTime();
      const currentTime = new Date().getTime();
      const timeUntilExpiry = expiryTime - currentTime;
      
      const oneMinuteInMs = 60 * 1000;
      
      if (timeUntilExpiry <= oneMinuteInMs) {
        this.logout();
      }
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.tokenExpiryCheckInterval) {
      clearInterval(this.tokenExpiryCheckInterval);
    }
  }
}
