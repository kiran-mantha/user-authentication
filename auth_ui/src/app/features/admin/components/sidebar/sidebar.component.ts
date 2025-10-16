import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  permission?: string;
  role?: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  isCollapsed = false;
  private destroy$ = new Subject<void>();

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: '📊',
      route: '/admin/dashboard'
    },
    {
      label: 'Users',
      icon: '👥',
      route: '/admin/users',
      permission: 'view_user'
    },
    {
      label: 'Roles',
      icon: '🎭',
      route: '/admin/roles',
      permission: 'view_role'
    },
    {
      label: 'Permissions',
      icon: '🔐',
      route: '/admin/permissions',
      permission: 'view_permission'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((authState) => {
        this.currentUser = authState.user;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    this.authService.logout().subscribe();
  }

  isMenuItemVisible(item: MenuItem): boolean {
    if (item.permission) {
      return this.authService.hasPermission(item.permission);
    }
    if (item.role) {
      return this.authService.hasRole(item.role);
    }
    return true;
  }

  isActiveRoute(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}