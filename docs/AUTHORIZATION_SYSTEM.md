# Authorization System - Hybrid Authentication Architecture

> **Darkwave Dev Hub** | Authorization Module  
> Version: 1.0.0 | Last Updated: December 2024

## Overview

This document describes a **hybrid authentication system** that combines:
1. **Social/OAuth Login** (Replit Auth) - For end-user customers
2. **PIN-Based Access** - For internal staff, admins, and beta testers

Both systems operate independently and can be used simultaneously.

---

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    HYBRID AUTH SYSTEM                        │
├─────────────────────────────┬───────────────────────────────┤
│     CUSTOMER AUTH           │       STAFF AUTH              │
│     (Replit Auth)           │       (PIN-Based)             │
├─────────────────────────────┼───────────────────────────────┤
│ - Google                    │ - Owner PIN: 1111             │
│ - GitHub                    │ - Admin PIN: 4444             │
│ - Apple                     │ - Area Manager PIN: 2222      │
│ - X (Twitter)               │ - Developer PIN: 0424         │
│ - Email/Password            │ - Crew Lead PIN: 3333         │
├─────────────────────────────┼───────────────────────────────┤
│ Routes: /api/login          │ Routes: /admin, /owner, etc.  │
│         /api/logout         │ (Local PIN validation)        │
│         /api/auth/user      │                               │
└─────────────────────────────┴───────────────────────────────┘
```

---

## File Structure

```
server/
├── replit_integrations/
│   └── auth/
│       └── index.ts          # Replit Auth integration (DO NOT MODIFY)
├── routes.ts                 # API routes including auth endpoints
└── storage.ts                # Database operations for users/sessions

shared/
├── schema.ts                 # Database schema (users, sessions tables)
└── models/
    └── auth.ts               # Auth type definitions

client/src/
├── hooks/
│   └── use-auth.ts           # React hook for auth state
├── components/ui/
│   └── navbar.tsx            # Navigation with login/logout UI
└── pages/
    └── admin.tsx             # Example PIN-protected page
