import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  DollarSign, TrendingUp, Users, Palette, Coffee, Briefcase, 
  Plus, Calendar, ArrowUpRight, CheckCircle, Clock, Receipt,
  PieChart, BarChart3, CreditCard
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ROYALTY_PRODUCTS } from "@shared/schema";
import { format } from "date-fns";

const productIcons: Record<string, any> = {
  paintpros: Palette,
  brewandboard: Coffee,
  orbitstaffing: Briefcase,
  shared: Users
};

const productColors: Record<string, string> = {
  paintpros: "bg-blue-100 text-blue-800",
  brewandboard: "bg-amber-100 text-amber-800",
  orbitstaffing: "bg-purple-100 text-purple-800",
  shared: "bg-gray-100 text-gray-800"
};

export default function RoyaltyDashboard() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);
  const [addRevenueOpen, setAddRevenueOpen] = useState(false);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [addPayoutOpen, setAddPayoutOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['/api/royalty/summary', selectedYear, selectedMonth],
    queryFn: async () => {
      const params = new URLSearchParams({ year: selectedYear.toString() });
      if (selectedMonth) params.append('month', selectedMonth.toString());
      const res = await fetch(`/api/royalty/summary?${params}`);
      return res.json();
    }
  });

  const { data: revenues = [] } = useQuery<any[]>({
    queryKey: ['/api/royalty/revenue'],
  });

  const { data: expenses = [] } = useQuery<any[]>({
    queryKey: ['/api/royalty/expenses'],
  });

  const { data: payouts = [] } = useQuery<any[]>({
    queryKey: ['/api/royalty/payouts'],
  });

  const createRevenueMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/royalty/revenue', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/royalty/revenue'] });
      queryClient.invalidateQueries({ queryKey: ['/api/royalty/summary'] });
      setAddRevenueOpen(false);
    }
  });

  const createExpenseMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/royalty/expenses', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/royalty/expenses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/royalty/summary'] });
      setAddExpenseOpen(false);
    }
  });

  const createPayoutMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/royalty/payouts', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/royalty/payouts'] });
      setAddPayoutOpen(false);
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const handleAddRevenue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const periodStart = new Date(formData.get('periodStart') as string);
    const periodEnd = new Date(formData.get('periodEnd') as string);
    
    createRevenueMutation.mutate({
      productCode: formData.get('productCode'),
      source: formData.get('source'),
      amount: formData.get('amount'),
      periodStart: periodStart.toISOString(),
      periodEnd: periodEnd.toISOString(),
      description: formData.get('description'),
    });
  };

  const handleAddExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const expenseDate = new Date(formData.get('expenseDate') as string);
    
    createExpenseMutation.mutate({
      productCode: formData.get('productCode'),
      category: formData.get('category'),
      amount: formData.get('amount'),
      description: formData.get('description'),
      expenseDate: expenseDate.toISOString(),
      periodYear: expenseDate.getFullYear(),
      periodMonth: expenseDate.getMonth() + 1,
    });
  };

  const handleAddPayout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createPayoutMutation.mutate({
      recipientName: "Sidonie Summers",
      recipientEmail: formData.get('recipientEmail'),
      amount: formData.get('amount'),
      periodDescription: formData.get('periodDescription'),
      payoutType: formData.get('payoutType'),
      status: 'pending',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" data-testid="text-page-title">
              Royalty Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Track revenue, expenses, and payouts across all platforms
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
              <SelectTrigger className="w-[120px]" data-testid="select-year">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedMonth?.toString() || "all"} onValueChange={(v) => setSelectedMonth(v === "all" ? undefined : parseInt(v))}>
              <SelectTrigger className="w-[140px]" data-testid="select-month">
                <SelectValue placeholder="All Months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {[...Array(12)].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {format(new Date(2024, i, 1), 'MMMM')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600" data-testid="text-total-revenue">
                {summaryLoading ? "..." : formatCurrency(summary?.totalRevenue || 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Combined all platforms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Expenses</CardTitle>
              <Receipt className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600" data-testid="text-total-expenses">
                {summaryLoading ? "..." : formatCurrency(summary?.totalExpenses || 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Operating costs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Net Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600" data-testid="text-net-profit">
                {summaryLoading ? "..." : formatCurrency(summary?.netProfit || 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Revenue minus expenses</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Sidonie's Share (50%)</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700" data-testid="text-contributor-share">
                {summaryLoading ? "..." : formatCurrency(summary?.contributorShare || 0)}
              </div>
              <p className="text-xs text-purple-600 mt-1">Co-owner profit share</p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue by Product */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-600" />
              Revenue by Platform
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(ROYALTY_PRODUCTS).map(([code, product]) => {
                const Icon = productIcons[code] || Users;
                const amount = summary?.revenueByProduct?.[code] || 0;
                return (
                  <div key={code} className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                    <div className={`p-2 rounded-lg ${productColors[code]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-lg font-bold text-gray-700">{formatCurrency(amount)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tabs for detailed views */}
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue" data-testid="tab-revenue">Revenue</TabsTrigger>
            <TabsTrigger value="expenses" data-testid="tab-expenses">Expenses</TabsTrigger>
            <TabsTrigger value="payouts" data-testid="tab-payouts">Payouts</TabsTrigger>
          </TabsList>

          {/* Revenue Tab */}
          <TabsContent value="revenue">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div>
                  <CardTitle>Revenue Entries</CardTitle>
                  <CardDescription>SaaS subscriptions and Nashville project income</CardDescription>
                </div>
                <Dialog open={addRevenueOpen} onOpenChange={setAddRevenueOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" data-testid="button-add-revenue">
                      <Plus className="h-4 w-4 mr-1" /> Add Revenue
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Revenue Entry</DialogTitle>
                      <DialogDescription>Record new revenue from SaaS or Nashville project</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddRevenue} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Product</Label>
                        <Select name="productCode" defaultValue="paintpros">
                          <SelectTrigger data-testid="select-product-code">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(ROYALTY_PRODUCTS).map(([code, product]) => (
                              <SelectItem key={code} value={code}>{product.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Source</Label>
                        <Select name="source" defaultValue="stripe">
                          <SelectTrigger data-testid="select-source">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="stripe">Stripe</SelectItem>
                            <SelectItem value="nashville_paycheck">Nashville Paycheck</SelectItem>
                            <SelectItem value="manual">Manual Entry</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Amount ($)</Label>
                        <Input name="amount" type="number" step="0.01" required data-testid="input-amount" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Period Start</Label>
                          <Input name="periodStart" type="date" required data-testid="input-period-start" />
                        </div>
                        <div className="space-y-2">
                          <Label>Period End</Label>
                          <Input name="periodEnd" type="date" required data-testid="input-period-end" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input name="description" placeholder="Optional description" data-testid="input-description" />
                      </div>
                      <Button type="submit" className="w-full" disabled={createRevenueMutation.isPending} data-testid="button-submit-revenue">
                        {createRevenueMutation.isPending ? "Adding..." : "Add Revenue"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {revenues.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No revenue entries yet</p>
                ) : (
                  <div className="space-y-3">
                    {revenues.map((rev: any) => {
                      const Icon = productIcons[rev.productCode] || Users;
                      return (
                        <div key={rev.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${productColors[rev.productCode]}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">{ROYALTY_PRODUCTS[rev.productCode as keyof typeof ROYALTY_PRODUCTS]?.name || rev.productCode}</p>
                              <p className="text-sm text-gray-500">{rev.description || rev.source}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">{formatCurrency(parseFloat(rev.amount))}</p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(rev.periodStart), 'MMM d')} - {format(new Date(rev.periodEnd), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div>
                  <CardTitle>Expense Entries</CardTitle>
                  <CardDescription>Operating costs deducted before profit split</CardDescription>
                </div>
                <Dialog open={addExpenseOpen} onOpenChange={setAddExpenseOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" data-testid="button-add-expense">
                      <Plus className="h-4 w-4 mr-1" /> Add Expense
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Expense Entry</DialogTitle>
                      <DialogDescription>Record operating expenses</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddExpense} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Product</Label>
                        <Select name="productCode" defaultValue="shared">
                          <SelectTrigger data-testid="select-expense-product">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(ROYALTY_PRODUCTS).map(([code, product]) => (
                              <SelectItem key={code} value={code}>{product.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select name="category" defaultValue="hosting">
                          <SelectTrigger data-testid="select-expense-category">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hosting">Hosting/Infrastructure</SelectItem>
                            <SelectItem value="software">Software/Tools</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="contractor">Contractor</SelectItem>
                            <SelectItem value="api">API Costs</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Amount ($)</Label>
                        <Input name="amount" type="number" step="0.01" required data-testid="input-expense-amount" />
                      </div>
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input name="expenseDate" type="date" required data-testid="input-expense-date" />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input name="description" required data-testid="input-expense-description" />
                      </div>
                      <Button type="submit" className="w-full" disabled={createExpenseMutation.isPending} data-testid="button-submit-expense">
                        {createExpenseMutation.isPending ? "Adding..." : "Add Expense"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No expense entries yet</p>
                ) : (
                  <div className="space-y-3">
                    {expenses.map((exp: any) => {
                      const Icon = productIcons[exp.productCode] || Users;
                      return (
                        <div key={exp.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${productColors[exp.productCode]}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">{exp.description}</p>
                              <p className="text-sm text-gray-500">{exp.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-red-600">-{formatCurrency(parseFloat(exp.amount))}</p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(exp.expenseDate), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payouts Tab */}
          <TabsContent value="payouts">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div>
                  <CardTitle>Payout History</CardTitle>
                  <CardDescription>Payments made to Sidonie Summers</CardDescription>
                </div>
                <Dialog open={addPayoutOpen} onOpenChange={setAddPayoutOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" data-testid="button-add-payout">
                      <Plus className="h-4 w-4 mr-1" /> Record Payout
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Record Payout</DialogTitle>
                      <DialogDescription>Record a payment to Sidonie</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddPayout} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Recipient Email</Label>
                        <Input name="recipientEmail" type="email" required data-testid="input-payout-email" />
                      </div>
                      <div className="space-y-2">
                        <Label>Payout Type</Label>
                        <Select name="payoutType" defaultValue="saas_profit_share">
                          <SelectTrigger data-testid="select-payout-type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="saas_profit_share">SaaS Profit Share (50%)</SelectItem>
                            <SelectItem value="nashville_royalty">Nashville Royalty</SelectItem>
                            <SelectItem value="signing_bonus">Signing Bonus</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Amount ($)</Label>
                        <Input name="amount" type="number" step="0.01" required data-testid="input-payout-amount" />
                      </div>
                      <div className="space-y-2">
                        <Label>Period Description</Label>
                        <Input name="periodDescription" placeholder="e.g., January 2025" required data-testid="input-payout-period" />
                      </div>
                      <Button type="submit" className="w-full" disabled={createPayoutMutation.isPending} data-testid="button-submit-payout">
                        {createPayoutMutation.isPending ? "Recording..." : "Record Payout"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {payouts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No payouts recorded yet</p>
                ) : (
                  <div className="space-y-3">
                    {payouts.map((payout: any) => (
                      <div key={payout.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${payout.status === 'paid' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                            {payout.status === 'paid' ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{payout.recipientName}</p>
                            <p className="text-sm text-gray-500">{payout.periodDescription} - {payout.payoutType.replace(/_/g, ' ')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-600">{formatCurrency(parseFloat(payout.amount))}</p>
                          <Badge variant={payout.status === 'paid' ? 'default' : 'secondary'} className="text-xs">
                            {payout.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
