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
  Layers,
  Calculator,
  Palette,
  Camera,
  ScanLine,
  Instagram,
  Phone,
  DollarSign
} from "lucide-react";
import { Link } from "wouter";

export default function AdminGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4a5d23] to-[#2d3a16]">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            NPP System Guide
          </h1>
          <p className="text-xl text-gray-200">
            Complete Admin Guide for Nashville Painting Professionals
          </p>
        </div>

        <Card className="mb-8 border-0 shadow-xl border-2 border-purple-400">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Calculator className="h-6 w-6" />
              Instant Estimator
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700">
              Customers can get instant estimates at <strong>nashpaintpros.io/estimate</strong>. 
              The system automatically calculates pricing based on their selections.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                <ScanLine className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-800">Room Scanner</p>
                  <p className="text-sm text-purple-600">Customers scan rooms to auto-calculate square footage</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-lg">
                <Palette className="h-8 w-8 text-pink-600" />
                <div>
                  <p className="font-medium text-pink-800">Color Match Scanner</p>
                  <p className="text-sm text-pink-600">Scan any color to find matching paint</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <Camera className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Photo Uploads</p>
                  <p className="text-sm text-blue-600">Customers can upload room photos</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Instant Pricing</p>
                  <p className="text-sm text-green-600">Shows total price (individual rates hidden)</p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-purple-800 text-sm">
                <strong>What you receive:</strong> Customer info, service selections, square footage, 
                door counts, color choices, uploaded photos, and the calculated estimate total.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 border-0 shadow-xl border-2 border-pink-400">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100 border-b border-pink-200">
            <CardTitle className="flex items-center gap-2 text-pink-800">
              <Instagram className="h-6 w-6" />
              Social Media Landing Page
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700">
              Share this link on Instagram, Facebook, and other social media:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <code className="text-lg font-mono text-pink-600">
                nashpaintpros.io/start
              </code>
            </div>
            <p className="text-gray-700 mt-4">
              This page gives customers three quick options:
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <Phone className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Call Now</p>
                  <p className="text-xs text-green-600">Direct phone call</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <Mail className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Email Us</p>
                  <p className="text-xs text-blue-600">Opens email</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                <Calculator className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-800">Get Estimate</p>
                  <p className="text-xs text-purple-600">Estimator</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 border-0 shadow-xl">
          <CardHeader className="bg-amber-50 border-b">
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Calendar className="h-6 w-6" />
              Online Booking System
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700">
              Customers can book appointments at <strong>nashpaintpros.io/book</strong>. 
              Here's the 5-step process:
            </p>
            <ol className="space-y-3 ml-4">
              <li className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">1</Badge>
                <span>Customer selects service type (Interior, Exterior, Commercial, Residential)</span>
              </li>
              <li className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">2</Badge>
                <span>They choose their preferred date</span>
              </li>
              <li className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">3</Badge>
                <span>They select an available time slot</span>
              </li>
              <li className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">4</Badge>
                <span>They enter contact information and address</span>
              </li>
              <li className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">5</Badge>
                <span>Booking submitted with <strong>PENDING</strong> status</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-8 border-0 shadow-xl">
          <CardHeader className="bg-green-50 border-b">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Shield className="h-6 w-6" />
              Managing Bookings
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
              All notifications go to:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <code className="text-lg font-mono text-blue-600">
                service@nashvillepaintingprofessionals.com
              </code>
            </div>
            <p className="text-gray-700 mt-4">You'll receive emails for:</p>
            <ul className="list-disc ml-6 space-y-2 text-gray-600">
              <li>New estimate requests (with customer details, selections, and pricing)</li>
              <li>New booking requests (with date, time, and customer info)</li>
              <li>Contact form submissions</li>
              <li>Contractor applications</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8 border-0 shadow-xl border-2 border-amber-400">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Layers className="h-6 w-6" />
              Unified Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700">
              The Admin, Owner, and Developer dashboards now have <strong>tenant tabs</strong> at the top. 
              Switch between NPP and Lume with one click - no logging in and out!
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
                  <td className="py-3 text-gray-600">Social media landing</td>
                  <td className="py-3 font-mono text-sm text-pink-600 font-bold">nashpaintpros.io/start</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-600">Instant Estimator</td>
                  <td className="py-3 font-mono text-sm text-purple-600">nashpaintpros.io/estimate</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-600">Online booking</td>
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
                  <td className="py-3 text-gray-600">This guide</td>
                  <td className="py-3 font-mono text-sm text-blue-600">nashpaintpros.io/admin-guide</td>
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
