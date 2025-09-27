
# Django User Authentication Service

[![Project Status](https://img.shields.io/badge/Status-Stable-brightgreen)](https://github.com/kiran-mantha/user-authentication)

A robust and secure user authentication backend built with **Django REST Framework (DRF)** and the **SimpleJWT** library. This service provides a complete solution for user management, token-based authentication, and granular access control via a custom role and permissions system.

## ✨ Key Features

* **Complete Authentication Flow:** Supports user registration, login, and secure logout (**JWT Token Blacklisting**).
* **Token Management:** Utilizes **JWT (JSON Web Tokens)** for stateless, secure session handling, including access and refresh token generation.
* **Custom Roles & Permissions:** Implement endpoint-level access control using a custom permission class that maps user roles to API endpoints.
* **Secure Setup:** Includes a `bootstrap-admin` endpoint for initial, secure setup of a primary administrator.
* **Password Security:** Built-in support for secure password hashing (provided by Django's framework).
* **Configurable Sessions:** Easy configuration of token lifetimes (e.g., 30 minutes for access, 1 day for refresh).

---

## 🚀 Setup & Installation

Follow these steps to get the service running locally.

### 1. Project Setup
```bash
# Clone the repository
git clone https://github.com/kiran-mantha/user-authentication

# Change the directory
cd user-authentication

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

# Install dependencies (Django, DRF, SimpleJWT, etc.)
pip install -r requirements.txt
```

### 2. Database and Roles
1. **Run migrations** to set up the database schema:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

2. **Setup default roles** (`admin`):

    This command initializes the core roles used by the custom permission system.

    ```bash
    python manage.py setup_roles
    ```

### 3. Configuration (Advanced)

- **JWT Token Lifetimes:** Adjust token expiry in `user_auth/settings.py`:
    ```python
    SIMPLE_JWT = {
        'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
        'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
        # other jwt settings
    }
    ```

- **Endpoint Permissions:** Modify the list of endpoints requiring permission checks in `user_auth/config.py`:

    ```python
    API_ENDPOINTS = [
        # Format: (url_name, http_method, description)
        ('auth-list', 'GET', 'List users'),
        ('auth-list', 'POST', 'Create user'),
        # add the endpoint here as well according to your api list
    ]
    ```

---

## 🐍 Start the Server
Start the development server. The API will be accessible at `http://localhost:8000`.

```bash
python manage.py runserver
```

---

## 📦 API Endpoints & Usage

Below are the primary authentication endpoints with example cURL commands.

| Endpoint | Method | Description | Authentication Required |
| :--- | :--- | :--- | :--- |
| `/api/bootstrap-admin/` | **POST** | Securely register the initial system administrator. | **None** |
| `/api/login/` | **POST** | Authenticate a user and receive JWT tokens. | **None** |
| `/api/logout/` | **POST** | Invalidate the refresh token (blacklisting). | Bearer Token |
| `/api/token/refresh/` | **POST** | Renew an expired access token using the refresh token. | **None** (Requires JSON body) |
| `/api/user/` | **GET** | Example of a protected endpoint to retrieve user profile. | Bearer Token |


### cURL Examples
### 1. Register (Bootstrap Admin)

Used for the one-time setup of the admin account.

```bash
curl --location 'http://localhost:8000/api/bootstrap-admin/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "kiran@123",
    "email": "kiranmantha@gmail.com",
    "password": "root@1234"
}'
```

### 2. Login (Obtain JWT)

The response will contain the `access` and `refresh` tokens.

```bash
curl --location 'http://localhost:8000/api/login/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "kiran@123",
    "password": "root@1234"
}'
```

### 3. Protected Endpoint Example

Accessing a protected route requires the **Access Token** in the `Authorization` header.

```bash
curl -X GET http://localhost:8000/api/user/ \
-H "Authorization: Bearer <access_token>"
```

### 4. Logout (Token Blacklisting)

Requires a valid Access Token and the Refresh Token in the body.

```bash
curl --location http://localhost:8000/api/logout/ \
--header "Content-Type: application/json" \
--header "Authorization: Bearer <access_token>" \
--data-raw '{"refresh":"<refresh_token>"}'
```


---

## 🛡 Permission / Role System Deep Dive

The core of the access control lies in the custom `HasAPIPermission` class.

1. **Authentication**: The system first verifies a user is authenticated (`request.user.is_authenticated`) and has an assigned `role`.
2. **Resolution**: It resolves the incoming request URL into a unique permission string, formatted as **"{HTTP_METHOD}_{url_name}"** (e.g., `get_auth_list`).
3. **Lookup**: It attempts to find a matching `APIEndpoint` object in the database using this unique string.
4. **Verification**: Finally, it checks if the user's assigned `Role` has the corresponding `Permission` linked to that specific `APIEndpoint`.


---

## 🧪 Testing & Debugging

- Use the logging version of `HasAPIPermission` to print out permission resolution details.  
- Ensure refresh token blacklisting is enabled (install `rest_framework_simplejwt.token_blacklist`).  
- For logout, handle missing refresh token gracefully.  
- Use tools like Postman or curl to test each endpoint.
