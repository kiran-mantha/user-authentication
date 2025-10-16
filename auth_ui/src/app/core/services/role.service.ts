import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role, RoleCreate, RoleUpdate } from '../models/role.model';
import { Permission } from '../models/permission.model';
import { PaginatedResponse } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly API_URL = '/api/roles';

  constructor(private http: HttpClient) {}

  getRoles(params?: {
    page?: number;
    page_size?: number;
    search?: string;
  }): Observable<PaginatedResponse<Role>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key as keyof typeof params] !== undefined) {
          httpParams = httpParams.set(key, params[key as keyof typeof params]!.toString());
        }
      });
    }

    return this.http.get<PaginatedResponse<Role>>(this.API_URL, { params: httpParams });
  }

  getRole(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.API_URL}/${id}/`);
  }

  createRole(role: RoleCreate): Observable<Role> {
    return this.http.post<Role>(this.API_URL, role);
  }

  updateRole(id: number, role: RoleUpdate): Observable<Role> {
    return this.http.patch<Role>(`${this.API_URL}/${id}/`, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}/`);
  }

  assignPermissions(roleId: number, permissionIds: number[]): Observable<Role> {
    return this.http.post<Role>(`${this.API_URL}/${roleId}/assign_permissions/`, {
      permissions: permissionIds
    });
  }

  removePermissions(roleId: number, permissionIds: number[]): Observable<Role> {
    return this.http.post<Role>(`${this.API_URL}/${roleId}/remove_permissions/`, {
      permissions: permissionIds
    });
  }

  getRolePermissions(roleId: number): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.API_URL}/${roleId}/permissions/`);
  }
}