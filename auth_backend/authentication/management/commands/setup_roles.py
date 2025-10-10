# management/commands/setup_roles.py
from django.core.management.base import BaseCommand
from user_auth.config import API_ENDPOINTS
from authentication.models import Role, Permission, APIEndpoint

class Command(BaseCommand):
    help = 'Create admin role with full_access permission for explicitly defined endpoints'

    def handle(self, *args, **options):
        self.stdout.write("🔍 Loading endpoints from api_config.py...")

        all_endpoints = []
        for url_name, method, description in API_ENDPOINTS:
            clean_name = f"{method.lower()}_{url_name.replace('-', '_')}"

            # Create or get APIEndpoint
            endpoint, created = APIEndpoint.objects.get_or_create(
                name=clean_name,
                defaults={
                    'path': f'/{url_name}/',
                    'method': method.upper()
                }
            )
            if created:
                self.stdout.write(f"  ➕ Created: {clean_name} ({method})")
            all_endpoints.append(endpoint)

        # Create full_access permission
        full_access, _ = Permission.objects.get_or_create(
            name='full_access',
            defaults={'description': 'Full access to all defined endpoints'}
        )
        full_access.api_endpoints.set(all_endpoints)

        # Assign to admin
        admin_role, _ = Role.objects.get_or_create(name='admin')
        admin_role.permissions.set([full_access])

        self.stdout.write(
            self.style.SUCCESS(f"✅ Setup complete! Admin role has 'full_access' covering {len(all_endpoints)} endpoints.")
        )