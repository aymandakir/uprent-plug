# @uprent-plus/api-client

Shared API client package for calling Next.js API routes from mobile and web clients.

## Usage

```typescript
import { createApiClient } from '@uprent-plus/api-client';
import { supabase } from './supabase';

const api = createApiClient({
  baseUrl: 'https://your-app.vercel.app',
  supabase, // Supabase client for auth
});

// Use API endpoints
const user = await api.auth.getMe();
const letter = await api.ai.generateLetter({ ... });
const analysis = await api.ai.analyzeContract({ ... });
```

## API Endpoints

### Auth (`api.auth`)

- `getMe()` - Get current user
- `signOut()` - Sign out user
- `deleteAccount()` - Delete user account

### AI (`api.ai`)

- `generateLetter(request)` - Generate AI application letter
- `analyzeContract(request)` - Analyze rental contract

### Notifications (`api.notifications`)

- `sendEmail(request)` - Send email notification
- `sendSMS(request)` - Send SMS notification (Premium)

### Health (`api.health`)

- `check()` - Check API health status

## Error Handling

The API client includes comprehensive error handling:

```typescript
import { ApiError, AuthenticationError, NetworkError } from '@uprent-plus/api-client';

try {
  const user = await api.auth.getMe();
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Handle auth error
  } else if (error instanceof NetworkError) {
    // Handle network error
  } else if (error instanceof ApiError) {
    // Handle API error
    console.error(error.statusCode, error.message);
  }
}
```

## Authentication

The API client automatically handles authentication by:
1. Getting the access token from Supabase session
2. Adding `Authorization: Bearer <token>` header to requests
3. Handling token refresh automatically

## Type Safety

All request and response types are fully typed:

```typescript
import type { GenerateLetterRequest, GenerateLetterResponse } from '@uprent-plus/api-client';

const request: GenerateLetterRequest = {
  propertyId: '...',
  language: 'en',
  tone: 'professional',
  length: 'medium',
  includePoints: ['employment', 'references'],
};

const response: GenerateLetterResponse = await api.ai.generateLetter(request);
```

## Configuration

The API client needs:
- `baseUrl` - Base URL of the Next.js API (e.g., `https://your-app.vercel.app`)
- `supabase` - Supabase client instance for authentication

