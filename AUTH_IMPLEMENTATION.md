# Authentication Implementation Summary

## Overview
Complete authentication system integrated with the KAR API for login, token management, and auto-logout functionality.

## Files Created/Modified

### 1. Environment Configuration
- **`src/environments/environment.ts`** - Development environment with API base URL
- **`src/environments/environment.prod.ts`** - Production environment configuration

### 2. Core Authentication Files
- **`src/app/core/models/auth.model.ts`** - TypeScript interfaces for login request/response
- **`src/app/core/services/auth.service.ts`** - Main authentication service
- **`src/app/core/interceptors/auth.interceptor.ts`** - HTTP interceptor to add token to all requests
- **`src/app/core/guards/auth.guard.ts`** - Route guard to protect authenticated routes

### 3. Updated Files
- **`src/app/views/auth/sign-in/sign-in.component.ts`** - Updated to use AuthService
- **`src/app/app.config.ts`** - Added HttpClient and auth interceptor
- **`src/app/app.routes.ts`** - Added auth guard to protected routes
- **`tsconfig.json`** - Added @environments path alias

## Features Implemented

### ✅ Login API Integration
- Endpoint: `http://kar.runasp.net/api/Auth/login`
- Request body: `{ email, password }`
- Response handling with success/error messages

### ✅ Token Management
- Token stored in **sessionStorage** (as requested)
- Automatic token inclusion in all API requests via interceptor
- User data stored alongside token

### ✅ Auto-Logout System
- Token expiry tracked using `expiresUtc` from API response
- Automatic logout **1 minute before** token expiry
- Background check runs every 10 seconds
- Redirects to sign-in page after logout

### ✅ Route Protection
- Auth guard protects all routes under MainLayoutComponent
- Automatic redirect to sign-in if not authenticated
- Token expiry check on route navigation

## How It Works

### Login Flow
1. User enters email and password
2. AuthService calls login API
3. On success:
   - Token, user data, and expiry time stored in sessionStorage
   - Success message displayed with user's full name
   - User redirected to dashboard
   - Token expiry monitoring starts

### Token Auto-Expiry
1. Background interval checks token expiry every 10 seconds
2. If current time is within 1 minute of expiry:
   - User automatically logged out
   - All session data cleared
   - Redirected to sign-in page

### API Request Flow
1. Any HTTP request made in the app
2. Auth interceptor checks for token
3. If token exists, adds `Authorization: Bearer {token}` header
4. Request proceeds to API

### Route Protection
1. User navigates to protected route
2. Auth guard checks if user is logged in
3. Checks if token is still valid (not within 1 minute of expiry)
4. If valid: allows navigation
5. If invalid: logs out and redirects to sign-in

## Usage Example

### Making API Calls
```typescript
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

// Token automatically added by interceptor
this.http.get(`${environment.apiUrl}/your-endpoint`).subscribe();
```

### Checking Auth Status
```typescript
import { AuthService } from '@core/services/auth.service';

constructor(private authService: AuthService) {
  if (this.authService.isLoggedIn()) {
    const userData = this.authService.getUserData();
    console.log(userData?.fullName);
  }
}
```

### Manual Logout
```typescript
this.authService.logout(); // Clears session and redirects
```

## Security Features
- Token stored in sessionStorage (cleared on browser close)
- Automatic token expiry management
- Protected routes with auth guard
- Centralized authentication logic

## API Response Structure
```json
{
  "status": "success",
  "data": {
    "userId": 24,
    "userType": null,
    "fullName": "Okasha Zubair",
    "token": "eyJhbGci...",
    "expiresUtc": "2026-06-01T21:22:28.6115559Z",
    "expiresLocal": "2026-06-01T23:22:28.6115559+02:00"
  },
  "statusCode": 200,
  "errorMessage": null
}
```

## Testing
1. Start the development server: `npm start`
2. Navigate to sign-in page
3. Use credentials:
   - Email: `oka@gmail.com`
   - Password: `oka123`
4. Verify successful login and redirect
5. Check sessionStorage for token
6. Verify token is added to API requests in Network tab

## Notes
- Token expiry check runs every 10 seconds
- Auto-logout happens 1 minute before actual expiry
- All protected routes require authentication
- SweetAlert2 used for user-friendly notifications
