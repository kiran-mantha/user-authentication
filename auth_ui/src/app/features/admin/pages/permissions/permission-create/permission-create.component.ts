import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PermissionService } from '../../../../../../core/services/permission.service';
import { PermissionCreate } from '../../../../../../core/models/permission.model';

@Component({
  selector: 'app-permission-create',
  templateUrl: './permission-create.component.html',
  styleUrls: ['./permission-create.component.scss']
})
export class PermissionCreateComponent implements OnInit {
  permissionForm: FormGroup;
  httpMethods: string[] = [];
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private permissionService: PermissionService,
    private router: Router
  ) {
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
  }

  private loadHttpMethods(): void {
    this.httpMethods = this.permissionService.getAvailableHttpMethods();
  }

  onSubmit(): void {
    if (this.permissionForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const formValue = this.permissionForm.value;
      const permissionCreate: PermissionCreate = {
        name: formValue.name,
        codename: formValue.codename,
        description: formValue.description,
        api_endpoint: formValue.api_endpoint || undefined,
        http_method: formValue.http_method || undefined
      };

      this.permissionService.createPermission(permissionCreate).subscribe({
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
    return 'Failed to create permission. Please try again.';
  }

  // Getters for form controls
  get name() { return this.permissionForm.get('name'); }
  get codename() { return this.permissionForm.get('codename'); }
  get description() { return this.permissionForm.get('description'); }
  get api_endpoint() { return this.permissionForm.get('api_endpoint'); }
  get http_method() { return this.permissionForm.get('http_method'); }
}