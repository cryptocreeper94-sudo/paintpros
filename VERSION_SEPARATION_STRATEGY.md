# PaintPros.io Version Separation Strategy

**Document Version:** 1.0  
**Date:** December 2025

---

## Overview

This document outlines the strategy for separating the **Beta Version** (currently in use by Nashville Painting Professionals) from the **Commercial/For-Sale Version** of PaintPros.io.

---

## Current State

### Beta Version (v1.0-beta)
- **Tenant:** Nashville Painting Professionals (NPP)
- **Tenant ID:** `npp`
- **Environment:** Development/Staging on Replit
- **Purpose:** Product validation, feature testing, feedback collection
- **Database:** Shared development database

### Key Beta Characteristics
- All features enabled for testing
- Client-side PIN authentication (development-grade)
- Debug tools and developer console exposed
- Direct database access for testing
- Blockchain on devnet (test network)

---

## Commercial Version Requirements

### Security Hardening
| Area | Beta State | Commercial Requirement |
|------|------------|----------------------|
| Authentication | Client-side PIN | Server-side JWT/OAuth |
| Database | Shared | Isolated per tenant |
| API Keys | Visible in code | Environment secrets |
| HTTPS | Replit-provided | Custom SSL certificates |
| Rate Limiting | None | Implemented |

### Feature Gating
| Feature | Beta | Starter | Professional | Enterprise |
|---------|------|---------|--------------|------------|
| Website | Yes | Yes | Yes | Yes |
| Estimator | Yes | Basic | Advanced | Custom |
| CRM | Yes | No | Yes | Yes |
| Analytics | Yes | Basic | Full | Full + Export |
| Blockchain | Yes | No | No | Yes |
| API Access | Yes | No | No | Yes |
| White-label | Yes | Partial | Full | Full |

---

## Separation Architecture

### Option 1: Branch-Based Separation (Recommended)

```
Repository Structure:
├── main (stable commercial releases)
├── develop (commercial development)
├── beta/npp (beta client customizations)
└── feature/* (new feature development)
```

**Workflow:**
1. All new features developed in `feature/*` branches
2. Features merged to `develop` for commercial testing
3. Stable releases tagged and merged to `main`
4. Beta-specific customizations in `beta/npp`
5. Sync common code between branches via cherry-pick

**Pros:**
- Clear separation of concerns
- Easy rollback for each version
- Beta can have custom features

**Cons:**
- Merge conflicts possible
- Maintenance of multiple branches

---

### Option 2: Feature Flags (Alternative)

```typescript
// config/features.ts
export const featureFlags = {
  environment: process.env.NODE_ENV, // 'development' | 'production'
  tier: process.env.SUBSCRIPTION_TIER, // 'beta' | 'starter' | 'professional' | 'enterprise'
  
  features: {
    developerConsole: ['beta'],
    blockchainStamping: ['beta', 'enterprise'],
    advancedAnalytics: ['beta', 'professional', 'enterprise'],
    crmSystem: ['beta', 'professional', 'enterprise'],
    apiAccess: ['beta', 'enterprise'],
    whiteLabel: ['professional', 'enterprise'],
  }
};

export function hasFeature(feature: keyof typeof featureFlags.features): boolean {
  return featureFlags.features[feature].includes(featureFlags.tier);
}
```

**Usage in Components:**
```tsx
import { hasFeature } from '@/config/features';

function DeveloperDashboard() {
  if (!hasFeature('developerConsole')) {
    return <UpgradePrompt feature="Developer Console" />;
  }
  return <DeveloperContent />;
}
```

**Pros:**
- Single codebase
- Easy A/B testing
- Gradual rollouts

**Cons:**
- Code complexity
- Dead code in production
- Testing all permutations

---

### Option 3: Monorepo with Packages (Scalable)

```
paintpros-monorepo/
├── packages/
│   ├── core/              # Shared components, hooks, utilities
│   ├── ui/                # Design system
│   ├── estimator/         # Estimator engine
│   ├── crm/               # CRM module
│   ├── analytics/         # Analytics module
│   └── blockchain/        # Blockchain integration
├── apps/
│   ├── beta/              # Beta client app (NPP)
│   ├── commercial/        # Commercial SaaS app
│   └── admin/             # Admin portal
└── infra/
    ├── database/          # Migration scripts
    └── terraform/         # Infrastructure as code
```

**Pros:**
- Maximum code reuse
- Clear module boundaries
- Scales for team growth

**Cons:**
- Complex setup
- Requires build tooling (Turborepo, Nx)
- Overkill for current stage

---

## Recommended Implementation Plan

### Phase 1: Prepare for Separation (Week 1-2)

1. **Create Production Environment**
   - Set up production Replit deployment
   - Configure production database (isolated)
   - Set up production secrets

2. **Security Audit**
   - Remove hardcoded PINs
   - Implement proper authentication
   - Add rate limiting
   - Security headers

3. **Configuration Refactor**
   ```typescript
   // config/environment.ts
   export const config = {
     isBeta: process.env.IS_BETA === 'true',
     isProduction: process.env.NODE_ENV === 'production',
     tenantId: process.env.VITE_TENANT_ID || 'demo',
     blockchainNetwork: process.env.IS_BETA ? 'devnet' : 'mainnet-beta',
   };
   ```

