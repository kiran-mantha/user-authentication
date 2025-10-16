import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RoleService } from '../../../../../../core/services/role.service';
import { PermissionService } from '../../../../../../core/services/permission.service';
import { Role, RoleUpdate } from '../../../../../../core/models/role.model';
import { Permission } from '../../../../../../core/models/permission.model';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})
export class RoleEditComponent implements OnInit {
  roleForm: FormGroup;
  role: Role | null = null;
  permissions: Permission[] = [];
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  roleId: number;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.roleId = +this.route.snapshot.paramMap.get('id')!;
    
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      permissions: [[]]
    });
  }

  ngOnInit(): void {
    this.loadRoleData();
  }

  private loadRoleData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Load role and permissions in parallel
    Promise.all([
      this.loadRole(),
      this.loadPermissions()
    ]).then(() => {
      this.isLoading = false;
    }).catch((error) => {
      console.error('Error loading role data:', error);
      this.errorMessage = 'Failed to load role data';
      this.isLoading = false;
    });
  }

  private async loadRole(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.roleService.getRole(this.roleId).subscribe({
        next: (role) => {
          this.role = role;
          this.populateForm(role);
          resolve();
        },
        error: (error) => {
          console.error('Error loading role:', error);
          reject(error);
        }
      });
    });
  }

  private async loadPermissions(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.permissionService.getPermissions({ page_size: 1000 }).subscribe({
        next: (response) => {
          this.permissions = response.results;
          resolve();
        },
        error: (error) => {
          console.error('Error loading permissions:', error);
          reject(error);
        }
      });
    });
  }

  private populateForm(role: Role): void {
    this.roleForm.patchValue({
      name: role.name,
      description: role.description,
      permissions: role.permissions?.map(permission => permission.id) || []
    });
  }

  onSubmit(): void {
    if (this.roleForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const formValue = this.roleForm.value;
      const roleUpdate: RoleUpdate = {
        name: formValue.name,
        description: formValue.description,
        permissions: formValue.permissions
      };

      this.roleService.updateRole(this.roleId, roleUpdate).subscribe({
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

  private getErrorMessage(error: any): string {
    if (error.status === 400 && error.error) {
      const errors = error.error;
      if (errors.name) return 'Role name already exists';
    }
    return 'Failed to update role. Please try again.';
  }

  // Getters for form controls
  get name() { return this.roleForm.get('name'); }
  get description() { return this.roleForm.get('description'); }
  get permissionsControl() { return this.roleForm.get('permissions'); }
}