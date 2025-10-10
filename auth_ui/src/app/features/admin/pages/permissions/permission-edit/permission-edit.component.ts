import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PermissionService } from '../../../../../../core/services/permission.service';
import { Permission, PermissionUpdate } from '../../../../../../core/models/permission.model';

@Component({
  selector: 'app-permission-edit',
  templateUrl: './permission-edit.component.html',
  styleUrls: ['./permission-edit.component.scss']
})
export class PermissionEditComponent implements OnInit {
  permissionForm: FormGroup;
  permission: Permission | null = null;
  httpMethods: string[] = [];
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  permissionId: number;

  constructor(
    private fb: FormBuilder,
    private permissionService: PermissionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.permissionId = +this.route.snapshot.paramMap.get('id')!;
    
    this.permissionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      codename: ['', [Validators.required, Validators.pattern(/^[a-z_]+$/)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      api_endpoint: ['', [Validators.pattern(/^\/api\/[a-zA-Z0-9_\/\-]*\/$/)]],
      http_method: ['']
    });
  }

  ngOnInit(): void {
    this.loadHttpMethods();
    this.loadPermission();
  }

  private loadHttpMethods(): void {
    this.httpMethods = this.permissionService.getAvailableHttpMethods();
  }

  private loadPermission(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.permissionService.getPermission(this.permissionId).subscribe({
      next: (permission) => {
        this.permission = permission;
        this.populateForm(permission);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading permission:', error);
        this.errorMessage = 'Failed to load permission data';
        this.isLoading = false;
      }
    });
  }

  private populateForm(permission: Permission): void {
    this.permissionForm.patchValue({
      name: permission.name,
      codename: permission.codename,
      description: permission.description,
      api_endpoint: permission.api_endpoint || '',
      http_method: permission.http_method || ''
    });
  }

  onSubmit(): void {
    if (this.permissionForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const formValue = this.permissionForm.value;
      const permissionUpdate: PermissionUpdate = {
        name: formValue.name,
        codename: formValue.codename,
        description: formValue.description,
        api_endpoint: formValue.api_endpoint || undefined,
        http_method: formValue.http_method || undefined
      };

      this.permissionService.updatePermission(this.permissionId, permissionUpdate).subscribe({
        next: (permission) => {
          this.isSubmitting = false;
          this.router.navigate(['/admin/permissions']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = this.getErrorMessage(error);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/permissions']);
  }

  private getErrorMessage(error: any): string {
    if (error.status === 400 && error.error) {
      const errors = error.error;
      if (errors.codename) return 'Permission codename already exists';
      if (errors.name) return 'Permission name already exists';
    }
    return 'Failed to update permission. Please try again.';
  }

  // Getters for form controls
  get name() { return this.permissionForm.get('name'); }
  get codename() { return this.permissionForm.get('codename'); }
  get description() { return this.permissionForm.get('description'); }
  get api_endpoint() { return this.permissionForm.get('api_endpoint'); }
  get http_method() { return this.permissionForm.get('http_method'); }
}