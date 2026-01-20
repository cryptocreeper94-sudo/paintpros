import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Mail, 
  Clock, 
  Users, 
  Building2,
  ArrowRight,
  Shield,
  Layers
} from "lucide-react";
import { Link } from "wouter";

export default function AdminGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4a5d23] to-[#2d3a16]">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Online Booking System
          </h1>
          <p className="text-xl text-gray-200">
            Admin Guide for Nashville Painting Professionals
          </p>
        </div>

        <Card className="mb-8 border-0 shadow-xl">
          <CardHeader className="bg-amber-50 border-b">
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Calendar className="h-6 w-6" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700">
              Customers can now book appointments directly from <strong>nashpaintpros.io/book</strong>. 
              Here's what happens:
            </p>
            <ol className="space-y-3 ml-4">
              <li className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">1</Badge>
                <span>Customer selects service type (Interior, Exterior, Commercial, Residential)</span>
              </li>
              <li className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">2</Badge>
                <span>They choose their preferred date and time</span>
              </li>
              <li className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">3</Badge>
                <span>They enter their contact information</span>
              </li>
              <li className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">4</Badge>
                <span>Booking is submitted with <strong>PENDING</strong> status</span>
              </li>
              <li className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">5</Badge>
                <span>You receive an email notification at <strong>service@nashvillepaintingprofessionals.com</strong></span>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-8 border-0 shadow-xl">
          <CardHeader className="bg-green-50 border-b">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Shield className="h-6 w-6" />
              Your Role as Admin
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700 font-medium">
              All bookings require your approval before they're confirmed.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Confirm</p>
                  <p className="text-sm text-green-600">Approve the appointment</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                <XCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">Cancel</p>
                  <p className="text-sm text-red-600">Decline with a reason</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Complete</p>
                  <p className="text-sm text-blue-600">Mark job as finished</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Clock className="h-8 w-8 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">No Show</p>
                  <p className="text-sm text-gray-600">Customer didn't show up</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 border-0 shadow-xl">
          <CardHeader className="bg-blue-50 border-b">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Mail className="h-6 w-6" />
              Email Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700">
              Every new booking sends an email to:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <code className="text-lg font-mono text-blue-600">
                service@nashvillepaintingprofessionals.com
              </code>
            </div>
            <p className="text-gray-600 text-sm">
              Each email includes customer details, service type, requested date/time, 
              and a reminder to log in and confirm or decline.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8 border-0 shadow-xl border-2 border-amber-400">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Layers className="h-6 w-6" />
              NEW: Unified Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700">
              You now have access to a <strong>unified dashboard</strong> that lets you manage 
              both Nashville Painting Professionals and Lume Paint Co from one place.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-3 p-4 bg-[#4a5d23]/10 rounded-lg">
                <Building2 className="h-8 w-8 text-[#4a5d23]" />
                <div>
                  <p className="font-medium text-[#4a5d23]">NPP Tab</p>
                  <p className="text-sm text-gray-600">Nashville Painting Professionals</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                <Building2 className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-800">Lume Tab</p>
                  <p className="text-sm text-purple-600">Lume Paint Co</p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-amber-800 text-sm">
                <strong>Benefits:</strong> No more logging in and out between systems. 
                Switch between companies with a single click while keeping all your 
                access permissions intact.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 border-0 shadow-xl">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Users className="h-6 w-6" />
              Quick Reference
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <table className="w-full">
              <tbody className="divide-y">
                <tr>
                  <td className="py-3 text-gray-600">Customer booking page</td>
                  <td className="py-3 font-mono text-sm text-blue-600">nashpaintpros.io/book</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-600">Admin dashboard</td>
                  <td className="py-3 font-mono text-sm text-blue-600">nashpaintpros.io/admin</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-600">Owner dashboard</td>
                  <td className="py-3 font-mono text-sm text-blue-600">nashpaintpros.io/owner</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-600">Social media landing</td>
                  <td className="py-3 font-mono text-sm text-blue-600">nashpaintpros.io/start</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <Link href="/admin">
            <Button size="lg" className="bg-[#4a5d23] hover:bg-[#3d4d1c] text-white">
              Go to Admin Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-gray-300 text-sm">
            Questions? Reply to any system email and we'll help you out.
          </p>
        </div>
      </div>
    </div>
  );
}
