# ORBIT Ecosystem Hub - Complete Implementation Handoff

## For: DarkWave Studios (darkwavestudios.io)
## From: PaintPros Agent
## Date: January 24, 2026

---

## Overview

This document contains everything needed to implement the ORBIT Ecosystem Hub interface at DarkWave Studios. The hub serves as a central nexus for code sharing, worker sync, and integration between all Darkwave LLC applications (PaintPros, ORBIT Staffing, TradeWorks, etc.).

---

## Part 1: Connection Architecture

### What is the ORBIT Ecosystem Hub?

The ORBIT Staffing Ecosystem Hub is a central API that allows registered apps to:
- Share and retrieve code snippets across the ecosystem
- Sync worker/employee data between apps
- Share 1099 contractor information
- Log cross-app activity
- Access shared authentication configs

### Base URLs

| Environment | URL |
|-------------|-----|
| Development | `https://606bb700-1745-49b9-8ff5-b83937d394a3-00-1b1vrn19wm7h.spock.replit.dev/api/ecosystem` |
| Production | `https://orbitstaffing.io/api/ecosystem` |

**Note:** Use dev URL until Orbit republishes to production with new credentials.

---

## Part 2: Authentication

### Required Headers

Every request to the ecosystem hub requires these headers:

```
Content-Type: application/json
X-API-Key: [your-app-api-key]
X-API-Secret: [your-app-api-secret]
X-App-Name: [your-app-name]
```

### PaintPros Credentials (Reference)

```
X-API-Key: dw_app_7b93ce818f59cc4498d9ebf35d22ab45cac7104d8f690d34
X-API-Secret: dw_secret_531a2649eaaf6a9d56b60550d91a636e68420baae30844ddebf9fe79f1456e40
X-App-Name: PaintPros
```

### To Register DarkWave Studios

Send this to the ORBIT Staffing agent:

```
NEW APP REGISTRATION REQUEST

App Name: DarkWave Studios
X-App-Name Header: DarkWaveStudios

Requested Permissions:
- sync:all
- read:code
- write:code
- read:workers
- write:workers
- read:1099
- write:1099
- read:logs
- write:logs

Please generate API Key and Secret for this app.
```

ORBIT will respond with credentials like:
```
X-API-Key: dw_app_[generated-hash]
X-API-Secret: dw_secret_[generated-hash]
```

Store these as secrets:
- `ORBIT_ECOSYSTEM_API_KEY`
- `ORBIT_ECOSYSTEM_API_SECRET`
- `ORBIT_ECOSYSTEM_BASE_URL` (use dev URL initially)

---

## Part 3: API Endpoints

### Status Check
```
GET /status

Response:
{
  "connected": true,
  "hubName": "ORBIT Staffing Ecosystem Hub",
  "appName": "DarkWaveStudios",
  "permissions": ["sync:all", "read:code", "write:code", ...],
  "lastSync": "2026-01-24T22:13:04.290Z"
}
```

### Get All Snippets
```
GET /snippets

Response: Array of OrbitSnippet objects
```

### Get Snippets by Category
```
GET /snippets?category=authentication
```

### Get Snippets by Language
```
GET /snippets?language=typescript
```

### Share a Snippet
```
POST /snippets

Body:
{
  "name": "My Utility Function",
  "description": "Does something useful",
  "code": "function myUtil() { ... }",
  "language": "typescript",
  "category": "utility",
  "tags": ["helper", "util"],
  "isPublic": true,
  "version": "1.0.0"
}
```

---

## Part 4: Backend Implementation

### TypeScript Client Class

