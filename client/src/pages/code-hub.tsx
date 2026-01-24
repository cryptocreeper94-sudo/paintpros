import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Code2, Copy, Check, Search, Tag, FileCode, Folder, ExternalLink, Zap } from "lucide-react";
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
  endpoint: string;
  health: {
    connected: boolean;
    hubName: string;
    appName: string;
    permissions: string[];
    lastSync: string;
  };
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
    enabled: status?.health?.connected === true,
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
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
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

  if (!status?.health?.connected) {
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
                Unable to connect to the ORBIT Staffing Ecosystem Hub. Please check credentials and try again.
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
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Code2 className="h-8 w-8 text-primary" />
              Code Hub
            </h1>
            <p className="text-muted-foreground mt-1">
              Shared code snippets from {status.health.hubName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              Connected as {status.health.appName}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search snippets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-snippets"
            />
          </div>

          <Tabs
            value={selectedCategory || "all"}
            onValueChange={(v) => setSelectedCategory(v === "all" ? null : v)}
            className="w-full md:w-auto"
          >
            <TabsList className="flex-wrap h-auto gap-1">
              <TabsTrigger value="all" data-testid="tab-category-all">All</TabsTrigger>
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat} data-testid={`tab-category-${cat}`}>
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

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
                  data-testid={`card-snippet-${snippet.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                        <Badge
                          variant="outline"
                          className={languageColors[snippet.language] || ""}
                        >
                          {snippet.language}
                        </Badge>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        v{snippet.version}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-2 line-clamp-1">
                      {snippet.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {snippet.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {snippet.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-2.5 w-2.5 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {snippet.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{snippet.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      From: {snippet.sourceAppName}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {filteredSnippets?.length === 0 && !snippetsLoading && (
          <Card className="py-12">
            <CardContent className="text-center">
              <Code2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No snippets found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or category filter
              </p>
            </CardContent>
          </Card>
        )}

        <Dialog open={!!selectedSnippet} onOpenChange={() => setSelectedSnippet(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            {selectedSnippet && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className={languageColors[selectedSnippet.language] || ""}
                    >
                      {selectedSnippet.language}
                    </Badge>
                    <Badge variant="secondary">v{selectedSnippet.version}</Badge>
                    <Badge variant="outline">{selectedSnippet.category}</Badge>
                  </div>
                  <DialogTitle className="text-xl">
                    {selectedSnippet.name}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedSnippet.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {selectedSnippet.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="h-2.5 w-2.5 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="relative">
                    <div className="absolute right-2 top-2 z-10">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyCode(selectedSnippet.code)}
                        data-testid="button-copy-code"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 mr-1" />
                        ) : (
                          <Copy className="h-4 w-4 mr-1" />
                        )}
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
                    <span>
                      Updated: {new Date(selectedSnippet.updatedAt).toLocaleDateString()}
                    </span>
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
