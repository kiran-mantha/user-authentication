import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RoleService } from '../../../../../../core/services/role.service';
import { PermissionService } from '../../../../../../core/services/permission.service';
import { RoleCreate } from '../../../../../../core/models/role.model';
import { Permission } from '../../../../../../core/models/permission.model';

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.scss']
})
export class RoleCreateComponent implements OnInit {
  roleForm: FormGroup;
  permissions: Permission[] = [];
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private router: Router
  ) {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      permissions: [[]]
    });
  }

  ngOnInit(): void {
    this.loadPermissions();
  }

  private loadPermissions(): void {
    this.isLoading = true;
    this.permissionService.getPermissions({ page_size: 1000 }).subscribe({
      next: (response) => {
        this.permissions = response.results;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading permissions:', error);
        this.errorMessage = 'Failed to load permissions';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.roleForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const formValue = this.roleForm.value;
      const roleCreate: RoleCreate = {
        name: formValue.name,
        description: formValue.description,
        permissions: formValue.permissions
      };

      this.roleService.createRole(roleCreate).subscribe({
        next: (role) => {
          this.isSubmitting = false;
          this.router.navigate(['/admin/roles']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = this.getErrorMessage(error);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/roles']);
  }

  onPermissionToggle(permissionId: number, event: any): void {
    const currentPermissions = this.permissionsControl.value || [];
    const isChecked = event.target.checked;
    
    if (isChecked) {
      if (!currentPermissions.includes(permissionId)) {
        this.permissionsControl.setValue([...currentPermissions, permissionId]);
      }
    } else {
      this.permissionsControl.setValue(currentPermissions.filter((id: number) => id !== permissionId));
    }
  }

  private getErrorMessage(error: any): string {
    if (error.status === 400 && error.error) {
      const errors = error.error;
      if (errors.name) return 'Role name already exists';
    }
    return 'Failed to create role. Please try again.';
  }

  getPermissionCategories(): string[] {
    const categories = new Set<string>();
    this.permissions.forEach(permission => {
      const category = this.categorizePermission(permission);
      categories.add(category);
    });
    return Array.from(categories).sort();
  }

  getPermissionsByCategory(category: string): Permission[] {
    return this.permissions.filter(permission => 
      this.categorizePermission(permission) === category
    );
  }

  private categorizePermission(permission: Permission): string {
    if (!permission.api_endpoint) return 'General';
    
    const endpoint = permission.api_endpoint;
    if (endpoint.includes('users')) return 'Users';
    if (endpoint.includes('roles')) return 'Roles';
    if (endpoint.includes('permissions')) return 'Permissions';
    if (endpoint.includes('auth')) return 'Authentication';
    
    return 'Other';
  }

  // Getters for form controls
  get name() { return this.roleForm.get('name'); }
  get description() { return this.roleForm.get('description'); }
  get permissionsControl() { return this.roleForm.get('permissions'); }
}