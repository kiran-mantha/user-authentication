from django.contrib.auth.hashers import check_password
from django.utils import timezone

from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, Role, Permission, APIEndpoint
from .permissions import HasAPIPermission
from .serializers import (
    UserSerializer, RoleSerializer, PermissionSerializer, APIEndpointSerializer,
    BootstrapAdminSerializer
)


class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {"detail": "Username and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            try:
                user = User.objects.get(email=username)
            except User.DoesNotExist:
                return Response(
                    {"detail": "No active account found with the given credentials."},
                    status=status.HTTP_401_UNAUTHORIZED
                )

        if not check_password(password, user.password):
            return Response(
                {"detail": "No active account found with the given credentials."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {"detail": "User account is disabled."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])

        refresh = RefreshToken.for_user(user)
        refresh['role'] = user.role.name
        refresh['username'] = user.username
        refresh['email'] = user.email
        
        payload = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        
        if user.is_superuser:
            payload['is_superuser'] = True

        return Response(payload, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [HasAPIPermission]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()  # Adds to blacklistedtoken table
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


class BootstrapAdminView(APIView):
    permission_classes = []

    def post(self, request):
        if User.objects.filter(role__name='admin').exists():
            return Response(
                {"error": "Admin user already exists. This endpoint is disabled."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        user_data = request.data
        user_data['is_superuser'] = True
        user_data['is_staff'] = True
        serializer = BootstrapAdminSerializer(data=user_data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Admin user created successfully!"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserRegistrationView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [HasAPIPermission]


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [HasAPIPermission]


class PermissionViewSet(viewsets.ModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [HasAPIPermission]


class APIEndpointViewSet(viewsets.ModelViewSet):
    queryset = APIEndpoint.objects.all()
    serializer_class = APIEndpointSerializer
    permission_classes = [HasAPIPermission]