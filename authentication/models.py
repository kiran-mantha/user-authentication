import uuid

from django.core.validators import validate_email, MinLengthValidator, MaxLengthValidator
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils import timezone


class APIEndpoint(models.Model):
    """Represents a single API endpoint (e.g., GET /api/v1/users)"""
    path = models.CharField(max_length=200)
    method = models.CharField(max_length=10)
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return f"{self.name}"


class Permission(models.Model):
    """Logical permission that groups API endpoints"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    api_endpoints = models.ManyToManyField(APIEndpoint, blank=True)

    def __str__(self):
        return self.name


class Role(models.Model):
    """Role assigned to users"""
    name = models.CharField(max_length=50, unique=True)
    permissions = models.ManyToManyField(Permission, blank=True)

    def __str__(self):
        return self.name


class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not username:
            raise ValueError('Username is required')
        if not email:
            raise ValueError('Email is required')
        
        try:
            validate_email(email)
        except ValidationError:
            raise ValueError('Invalid email address')
        
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, password, **extra_fields)


class User(AbstractUser):
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(
        max_length=150,
        unique=True,
        validators=[
            MinLengthValidator(4, message="Username must be at least 3 characters long."),
            MaxLengthValidator(20, message="Username must be at most 20 characters long.")
        ],
        help_text=(
            "Required. 20 characters or fewer. Letters, digits and @/./+/-/_ only."
        )
    )
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    email = models.EmailField(blank=True)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  
    is_superuser = models.BooleanField(default=False)
    
    date_joined = models.DateTimeField(("date joined"), default=timezone.now)
    
    last_updated = models.DateTimeField(auto_now=True)
    
    objects = UserManager()

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser
    
    def __str__(self):
        return self.get_username()
    
    class Meta:
        db_table = "users"
        verbose_name = "user"
        verbose_name_plural = "users"
