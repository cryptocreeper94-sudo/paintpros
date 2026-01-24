# Request for Orbit Ecosystem Hub Credentials

## What PaintPros.io Needs to Connect

We have the connection code ready in `server/orbit.ts` but need the following to connect to the Ecosystem Hub:

---

## 1. API Credentials

```
ORBIT_ECOSYSTEM_API_KEY=<your-api-key>
ORBIT_ECOSYSTEM_API_SECRET=<your-api-secret>
ORBIT_ECOSYSTEM_DEV_URL=https://orbitstaffing.io/api/ecosystem
```

---

## 2. Authentication Header Format

What headers does the API expect? For example:

```
X-Orbit-API-Key: <api-key>
X-Orbit-API-Secret: <api-secret>
```

Or is it a different format?

---

## 3. Confirm These Endpoints Are Active

```
GET  /api/ecosystem/snippets           - List all snippets
GET  /api/ecosystem/snippets?tag=X     - Filter by tag
POST /api/ecosystem/snippets           - Create new snippet
GET  /api/ecosystem/health             - Connection test
```

---

## 4. Snippet Schema

Does this match what's in `ecosystemCodeSnippets` table?

```javascript
{
  id: string,
  title: string,
  code: string,
  language: string,
  tags: string[],
  createdBy: string,
  sharedWith: string[]
}
```

If there are additional fields, please list them.

---

## Once Received

Send back:
1. API Key
2. API Secret  
3. Base URL (confirm it's https://orbitstaffing.io/api/ecosystem)
4. Auth header format
5. Any schema differences

I'll configure the connection and test it immediately.
