import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PermissionGuard } from '../../../core/guards/permission.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { UserCreateComponent } from './pages/users/user-create/user-create.component';
import { UserEditComponent } from './pages/users/user-edit/user-edit.component';
import { RoleListComponent } from './pages/roles/role-list/role-list.component';
import { RoleCreateComponent } from './pages/roles/role-create/role-create.component';
import { RoleEditComponent } from './pages/roles/role-edit/role-edit.component';
import { PermissionListComponent } from './pages/permissions/permission-list/permission-list.component';
import { PermissionCreateComponent } from './pages/permissions/permission-create/permission-create.component';
import { PermissionEditComponent } from './pages/permissions/permission-edit/permission-edit.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'users',
        canActivate: [PermissionGuard],
        data: { permission: 'view_user' },
        children: [
          {
            path: '',
            component: UserListComponent
          },
          {
            path: 'create',
            component: UserCreateComponent,
            canActivate: [PermissionGuard],
            data: { permission: 'add_user' }
          },
          {
            path: 'edit/:id',
            component: UserEditComponent,
            canActivate: [PermissionGuard],
            data: { permission: 'change_user' }
          }
        ]
      },
      {
        path: 'roles',
        canActivate: [PermissionGuard],
        data: { permission: 'view_role' },
        children: [
          {
            path: '',
            component: RoleListComponent
          },
          {
            path: 'create',
            component: RoleCreateComponent,
            canActivate: [PermissionGuard],
            data: { permission: 'add_role' }
          },
          {
            path: 'edit/:id',
            component: RoleEditComponent,
            canActivate: [PermissionGuard],
            data: { permission: 'change_role' }
          }
        ]
      },
      {
        path: 'permissions',
        canActivate: [PermissionGuard],
        data: { permission: 'view_permission' },
        children: [
          {
            path: '',
            component: PermissionListComponent
          },
          {
            path: 'create',
            component: PermissionCreateComponent,
            canActivate: [PermissionGuard],
            data: { permission: 'add_permission' }
          },
          {
            path: 'edit/:id',
            component: PermissionEditComponent,
            canActivate: [PermissionGuard],
            data: { permission: 'change_permission' }
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }