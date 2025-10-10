import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { RoleService } from '../../../../core/services/role.service';
import { PermissionService } from '../../../../core/services/permission.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  stats = {
    totalUsers: 0,
    activeUsers: 0,
    totalRoles: 0,
    totalPermissions: 0
  };
  isLoading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadDashboardStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCurrentUser(): void {
    this.authService.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((authState) => {
        this.currentUser = authState.user;
      });
  }

  private loadDashboardStats(): void {
    this.isLoading = true;

    // Load users
    this.userService.getUsers({ page_size: 1000 }).subscribe({
      next: (response) => {
        this.stats.totalUsers = response.count;
        this.stats.activeUsers = response.results.filter(user => user.is_active).length;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });

    // Load roles
    this.roleService.getRoles({ page_size: 1000 }).subscribe({
      next: (response) => {
        this.stats.totalRoles = response.count;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
      }
    });

    // Load permissions
    this.permissionService.getPermissions({ page_size: 1000 }).subscribe({
      next: (response) => {
        this.stats.totalPermissions = response.count;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading permissions:', error);
        this.isLoading = false;
      }
    });
  }

  getUserRoles(): string {
    return this.currentUser?.roles?.map((role: any) => role.name).join(', ') || 'No roles assigned';
  }
}