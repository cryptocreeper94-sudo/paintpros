# PaintPros Credential Registration Request

## For: ORBIT Staffing Ecosystem Hub Team
## From: PaintPros.io (Darkwave Studios LLC)
## Date: January 24, 2026

---

## Request Summary

Please register PaintPros as an authorized application in the ORBIT Staffing Ecosystem Hub using the credentials below.

---

## Application Details

| Field | Value |
|-------|-------|
| **App Name** | `PaintPros` |
| **X-App-Name Header** | `PaintPros` |
| **Environment** | Development |
| **Base URL** | `https://orbitstaffing.io/api/ecosystem` |

---

## Credentials to Register

The following credentials are stored as secrets in PaintPros and need to be registered on the Orbit Hub side:

### API Key
```
Secret Name: ORBIT_ECOSYSTEM_API_KEY
```
**Value:** [Retrieve from PaintPros secrets panel and share securely with Orbit team]

### API Secret
```
Secret Name: ORBIT_ECOSYSTEM_API_SECRET
```
**Value:** [Retrieve from PaintPros secrets panel and share securely with Orbit team]

---

## Requested Permissions

Based on the ecosystem hub capabilities, PaintPros requests the following permissions:

| Permission | Purpose |
|------------|---------|
| `sync:all` | Full sync capabilities between apps |
| `read:code` | Access shared code snippets |
| `write:code` | Contribute code snippets to hub |
| `read:workers` | View staffing/worker data |
| `write:workers` | Sync crew/employee data |
| `read:1099` | Access contractor payment records |
| `write:1099` | Submit contractor payment data |
| `read:logs` | View ecosystem activity logs |
| `write:logs` | Log PaintPros activity |

---

## Verification

Once registered, PaintPros will verify connection by calling:

```
GET https://orbitstaffing.io/api/ecosystem/status
Headers:
  X-API-Key: [registered key]
  X-API-Secret: [registered secret]
  X-App-Name: PaintPros
```

Expected response:
```json
{
  "connected": true,
  "hubName": "ORBIT Staffing Ecosystem Hub",
  "appName": "PaintPros",
  "permissions": ["sync:all", "read:code", "write:code", ...]
}
```

---

## Contact

For questions or confirmation, contact the PaintPros development team at Darkwave Studios LLC.

---

**Note:** Share actual credential values through a secure channel (encrypted message, password manager share, etc.) - not in plain text.
