import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../../../core/services/user.service';
import { RoleService } from '../../../../../../core/services/role.service';
import { User, UserUpdate } from '../../../../../../core/models/user.model';
import { Role } from '../../../../../../core/models/role.model';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup;
  user: User | null = null;
  roles: Role[] = [];
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  userId: number;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userId = +this.route.snapshot.paramMap.get('id')!;
    
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', [Validators.required, Validators.minLength(1)]],
      last_name: ['', [Validators.required, Validators.minLength(1)]],
      roles: [[]],
      is_active: [true]
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Load user and roles in parallel
    Promise.all([
      this.loadUser(),
      this.loadRoles()
    ]).then(() => {
      this.isLoading = false;
    }).catch((error) => {
      console.error('Error loading user data:', error);
      this.errorMessage = 'Failed to load user data';
      this.isLoading = false;
    });
  }

  private async loadUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getUser(this.userId).subscribe({
        next: (user) => {
          this.user = user;
          this.populateForm(user);
          resolve();
        },
        error: (error) => {
          console.error('Error loading user:', error);
          reject(error);
        }
      });
    });
  }

  private async loadRoles(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.roleService.getRoles({ page_size: 1000 }).subscribe({
        next: (response) => {
          this.roles = response.results;
          resolve();
        },
        error: (error) => {
          console.error('Error loading roles:', error);
          reject(error);
        }
      });
    });
  }

  private populateForm(user: User): void {
    this.userForm.patchValue({
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      is_active: user.is_active,
      roles: user.roles?.map(role => role.id) || []
    });
  }

  onSubmit(): void {
    if (this.userForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const formValue = this.userForm.value;
      const userUpdate: UserUpdate = {
        username: formValue.username,
        email: formValue.email,
        first_name: formValue.first_name,
        last_name: formValue.last_name,
        is_active: formValue.is_active,
        roles: formValue.roles
      };

      this.userService.updateUser(this.userId, userUpdate).subscribe({
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
    const currentRoles = this.rolesControl.value || [];
    const isChecked = event.target.checked;
    
    if (isChecked) {
      if (!currentRoles.includes(roleId)) {
        this.rolesControl.setValue([...currentRoles, roleId]);
      }
    } else {
      this.rolesControl.setValue(currentRoles.filter((id: number) => id !== roleId));
    }
  }

  private getErrorMessage(error: any): string {
    if (error.status === 400 && error.error) {
      const errors = error.error;
      if (errors.username) return 'Username already exists';
      if (errors.email) return 'Email already exists';
    }
    return 'Failed to update user. Please try again.';
  }

  // Getters for form controls
  get username() { return this.userForm.get('username'); }
  get email() { return this.userForm.get('email'); }
  get first_name() { return this.userForm.get('first_name'); }
  get last_name() { return this.userForm.get('last_name'); }
  get is_active() { return this.userForm.get('is_active'); }
  get rolesControl() { return this.userForm.get('roles'); }
}