### Phase 2: Feature Gating (Week 3-4)

1. **Implement Feature Flag System**
   - Create feature configuration file
   - Add feature check utilities
   - Wrap features in conditional rendering

2. **Create Subscription Tiers**
   ```sql
   CREATE TABLE subscription_tiers (
     id VARCHAR PRIMARY KEY,
     tenant_id VARCHAR REFERENCES tenants(id),
     tier VARCHAR NOT NULL, -- 'beta', 'starter', 'professional', 'enterprise'
     features JSONB,
     valid_from TIMESTAMP,
     valid_until TIMESTAMP
   );
   ```

3. **Gate Features**
   - Developer console: Beta/Enterprise only
   - Blockchain: Enterprise only
   - Advanced analytics: Professional+
   - CRM: Professional+

### Phase 3: Multi-Tenant Isolation (Week 5-6)

1. **Database Isolation**
   - Implement row-level security
   - Add tenant_id to all tables
   - Create tenant context middleware

2. **Subdomain Routing**
   ```typescript
   // middleware/tenant.ts
   export function tenantMiddleware(req, res, next) {
     const subdomain = req.hostname.split('.')[0];
     req.tenantId = subdomain === 'www' ? 'default' : subdomain;
     next();
   }
   ```

3. **Asset Isolation**
   - Tenant-specific uploads
   - Branded email templates
   - Custom domain support

### Phase 4: Commercial Launch (Week 7-8)

1. **Beta Freeze**
   - Lock beta branch
   - Notify NPP of transition
   - Document beta-specific features

2. **Commercial Deployment**
   - Deploy to production infrastructure
   - Set up monitoring (Sentry, LogRocket)
   - Configure CDN

3. **Onboarding System**
   - Self-service signup
   - Payment integration
   - Automated provisioning

---

## Environment Configuration

### Beta Environment
```env
# .env.beta
NODE_ENV=development
IS_BETA=true
VITE_TENANT_ID=npp
DATABASE_URL=postgresql://beta_db
SOLANA_NETWORK=devnet
ENABLE_DEBUG_TOOLS=true
AUTH_MODE=pin
```

### Production Environment
```env
# .env.production
NODE_ENV=production
IS_BETA=false
VITE_TENANT_ID=dynamic
DATABASE_URL=postgresql://prod_db
SOLANA_NETWORK=mainnet-beta
ENABLE_DEBUG_TOOLS=false
AUTH_MODE=oauth
STRIPE_SECRET_KEY=sk_live_xxx
```

---

## Migration Path for Beta Client

### NPP Transition Plan

1. **Communication**
   - Notify NPP 30 days before transition
   - Provide training on new authentication
   - Document any removed beta features

2. **Data Migration**
   - Export all NPP data
   - Create isolated tenant database
   - Migrate with data integrity checks

3. **Feature Parity**
   - Ensure all used features work in commercial
   - Provide enterprise tier access initially
   - Gradual feature adjustment based on tier

4. **Support Period**
   - 90-day priority support
   - Weekly check-ins
   - Bug fixes prioritized

---

## Code Changes Required

### 1. Remove Development-Only Code

```diff
// Before (Beta)
- const DEVELOPER_PIN = "0424";
- const OWNER_PIN = "1111";

// After (Commercial)
+ // PINs managed via secure database
+ const validateAuth = async (token) => await authService.validate(token);
```

### 2. Add Environment Checks

```typescript
// components/DevTools.tsx
export function DevTools() {
  if (process.env.NODE_ENV === 'production' && !config.isEnterprise) {
    return null;
  }
  return <DeveloperPanel />;
}
```

### 3. Implement Proper Authentication

```typescript
// Current (Beta)
if (pin === "1111") { setAuthenticated(true); }

// Commercial
const { user, isAuthenticated } = useAuth();
if (!isAuthenticated) return <LoginPage />;
if (!hasPermission(user, 'owner')) return <Unauthorized />;
```

---

## Testing Strategy

### Beta Testing
- Manual testing by NPP
- Developer exploratory testing
- Feature completeness focus

### Commercial Testing
- Automated unit tests
- Integration tests
- Security penetration testing
- Load testing
- Multi-tenant isolation tests

---

## Rollback Plan

### If Commercial Launch Fails
1. Revert to beta codebase
2. Notify affected customers
3. Investigate and fix issues
4. Staged re-launch

### If Beta Needs Urgent Fix
1. Branch from beta-specific code
2. Apply minimal fix
3. Deploy to beta environment only
4. Consider backport to commercial if applicable

---

## Timeline Summary

| Week | Milestone |
|------|-----------|
| 1-2 | Environment setup, security audit |
| 3-4 | Feature flags, subscription tiers |
| 5-6 | Multi-tenant isolation, subdomain routing |
| 7-8 | Commercial deployment, monitoring |
| 9+ | Onboarding, marketing launch |

---

## Conclusion

The recommended approach is a **hybrid of Option 1 (Branch-Based) and Option 2 (Feature Flags)**:

1. Maintain `beta` and `production` branches for major differences
2. Use feature flags for tier-based feature gating
3. Share core code between environments
4. Gradually migrate beta-specific code to the main branch

This provides the right balance of separation, maintainability, and scalability for the current stage of PaintPros.io.

---

*Document maintained by Orbit Development Team*
