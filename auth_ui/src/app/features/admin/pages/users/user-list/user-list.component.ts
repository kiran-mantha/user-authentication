import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserService } from '../../../../../core/services/user.service';
import { User } from '../../../../../core/models/user.model';
import { PaginatedResponse } from '../../../../../core/models/common.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  totalUsers = 0;
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  isLoading = false;
  errorMessage = '';
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  protected readonly Math = Math;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
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
        this.loadUsers();
      });
  }

  private loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const params = {
      page: this.currentPage,
      page_size: this.pageSize,
      search: this.searchTerm || undefined
    };

    this.userService.getUsers(params).subscribe({
      next: (response: PaginatedResponse<User>) => {
        this.users = response.results;
        this.totalUsers = response.count;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load users. Please try again.';
        this.isLoading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  onSearchChange(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  onPageSizeChange(event: Event): void {
  const target = event.target as HTMLSelectElement | null;
  if (target) {
    const size = +target.value;
    this.pageSize = size;
    this.currentPage = 1;
    this.loadUsers();
  }
}

  createUser(): void {
    this.router.navigate(['/admin/users/create']);
  }

  editUser(user: User): void {
    this.router.navigate(['/admin/users/edit', user.id]);
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user. Please try again.');
        }
      });
    }
  }

  toggleUserStatus(user: User): void {
    const action = user.is_active ? 'deactivate' : 'activate';
    
    if (confirm(`Are you sure you want to ${action} user "${user.username}"?`)) {
      const updateAction = user.is_active 
        ? this.userService.deactivateUser(user.id)
        : this.userService.activateUser(user.id);

      updateAction.subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error(`Error ${action}ing user:`, error);
          alert(`Failed to ${action} user. Please try again.`);
        }
      });
    }
  }

  getUserRoles(user: User): string {
    return user.roles?.map(role => role.name).join(', ') || 'No roles';
  }

  get totalPages(): number {
    return Math.ceil(this.totalUsers / this.pageSize);
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