```typescript
// server/orbit-ecosystem.ts

interface OrbitConfig {
  baseUrl: string;
  apiKey: string;
  apiSecret: string;
  appName: string;
}

interface OrbitSnippet {
  id: string;
  sourceAppId: string;
  sourceAppName: string;
  name: string;
  description: string;
  code: string;
  language: string;
  category: string;
  tags: string[];
  isPublic: boolean;
  usageCount: number;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export class OrbitEcosystem {
  private config: OrbitConfig | null = null;

  initialize() {
    const baseUrl = process.env.ORBIT_ECOSYSTEM_DEV_URL || process.env.ORBIT_ECOSYSTEM_BASE_URL;
    const apiKey = process.env.ORBIT_ECOSYSTEM_API_KEY;
    const apiSecret = process.env.ORBIT_ECOSYSTEM_API_SECRET;

    if (baseUrl && apiKey && apiSecret) {
      this.config = {
        baseUrl,
        apiKey,
        apiSecret,
        appName: 'DarkWaveStudios',
      };
      console.log('[Orbit Ecosystem] Connected to hub');
    }
  }

  isConnected(): boolean {
    return this.config !== null;
  }

  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    body?: any
  ): Promise<T> {
    if (!this.config) {
      throw new Error('Orbit Ecosystem not configured');
    }

    const url = `${this.config.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-API-Key': this.config.apiKey,
      'X-API-Secret': this.config.apiSecret,
      'X-App-Name': this.config.appName,
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Orbit API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getStatus() {
    return this.makeRequest<{
      connected: boolean;
      hubName: string;
      appName: string;
      permissions: string[];
    }>('/status');
  }

  async getSnippets(): Promise<OrbitSnippet[]> {
    return this.makeRequest<OrbitSnippet[]>('/snippets');
  }

  async getSnippetsByCategory(category: string): Promise<OrbitSnippet[]> {
    return this.makeRequest<OrbitSnippet[]>(`/snippets?category=${encodeURIComponent(category)}`);
  }

  async shareSnippet(snippet: Partial<OrbitSnippet>): Promise<OrbitSnippet> {
    return this.makeRequest<OrbitSnippet>('/snippets', 'POST', snippet);
  }
}

export const orbitEcosystem = new OrbitEcosystem();
```

### Express Routes

```typescript
// server/routes.ts (add these routes)

import { orbitEcosystem } from './orbit-ecosystem';

// Initialize on server start
orbitEcosystem.initialize();

// Status endpoint
app.get("/api/orbit/status", async (req, res) => {
  try {
    if (!orbitEcosystem.isConnected()) {
      res.json({ connected: false });
      return;
    }
    const status = await orbitEcosystem.getStatus();
    res.json({ connected: true, ...status });
  } catch (error) {
    res.json({ connected: true, health: { status: 'unreachable' } });
  }
});

// Get snippets
app.get("/api/orbit/snippets", async (req, res) => {
  try {
    if (!orbitEcosystem.isConnected()) {
      res.status(503).json({ error: "Orbit Ecosystem not configured" });
      return;
    }
    const category = req.query.category as string | undefined;
    const snippets = category
      ? await orbitEcosystem.getSnippetsByCategory(category)
      : await orbitEcosystem.getSnippets();
    res.json(snippets);
  } catch (error) {
    console.error("Error fetching snippets:", error);
    res.status(500).json({ error: "Failed to fetch snippets" });
  }
});

// Share snippet
app.post("/api/orbit/snippets", async (req, res) => {
  try {
    if (!orbitEcosystem.isConnected()) {
      res.status(503).json({ error: "Orbit Ecosystem not configured" });
      return;
    }
    const snippet = await orbitEcosystem.shareSnippet(req.body);
    res.status(201).json(snippet);
  } catch (error) {
    console.error("Error sharing snippet:", error);
    res.status(500).json({ error: "Failed to share snippet" });
  }
});
```

---

## Part 5: Frontend UI (Code Hub Page)

### Complete React Component

```tsx
// pages/code-hub.tsx

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Code2, Copy, Check, Search, Tag, FileCode, Folder, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrbitSnippet {
  id: string;
  sourceAppId: string;
  sourceAppName: string;
  name: string;
  description: string;
  code: string;
  language: string;
  category: string;
  tags: string[];
  isPublic: boolean;
  usageCount: number;
  version: string;
  createdAt: string;
  updatedAt: string;
}

