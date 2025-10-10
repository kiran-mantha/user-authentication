import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AdminRoutingModule } from './admin-routing.module';
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
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UserTableComponent } from './components/user-table/user-table.component';
import { RoleTableComponent } from './components/role-table/role-table.component';
import { PermissionTableComponent } from './components/permission-table/permission-table.component';

@NgModule({
  declarations: [
    DashboardComponent,
    UserListComponent,
    UserCreateComponent,
    UserEditComponent,
    RoleListComponent,
    RoleCreateComponent,
    RoleEditComponent,
    PermissionListComponent,
    PermissionCreateComponent,
    PermissionEditComponent,
    SidebarComponent,
    UserTableComponent,
    RoleTableComponent,
    PermissionTableComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }