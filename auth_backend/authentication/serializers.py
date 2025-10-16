from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import User, Role, Permission, APIEndpoint


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'


class APIEndpointSerializer(serializers.ModelSerializer):
    class Meta:
        model = APIEndpoint
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    
    role = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Role.objects.all(),
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = User
        fields = [
            'username', 'first_name', 'last_name', 'email', 'password', 
            'role', 'is_staff', 'is_superuser', 'is_active'
            ]
        extra_kwargs = {'role': {'required': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class BootstrapAdminSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'email': {'required': True}
        }

    def validate(self, attrs):
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError("Username already taken")
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError("Email already taken")
        return attrs

    def create(self, validated_data):
        # Force role=admin and set superuser flags
        role = Role.objects.get(name='admin')
        if not role:
            raise serializers.ValidationError("Role 'admin' does not exist")
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=role
        )
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user