import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../../../core/services/user.service';
import { RoleService } from '../../../../../../core/services/role.service';
import { UserCreate } from '../../../../../../core/models/user.model';
import { Role } from '../../../../../../core/models/role.model';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {
  userForm: FormGroup;
  roles: Role[] = [];
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', [Validators.required, Validators.minLength(1)]],
      last_name: ['', [Validators.required, Validators.minLength(1)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      roles: [[]],
      is_active: [true]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  private passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    
    return null;
  }

  private loadRoles(): void {
    this.isLoading = true;
    this.roleService.getRoles({ page_size: 1000 }).subscribe({
      next: (response) => {
        this.roles = response.results;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.errorMessage = 'Failed to load roles';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const formValue = this.userForm.value;
      const userCreate: UserCreate = {
        username: formValue.username,
        email: formValue.email,
        first_name: formValue.first_name,
        last_name: formValue.last_name,
        password: formValue.password,
        roles: formValue.roles
      };

      this.userService.createUser(userCreate).subscribe({
        next: (user) => {
          this.isSubmitting = false;
          this.router.navigate(['/admin/users']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = this.getErrorMessage(error);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/users']);
  }

  onRoleToggle(roleId: number, event: any): void {
    const currentRoles = this.roles.value || [];
    const isChecked = event.target.checked;
    
    if (isChecked) {
      if (!currentRoles.includes(roleId)) {
        this.roles.setValue([...currentRoles, roleId]);
      }
    } else {
      this.roles.setValue(currentRoles.filter((id: number) => id !== roleId));
    }
  }

  private getErrorMessage(error: any): string {
    if (error.status === 400 && error.error) {
      const errors = error.error;
      if (errors.username) return 'Username already exists';
      if (errors.email) return 'Email already exists';
    }
    return 'Failed to create user. Please try again.';
  }

  // Getters for form controls
  get username() { return this.userForm.get('username'); }
  get email() { return this.userForm.get('email'); }
  get first_name() { return this.userForm.get('first_name'); }
  get last_name() { return this.userForm.get('last_name'); }
  get password() { return this.userForm.get('password'); }
  get confirmPassword() { return this.userForm.get('confirmPassword'); }
  get roles() { return this.userForm.get('roles'); }
}