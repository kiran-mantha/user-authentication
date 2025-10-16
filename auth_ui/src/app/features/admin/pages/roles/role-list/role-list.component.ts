import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RoleService } from '../../../../../../core/services/role.service';
import { Role } from '../../../../../../core/models/role.model';
import { PaginatedResponse } from '../../../../../../core/models/common.model';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit, OnDestroy {
  roles: Role[] = [];
  totalRoles = 0;
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  isLoading = false;
  errorMessage = '';
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private roleService: RoleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRoles();
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
        this.loadRoles();
      });
  }

  private loadRoles(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const params = {
      page: this.currentPage,
      page_size: this.pageSize,
      search: this.searchTerm || undefined
    };

    this.roleService.getRoles(params).subscribe({
      next: (response: PaginatedResponse<Role>) => {
        this.roles = response.results;
        this.totalRoles = response.count;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load roles. Please try again.';
        this.isLoading = false;
        console.error('Error loading roles:', error);
      }
    });
  }

  onSearchChange(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadRoles();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadRoles();
  }

  createRole(): void {
    this.router.navigate(['/admin/roles/create']);
  }

  editRole(role: Role): void {
    this.router.navigate(['/admin/roles/edit', role.id]);
  }

  deleteRole(role: Role): void {
    if (confirm(`Are you sure you want to delete role "${role.name}"?`)) {
      this.roleService.deleteRole(role.id).subscribe({
        next: () => {
          this.loadRoles();
        },
        error: (error) => {
          console.error('Error deleting role:', error);
          alert('Failed to delete role. Please try again.');
        }
      });
    }
  }

  getRolePermissions(role: Role): string {
    return role.permissions?.map(perm => perm.name).join(', ') || 'No permissions';
  }

  get totalPages(): number {
    return Math.ceil(this.totalRoles / this.pageSize);
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
}