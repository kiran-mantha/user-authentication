import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserCreate, UserUpdate } from '../models/user.model';
import { PaginatedResponse } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = '/api/users';

  constructor(private http: HttpClient) {}

  getUsers(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    is_active?: boolean;
  }): Observable<PaginatedResponse<User>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key as keyof typeof params] !== undefined) {
          httpParams = httpParams.set(key, params[key as keyof typeof params]!.toString());
        }
      });
    }

    return this.http.get<PaginatedResponse<User>>(this.API_URL, { params: httpParams });
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}/`);
  }

  createUser(user: UserCreate): Observable<User> {
    return this.http.post<User>(this.API_URL, user);
  }

  updateUser(id: number, user: UserUpdate): Observable<User> {
    return this.http.patch<User>(`${this.API_URL}/${id}/`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}/`);
  }

  activateUser(id: number): Observable<User> {
    return this.http.patch<User>(`${this.API_URL}/${id}/activate/`, {});
  }

  deactivateUser(id: number): Observable<User> {
    return this.http.patch<User>(`${this.API_URL}/${id}/deactivate/`, {});
  }
}