```

---

## Backend Implementation

### 1. Database Schema (shared/schema.ts)

```typescript
import { pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";

// Users table for Replit Auth
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sessions table for Replit Auth
export const sessions = pgTable("sessions", {
  sid: text("sid").primaryKey(),
  sess: text("sess").notNull(),
  expire: timestamp("expire").notNull(),
});
```

### 2. Auth Routes (server/routes.ts)

```typescript
import { setupAuth, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(app: Express) {
  // Initialize Replit Auth (adds /api/login, /api/logout, /api/auth/user)
  await setupAuth(app);
  
  // Protected route example
  app.get("/api/protected", isAuthenticated, (req, res) => {
    res.json({ user: req.user });
  });
  
  // Public routes don't need isAuthenticated middleware
  app.get("/api/public", (req, res) => {
    res.json({ message: "Anyone can access this" });
  });
}
```

### 3. Auth Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/login` | GET | Redirects to Replit Auth login page |
| `/api/logout` | GET | Clears session, redirects to home |
| `/api/auth/user` | GET | Returns current user or 401 if not authenticated |

---

## Frontend Implementation

### 1. Auth Hook (client/src/hooks/use-auth.ts)

```typescript
import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user && !error,
    error,
  };
}
```

### 2. Navigation UI (client/src/components/ui/navbar.tsx)

```tsx
import { useAuth } from "@/hooks/use-auth";
import { LogIn, LogOut, User } from "lucide-react";

export function Navbar() {
  const { user, isLoading, isAuthenticated } = useAuth();

  return (
    <nav>
      {/* Account Section */}
      {isLoading ? (
        <span>Loading...</span>
      ) : isAuthenticated && user ? (
        <>
          <div className="flex items-center gap-2">
            {user.profileImageUrl ? (
              <img src={user.profileImageUrl} className="w-8 h-8 rounded-full" />
            ) : (
              <User className="w-5 h-5" />
            )}
            <span>{user.firstName || user.email}</span>
          </div>
          <a href="/api/logout">
            <LogOut /> Log Out
          </a>
        </>
      ) : (
        <a href="/api/login">
          <LogIn /> Login / Sign Up
        </a>
      )}

      {/* Staff Access (PIN-based) - Separate section */}
      <div>
        <a href="/admin">Admin Dashboard</a>
        <a href="/owner">Owner Dashboard</a>
        {/* Each dashboard handles its own PIN validation */}
      </div>
    </nav>
  );
}
```

### 3. PIN-Protected Page Pattern

```tsx
import { useState } from "react";

export default function AdminDashboard() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState("");

  const ADMIN_PIN = "4444"; // In production, validate on backend

  const handlePinSubmit = () => {
    if (pin === ADMIN_PIN) {
      setIsUnlocked(true);
    }
  };

  if (!isUnlocked) {
    return (
      <div>
        <h2>Admin Access Required</h2>
        <input
          type="password"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <button onClick={handlePinSubmit}>Unlock</button>
      </div>
    );
  }

  return <div>Admin Dashboard Content</div>;
}
```

---

## Branding Customization

### To brand this system for your app:

1. **Update PIN values** in dashboard pages:
   ```typescript
   const PINS = {
     admin: "YOUR_ADMIN_PIN",
     owner: "YOUR_OWNER_PIN",
     developer: "YOUR_DEV_PIN",
   };
   ```

2. **Customize login button text** in navbar:
   ```tsx
   <a href="/api/login">
     Sign in to {YOUR_APP_NAME}
   </a>
   ```

3. **Add your branding** to the auth flow:
   - Replit Auth shows your app name automatically from Replit project settings

4. **Configure role names** for your domain:
   ```typescript
   const staffLinks = [
     { name: "Manager", href: "/manager", pin: "1234" },
     { name: "Staff", href: "/staff", pin: "5678" },
   ];
   ```

---

## Security Considerations

| Aspect | Implementation |
|--------|----------------|
| Session Storage | PostgreSQL via connect-pg-simple |
| Session Secret | Stored in REPLIT_AUTH environment variable |
| HTTPS | Enforced by Replit infrastructure |
| CSRF Protection | Built into Replit Auth |
| PIN Storage | Keep PINs server-side in production |

### Production Recommendations

1. **Move PIN validation to backend** for production:
   ```typescript
   app.post("/api/validate-pin", (req, res) => {
     const { role, pin } = req.body;
     const validPins = { admin: process.env.ADMIN_PIN };
     if (validPins[role] === pin) {
       req.session.staffRole = role;
       res.json({ success: true });
     } else {
       res.status(401).json({ error: "Invalid PIN" });
     }
   });
   ```

2. **Use environment variables** for PINs:
   ```bash
   ADMIN_PIN=4444
   OWNER_PIN=1111
   ```

---

## Integration Checklist

- [ ] Install Replit Auth integration via search_integrations tool
- [ ] Run database migration: `npm run db:push`
- [ ] Add `useAuth` hook to your hooks folder
- [ ] Update navbar/header with login/logout UI
- [ ] Create PIN-protected dashboard pages as needed
- [ ] Test both auth flows independently
- [ ] Configure PINs for your staff roles

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 on /api/auth/user | Expected when not logged in |
| Login redirect fails | Check REPLIT_DOMAINS env var |
| Session not persisting | Verify PostgreSQL connection |
| PIN not working | Check PIN value and input handling |

---

## Related Documentation

- [Replit Auth Integration Guide](https://docs.replit.com/additional-resources/replit-auth)
- [Express Session with PostgreSQL](https://www.npmjs.com/package/connect-pg-simple)
- [TanStack Query v5](https://tanstack.com/query/latest)

---

*This document is maintained by Darkwave Studios, LLC. For updates or questions, reference this file in your agent context.*
