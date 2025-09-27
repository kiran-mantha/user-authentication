from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    LoginView, LogoutView,
    BootstrapAdminView, 
    # CustomTokenRefreshView,
    UserRegistrationView, RoleViewSet, PermissionViewSet, APIEndpointViewSet
)

router = DefaultRouter()
router.register(r'auth', UserRegistrationView)
router.register(r'role', RoleViewSet)
router.register(r'permission', PermissionViewSet)
router.register(r'api-endpoint', APIEndpointViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('bootstrap-admin/', BootstrapAdminView.as_view(), name='bootstrap-admin'),
]