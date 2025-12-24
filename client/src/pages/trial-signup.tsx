import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Paintbrush, Rocket, Clock, Shield, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

const signupSchema = z.object({
  ownerName: z.string().min(1, "Your name is required"),
  ownerEmail: z.string().email("Valid email required"),
  ownerPhone: z.string().optional(),
  companyName: z.string().min(1, "Company name is required"),
  companyCity: z.string().optional(),
  companyState: z.string().optional(),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function TrialSignup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      ownerName: "",
      ownerEmail: "",
      ownerPhone: "",
      companyName: "",
      companyCity: "",
      companyState: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupFormData) => {
      const response = await apiRequest("POST", "/api/trial/signup", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Your portal is ready!",
        description: "Redirecting you to your branded trial portal...",
      });
      setTimeout(() => {
        setLocation(`/trial/${data.companySlug}`);
      }, 1500);
    },
    onError: (error: any) => {
      try {
        const errorData = JSON.parse(error.message.split(": ").slice(1).join(": "));
        if (errorData.error === "Trial already exists" && errorData.slug) {
          toast({
            title: "You already have a trial",
            description: "Redirecting to your existing portal...",
            variant: "default",
          });
          setTimeout(() => {
            setLocation(`/trial/${errorData.slug}`);
          }, 1500);
          return;
        }
      } catch {
        // Not a JSON error, handle normally
      }
      toast({
        title: "Signup failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      setIsCreating(false);
    },
  });

  const onSubmit = (data: SignupFormData) => {
    setIsCreating(true);
    signupMutation.mutate(data);
  };

  const features = [
    { icon: Clock, title: "72-Hour Access", desc: "Full platform access for 3 days" },
    { icon: Sparkles, title: "AI Color Visualizer", desc: "Let customers preview colors on their walls" },
    { icon: Shield, title: "Blockchain Stamping", desc: "1 free verified estimate" },
    { icon: CheckCircle2, title: "Lead Capture", desc: "Collect up to 3 customer leads" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
              <Rocket className="w-4 h-4" />
              Launch Your Portal in 60 Seconds
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Start Your Free Trial
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get your own branded painting portal with AI tools, blockchain verification, and customer management - no credit card required.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <Card className="border-2 border-emerald-200 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Paintbrush className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Create Your Portal</CardTitle>
                    <CardDescription>Takes less than a minute</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="ownerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="John Smith" 
                              data-testid="input-owner-name"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ownerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="john@yourcompany.com" 
                              data-testid="input-owner-email"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ownerPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="tel" 
                              placeholder="(555) 123-4567" 
                              data-testid="input-owner-phone"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-2 border-t">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Smith Painting Co." 
                                data-testid="input-company-name"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="companyCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Nashville" 
                                data-testid="input-company-city"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="companyState"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="TN" 
                                data-testid="input-company-state"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg"
                      className="w-full"
                      disabled={isCreating || signupMutation.isPending}
                      data-testid="button-create-portal"
                    >
                      {isCreating || signupMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                          Creating Your Portal...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Launch My Portal
                          <ArrowRight className="w-5 h-5" />
                        </span>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-slate-900 text-white border-0">
                <CardHeader>
                  <CardTitle className="text-2xl">What You Get</CardTitle>
                  <CardDescription className="text-slate-300">
                    Everything you need to impress customers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="p-2 bg-emerald-500/20 rounded-lg shrink-0">
                        <feature.icon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{feature.title}</h3>
                        <p className="text-sm text-slate-400">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 rounded-full shrink-0">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-900">No Credit Card Required</h3>
                      <p className="text-sm text-amber-700 mt-1">
                        Your 72-hour trial starts immediately. Explore all features risk-free. 
                        Upgrade anytime to keep your portal and unlock unlimited access.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
