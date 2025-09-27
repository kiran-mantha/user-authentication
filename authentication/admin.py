from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import Role, Permission, User, APIEndpoint


# Register your models here.
class APIEndpointInline(admin.TabularInline):
    model = Permission.api_endpoints.through
    extra = 0
    verbose_name = "API Endpoint"
    verbose_name_plural = "API Endpoints"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('apiendpoint')

    def api_endpoint_name(self, obj):
        return obj.apiendpoint.name
    api_endpoint_name.short_description = "Name"

    def api_endpoint_method(self, obj):
        return obj.apiendpoint.method
    api_endpoint_method.short_description = "Method"

    def api_endpoint_path(self, obj):
        return obj.apiendpoint.path
    api_endpoint_path.short_description = "Path"

    fields = ('api_endpoint_name', 'api_endpoint_method', 'api_endpoint_path')
    readonly_fields = ('api_endpoint_name', 'api_endpoint_method', 'api_endpoint_path')

    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'api_endpoints_count']
    search_fields = ['name', 'description']
    filter_horizontal = ('api_endpoints',)

    def api_endpoints_count(self, obj):
        return obj.api_endpoints.count()
    api_endpoints_count.short_description = "Mapped Endpoints"


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ['name', 'permissions_count', 'permissions_list']
    search_fields = ['name']
    filter_horizontal = ['permissions']
    
    def permissions_count(self, obj):
        return obj.permissions.count()
    permissions_count.short_description = "Permission Count"
    permissions_count.admin_order_field = "permissions__count"

    def permissions_list(self, obj):
        """Return a comma-separated string of permission names."""
        return ", ".join(p.name for p in obj.permissions.all()[:5])
    permissions_list.short_description = "Permissions (first 5)"


@admin.register(APIEndpoint)
class APIEndpointAdmin(admin.ModelAdmin):
    list_display = ['name', 'method', 'path', 'linked_permissions']
    search_fields = ['name', 'path']
    list_filter = ['method']
    readonly_fields = ['name', 'method', 'path']
    
    def linked_permissions(self, obj):
        permissions = obj.permission_set.all()  # Reverse M2M lookup
        return ", ".join(p.name for p in permissions) if permissions else "-"
    linked_permissions.short_description = "Permissions"
    

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff', 'is_superuser', 'last_login')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active', 'last_login')
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
        (_('Permissions'), {
            'fields': ('role', 'is_active', 'is_staff', 'is_superuser'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role', 'is_staff'),
        }),
    )
    
    filter_horizontal = ()
    
    search_fields = ('username', 'email')
    ordering = ('username',)