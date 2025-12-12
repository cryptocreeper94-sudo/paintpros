import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { FlipButton } from "@/components/ui/flip-button";
import { ArrowRight, Calculator, Calendar, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(5, "Address is required"),
  projectType: z.string().min(1, "Please select a project type"),
});

export default function Estimate() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      projectType: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/estimate-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to submit estimate request");
      }

      const data = await response.json();
      
      // Show success message
      alert("Thank you! Your estimate request has been submitted. We'll contact you within 24 hours.");
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error submitting estimate request:", error);
      alert("There was an error submitting your request. Please try again or call us directly at (615) 930-1550.");
    }
  }

  return (
    <PageLayout>
      <main className="pt-24 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4">Start Your Project</h1>
            <p className="text-xl text-muted-foreground">
              Tell us about your vision. We'll provide a detailed, transparent estimate.
            </p>
          </div>

          <GlassCard className="p-8 md:p-12" glow>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="bg-white/5 border-white/10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" {...field} className="bg-white/5 border-white/10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="(615) 555-0123" {...field} className="bg-white/5 border-white/10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Type</FormLabel>
                        <FormControl>
                          <select 
                            {...field} 
                            className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="" disabled>Select Type...</option>
                            <option value="interior">Interior Painting</option>
                            <option value="exterior">Exterior Painting</option>
                            <option value="cabinets">Cabinet Refinishing</option>
                            <option value="commercial">Commercial</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, Nashville, TN" {...field} className="bg-white/5 border-white/10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 flex justify-end">
                  <FlipButton className="w-full md:w-auto">
                    Request Consultation <ArrowRight className="w-4 h-4" />
                  </FlipButton>
                </div>
              </form>
            </Form>
          </GlassCard>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold mb-2">Upload Photos</h3>
              <p className="text-sm text-muted-foreground">Coming soon: Upload photos for an instant AI estimate.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold mb-2">Schedule Online</h3>
              <p className="text-sm text-muted-foreground">Pick a time that works for you directly from our calendar.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <Calculator className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold mb-2">Detailed Quote</h3>
              <p className="text-sm text-muted-foreground">Receive a comprehensive breakdown within 24 hours.</p>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
