import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PermissionService } from '../../../../../../core/services/permission.service';
import { Permission } from '../../../../../../core/models/permission.model';
import { PaginatedResponse } from '../../../../../../core/models/common.model';

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss']
})
export class PermissionListComponent implements OnInit, OnDestroy {
  permissions: Permission[] = [];
  totalPermissions = 0;
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  filterMethod = '';
  isLoading = false;
  errorMessage = '';
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  httpMethods: string[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

  constructor(
    private permissionService: PermissionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPermissions();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch(): void {
    this.searchSubject
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((searchTerm) => {
        this.searchTerm = searchTerm;
        this.currentPage = 1;
        this.loadPermissions();
      });
  }

  private loadPermissions(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const params = {
      page: this.currentPage,
      page_size: this.pageSize,
      search: this.searchTerm || undefined,
      http_method: this.filterMethod || undefined
    };

    this.permissionService.getPermissions(params).subscribe({
      next: (response: PaginatedResponse<Permission>) => {
        this.permissions = response.results;
        this.totalPermissions = response.count;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load permissions. Please try again.';
        this.isLoading = false;
        console.error('Error loading permissions:', error);
      }
    });
  }

  onSearchChange(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  onMethodFilterChange(method: string): void {
    this.filterMethod = method;
    this.currentPage = 1;
    this.loadPermissions();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPermissions();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadPermissions();
  }

  createPermission(): void {
    this.router.navigate(['/admin/permissions/create']);
  }

  editPermission(permission: Permission): void {
    this.router.navigate(['/admin/permissions/edit', permission.id]);
  }

  deletePermission(permission: Permission): void {
    if (confirm(`Are you sure you want to delete permission "${permission.name}"?`)) {
      this.permissionService.deletePermission(permission.id).subscribe({
        next: () => {
          this.loadPermissions();
        },
        error: (error) => {
          console.error('Error deleting permission:', error);
          alert('Failed to delete permission. Please try again.');
        }
      });
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalPermissions / this.pageSize);
  }

  get pageNumbers(): number[] {
    const pages = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getMethodClass(method: string | undefined): string {
    if (!method) return 'method-badge';
    
    switch (method.toUpperCase()) {
      case 'GET':
        return 'method-badge method-get';
      case 'POST':
        return 'method-badge method-post';
      case 'PUT':
        return 'method-badge method-put';
      case 'PATCH':
        return 'method-badge method-patch';
      case 'DELETE':
        return 'method-badge method-delete';
      default:
        return 'method-badge';
    }
  }
}