API_ENDPOINTS = [
    # Format: (url_name, http_method, description)
    ('logout', 'POST', 'User logout'),
    ('token-refresh', 'POST', 'Refresh access token'),
    
    # List endpoints (/auth/)
    ('auth-list', 'GET', 'List users'),
    ('auth-list', 'POST', 'Create user'),

    # Detail endpoints (/auth/{id}/)
    ('auth-detail', 'GET', 'Retrieve user'),
    ('auth-detail', 'PUT', 'Update user'),
    ('auth-detail', 'PATCH', 'Partially update user'),
    ('auth-detail', 'DELETE', 'Delete user'),
    
    # Role management (admin-only)
    ('role-list', 'GET', 'List roles'),
    ('role-list', 'POST', 'Create role'),
    ('role-detail', 'GET', 'Retrieve role'),
    ('role-detail', 'PUT', 'Update role'),
    ('role-detail', 'PATCH', 'Partially update role'),
    ('role-detail', 'DELETE', 'Delete role'),

    # Permission management (admin-only)
    ('permission-list', 'GET', 'List permissions'),
    ('permission-list', 'POST', 'Create permission'),
    ('permission-detail', 'GET', 'Retrieve permission'),
    ('permission-detail', 'PUT', 'Update permission'),
    ('permission-detail', 'PATCH', 'Partially update permission'),
    ('permission-detail', 'DELETE', 'Delete permission'),

    # API Endpoint management (admin-only)
    ('api-endpoint-list', 'GET', 'List API endpoints'),
    ('api-endpoint-list', 'POST', 'Create API endpoint'),
    ('api-endpoint-detail', 'GET', 'Retrieve API endpoint'),
    ('api-endpoint-detail', 'PUT', 'Update API endpoint'),
    ('api-endpoint-detail', 'PATCH', 'Partially update API endpoint'),
    ('api-endpoint-detail', 'DELETE', 'Delete API endpoint'),
]