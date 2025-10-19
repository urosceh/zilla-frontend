# Multi-Tenant Frontend Implementation

This implementation adds multi-tenancy support to your React application with the following features### Testing

### Local Development

1. Start your development server
2. Test root redirect: `http://localhost:8080/` (redirects to default tenant)
3. Test tenant-specific login: `http://localhost:8080/test-tenant/login`
4. Navigate to tenant pages: `http://localhost:8080/test-tenant`
5. Check browser developer tools Network tab to verify `tenant: test-tenant` header is being sent
6. **Note**: Global routes like `/login` will redirect to tenant-specific routes

### Different Tenants

- `http://localhost:8080/company-a/login` → `http://localhost:8080/company-a`
- `http://localhost:8080/company-b/login` → `http://localhost:8080/company-b`
- Each will have isolated tenant contexts and separate login flowsiew

- **URL Structure**: All routes now follow the pattern `/{tenant}/{existing-path}`
- **Tenant Header**: The tenant name from the URL is automatically sent to the backend via the `tenant` header
- **Automatic Tenant Detection**: The tenant is extracted from the URL path and stored in context

## URL Examples

### Before (Single Tenant)

```
/login
/
/PROJECT-KEY/issues
/PROJECT-KEY/new
/PROJECT-KEY/kanban
/admin/panel
```

### After (Multi-Tenant)

```
/                               (redirects to stored/default tenant)
/TENANT-NAME/login              (tenant-specific login - ONLY way to login)
/TENANT-NAME/forgotten-password (tenant-specific password reset)
/TENANT-NAME                    (tenant's project list)
/TENANT-NAME/PROJECT-KEY/issues (tenant's project issues)
/TENANT-NAME/PROJECT-KEY/new    (create issue for tenant)
/TENANT-NAME/PROJECT-KEY/kanban (tenant's kanban board)
/TENANT-NAME/admin/panel        (tenant's admin panel)
```

**Important**: Global login routes (`/login`, `/forgotten-password`) no longer exist. All authentication must go through tenant-specific routes.

## How It Works

### 1. Tenant Context (`src/contexts/TenantContext.tsx`)

- Extracts tenant name from URL path
- Validates tenant names (alphanumeric, hyphens, underscores only)
- **URL-only approach**: No localStorage to avoid collisions in shared frontend
- Provides tenant information to all components

### 2. Axios Client Integration (`src/lib/AxiosClient.ts`)

- Automatically adds `tenant` header to all API requests
- Uses request interceptor to inject tenant header
- Syncs with tenant context automatically

### 3. Tenant-Aware Routing (`src/App.tsx`)

- Routes updated to include `/:tenant` parameter
- Authentication routes remain tenant-agnostic
- Automatic redirects to tenant-specific paths

### 4. Navigation Updates (`src/components/NavigationBar/NavigationBar.tsx`)

- All navigation links updated to include tenant prefix
- Projects and Kanban dropdowns use tenant-aware paths

## Usage

### Setting a Tenant

Navigate to any URL with a tenant name:

```
https://yourapp.com/acme-corp/login      (tenant-specific login)
https://yourapp.com/acme-corp            (tenant home page)
https://yourapp.com/company-xyz/PROJECT-KEY/issues
```

### Login Flow

- **Tenant-specific login**: `/TENANT-NAME/login` - After login, redirects to `/TENANT-NAME`
- **Root access**: `/` redirects to stored tenant or default tenant
- **Auto-redirect**: Accessing protected tenant routes when not logged in redirects to `/TENANT-NAME/login`
- **No global auth**: All authentication must use tenant-specific routes

### Backend Integration

Your backend will automatically receive the tenant in headers:

```javascript
// Example request headers
{
  "Authorization": "Bearer ...",
  "Content-Type": "application/json",
  "tenant": "acme-corp"
}
```

### Adding New Routes

When adding new routes, follow the tenant-aware pattern:

```tsx
// ✅ Good - Tenant-aware route
<Route path="/:tenant/new-feature" element={<NewFeature />} />

// ❌ Bad - Missing tenant
<Route path="/new-feature" element={<NewFeature />} />
```

### Using Tenant in Components

```tsx
import {useTenant} from "../contexts/TenantContext";

const MyComponent = () => {
  const {tenant} = useTenant();

  // Use tenant in your component logic
  console.log("Current tenant:", tenant);

  return <div>Welcome to {tenant}</div>;
};
```

## Tenant Validation

The system validates tenant names to ensure they:

- Are not empty
- Contain only alphanumeric characters, hyphens, and underscores
- Match the regex pattern: `/^[a-zA-Z0-9-_]+$/`

Invalid tenant names will redirect to the login page.

## Migration Guide

### For Existing Links

Update any hardcoded links in your components:

```tsx
// Before
<Link to="/admin/panel">Admin</Link>;

// After
const {tenant} = useTenant();
<Link to={`/${tenant}/admin/panel`}>Admin</Link>;
```

### For Navigation Logic

Use the tenant context for programmatic navigation:

```tsx
const {tenant} = useTenant();
const navigate = useNavigate();

const goToProjects = () => {
  navigate(`/${tenant}`);
};
```

## Testing

### Local Development

1. Start your development server
2. Navigate to `http://localhost:3000/test-tenant`
3. Check browser developer tools Network tab to verify `tenant: test-tenant` header is being sent

### Different Tenants

- `http://localhost:3000/company-a`
- `http://localhost:3000/company-b`
- Each will have isolated tenant contexts

## Security Considerations

1. **Tenant Isolation**: Ensure your backend properly isolates data based on the tenant header
2. **Tenant Validation**: The frontend validates tenant format, but backend should validate tenant access
3. **Authorization**: Users should only access tenants they're authorized for

## Shared Frontend Considerations

This implementation is designed for **shared frontend environments** where multiple tenants use the same frontend instance:

### ✅ What We Avoid:

- **No localStorage for tenant storage**: Prevents collision between different tenant sessions
- **No global tenant state**: Each request determines tenant from URL dynamically
- **No cached tenant instances**: Prevents race conditions in concurrent requests
- **No default tenants**: All routes must explicitly specify tenant

### ✅ How It Works:

- **URL-based tenant detection**: Tenant is always extracted from the current URL path
- **Request-time tenant resolution**: Each API call determines its tenant dynamically
- **Stateless tenant handling**: No persistent storage of tenant information
- **Tenant-scoped authentication**: Each tenant has separate login cookies (`bearerToken_${tenant}`)

### ✅ Benefits:

- **Multi-tab safe**: Different browser tabs with different tenants work independently
- **Concurrent request safe**: No race conditions between simultaneous API calls
- **User switching safe**: Users can switch between tenants without state pollution
- **Strict tenant isolation**: No cross-tenant data leakage possible

### ✅ Error Handling:

- **Missing tenant**: Shows error page "Tenant must be provided in the URL path"
- **Invalid tenant**: Backend 400 errors redirect to error page "Tenant must be a valid tenant"
- **No fallbacks**: No default tenant assumptions anywhere in the code

## Future Enhancements

1. **Tenant Switching**: Add UI component to switch between authorized tenants
2. **Subdomain Support**: Support tenant.yourapp.com format
3. **Tenant Branding**: Load tenant-specific themes and branding
4. **Tenant Configuration**: Load tenant-specific settings and features