interface OrbitStatus {
  connected: boolean;
  hubName?: string;
  appName?: string;
  permissions?: string[];
}

const languageColors: Record<string, string> = {
  typescript: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  javascript: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  json: "bg-green-500/20 text-green-400 border-green-500/30",
  markdown: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  bash: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  python: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const categoryIcons: Record<string, typeof Code2> = {
  authentication: Zap,
  integration: Folder,
  security: FileCode,
  blockchain: Code2,
  documentation: FileCode,
  crm: Folder,
  utility: Zap,
  system: Code2,
};

export default function CodeHub() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSnippet, setSelectedSnippet] = useState<OrbitSnippet | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: status, isLoading: statusLoading } = useQuery<OrbitStatus>({
    queryKey: ["/api/orbit/status"],
  });

  const { data: snippets, isLoading: snippetsLoading } = useQuery<OrbitSnippet[]>({
    queryKey: ["/api/orbit/snippets"],
    enabled: status?.connected === true,
  });

  const categories = snippets
    ? Array.from(new Set(snippets.map((s) => s.category))).sort()
    : [];

  const filteredSnippets = snippets?.filter((snippet) => {
    const matchesSearch =
      searchQuery === "" ||
      snippet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === null || snippet.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({ title: "Copied!", description: "Code copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const formatCode = (code: string, language: string) => {
    if (language === "json") {
      try {
        return JSON.stringify(JSON.parse(code), null, 2);
      } catch {
        return code;
      }
    }
    return code;
  };

  if (statusLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!status?.connected) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Code2 className="h-5 w-5" />
                Orbit Ecosystem Disconnected
              </CardTitle>
              <CardDescription>
                Unable to connect to the ORBIT Ecosystem Hub. Check credentials.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Code2 className="h-8 w-8 text-primary" />
              Code Hub
            </h1>
            <p className="text-muted-foreground mt-1">
              Shared code snippets from {status.hubName}
            </p>
          </div>
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            Connected as {status.appName}
          </Badge>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search snippets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs
            value={selectedCategory || "all"}
            onValueChange={(v) => setSelectedCategory(v === "all" ? null : v)}
          >
            <TabsList className="flex-wrap h-auto gap-1">
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Snippet Grid */}
        {snippetsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSnippets?.map((snippet) => {
              const CategoryIcon = categoryIcons[snippet.category] || Code2;
              return (
                <Card
                  key={snippet.id}
                  className="cursor-pointer hover-elevate transition-all"
                  onClick={() => setSelectedSnippet(snippet)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline" className={languageColors[snippet.language] || ""}>
                          {snippet.language}
                        </Badge>
                      </div>
                      <Badge variant="secondary" className="text-xs">v{snippet.version}</Badge>
                    </div>
                    <CardTitle className="text-lg mt-2 line-clamp-1">{snippet.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{snippet.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {snippet.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-2.5 w-2.5 mr-1" />{tag}
                        </Badge>
                      ))}
                      {snippet.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{snippet.tags.length - 3}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">From: {snippet.sourceAppName}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {filteredSnippets?.length === 0 && !snippetsLoading && (
          <Card className="py-12">
            <CardContent className="text-center">
              <Code2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No snippets found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter</p>
            </CardContent>
          </Card>
        )}

        {/* Snippet Detail Modal */}
        <Dialog open={!!selectedSnippet} onOpenChange={() => setSelectedSnippet(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            {selectedSnippet && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={languageColors[selectedSnippet.language] || ""}>
                      {selectedSnippet.language}
                    </Badge>
                    <Badge variant="secondary">v{selectedSnippet.version}</Badge>
                    <Badge variant="outline">{selectedSnippet.category}</Badge>
                  </div>
                  <DialogTitle className="text-xl">{selectedSnippet.name}</DialogTitle>
                  <DialogDescription>{selectedSnippet.description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {selectedSnippet.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="h-2.5 w-2.5 mr-1" />{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="relative">
                    <div className="absolute right-2 top-2 z-10">
                      <Button size="sm" variant="secondary" onClick={() => copyCode(selectedSnippet.code)}>
                        {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                        {copied ? "Copied" : "Copy"}
                      </Button>
                    </div>
                    <ScrollArea className="h-[400px] rounded-lg border bg-muted/50">
                      <pre className="p-4 text-sm overflow-x-auto">
                        <code>{formatCode(selectedSnippet.code, selectedSnippet.language)}</code>
                      </pre>
                    </ScrollArea>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>Source: {selectedSnippet.sourceAppName}</span>
                    <span>Updated: {new Date(selectedSnippet.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
```

---

## Part 6: Environment Variables Needed

```
ORBIT_ECOSYSTEM_API_KEY=dw_app_[your-key-from-orbit]
ORBIT_ECOSYSTEM_API_SECRET=dw_secret_[your-secret-from-orbit]
ORBIT_ECOSYSTEM_DEV_URL=https://606bb700-1745-49b9-8ff5-b83937d394a3-00-1b1vrn19wm7h.spock.replit.dev/api/ecosystem
```

---

## Part 7: Handoff for ORBIT Staffing Agent

Copy this and send to ORBIT Staffing:

```
NEW ECOSYSTEM APP REGISTRATION

App Name: DarkWave Studios
X-App-Name Header: DarkWaveStudios
Company: Darkwave Studios LLC
Purpose: Central hub for ecosystem code sharing and integration management

REQUESTED PERMISSIONS:
- sync:all (full sync capabilities)
- read:code (access shared snippets)
- write:code (contribute snippets)
- read:workers (view worker data)
- write:workers (sync worker data)
- read:1099 (contractor records)
- write:1099 (submit contractor data)
- read:logs (view activity)
- write:logs (log activity)

Please generate and provide:
1. X-API-Key (format: dw_app_[hash])
2. X-API-Secret (format: dw_secret_[hash])

Once received, DarkWave Studios will verify with:
GET /api/ecosystem/status

Expected response:
{
  "connected": true,
  "hubName": "ORBIT Staffing Ecosystem Hub",
  "appName": "DarkWaveStudios",
  "permissions": [...]
}
```

---

## Part 8: Current Snippets in Hub

As of January 24, 2026, these snippets are available:

| Name | Language | Category | Source |
|------|----------|----------|--------|
| Firebase Auth Config | json | authentication | DarkWave Chain |
| ORBIT-EcosystemClient | typescript | integration | ORBIT Staffing OS |
| ORBIT-WebhookVerify | typescript | security | ORBIT Staffing OS |
| ORBIT-BlockchainVerify | typescript | blockchain | ORBIT Staffing OS |
| ORBIT-VersionCheck | typescript | system | ORBIT Staffing OS |
| ORBIT-API-Reference | markdown | documentation | ORBIT Staffing OS |
| ORBIT-Schema-Reference | markdown | documentation | ORBIT Staffing OS |
| ORBIT-CRM-API | typescript | crm | ORBIT Staffing OS |
| Pre-Publish Sweep | bash | utility | ORBIT Staffing OS |

---

## Summary Checklist

1. [ ] Request credentials from ORBIT Staffing (use handoff in Part 7)
2. [ ] Add secrets to DarkWave Studios environment
3. [ ] Implement backend client (Part 4)
4. [ ] Add API routes (Part 4)
5. [ ] Create Code Hub page (Part 5)
6. [ ] Add route to app router: `/code-hub` or `/developer/code-hub`
7. [ ] Test connection with `/api/orbit/status`
8. [ ] Verify snippets load in UI

---

**Document Version:** 1.0  
**Created:** January 24, 2026  
**Author:** PaintPros Agent
