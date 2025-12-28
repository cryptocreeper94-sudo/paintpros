import { createContext, useContext, ReactNode } from "react";
import { useTenant } from "./TenantContext";

interface DemoBooking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  scheduledDate: string;
  scheduledTime: string;
  status: string;
  address: string;
  notes: string;
}

interface DemoCRMDeal {
  id: string;
  title: string;
  customerName: string;
  customerEmail: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate: string;
  jobAddress: string;
  notes: string;
}

interface DemoCalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  eventType: string;
  location: string;
}

interface DemoCrewMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  status: string;
}

interface DemoContext {
  isDemoMode: boolean;
  demoBookings: DemoBooking[];
  demoCRMDeals: DemoCRMDeal[];
  demoCalendarEvents: DemoCalendarEvent[];
  demoCrewMembers: DemoCrewMember[];
}

const demoBookings: DemoBooking[] = [
  {
    id: "demo-1",
    customerName: "John Anderson",
    customerEmail: "john.anderson@email.com",
    customerPhone: "(615) 555-0101",
    serviceType: "Interior Painting",
    scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: "9:00 AM",
    status: "confirmed",
    address: "123 Maple Street, Nashville, TN 37201",
    notes: "3 bedrooms, 1 living room. Customer prefers morning appointments."
  },
  {
    id: "demo-2",
    customerName: "Sarah Williams",
    customerEmail: "sarah.w@email.com",
    customerPhone: "(615) 555-0202",
    serviceType: "Exterior Painting",
    scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: "8:00 AM",
    status: "pending",
    address: "456 Oak Avenue, Franklin, TN 37064",
    notes: "Two-story home. Needs power washing before painting."
  },
  {
    id: "demo-3",
    customerName: "Michael Chen",
    customerEmail: "m.chen@email.com",
    customerPhone: "(615) 555-0303",
    serviceType: "Cabinet Refinishing",
    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: "10:00 AM",
    status: "confirmed",
    address: "789 Pine Road, Brentwood, TN 37027",
    notes: "Kitchen cabinets only. Color: Swiss Coffee."
  }
];

const demoCRMDeals: DemoCRMDeal[] = [
  {
    id: "deal-1",
    title: "Anderson Home Interior",
    customerName: "John Anderson",
    customerEmail: "john.anderson@email.com",
    value: 4500,
    stage: "proposal",
    probability: 75,
    expectedCloseDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    jobAddress: "123 Maple Street, Nashville, TN 37201",
    notes: "Very interested. Following up on color selections."
  },
  {
    id: "deal-2",
    title: "Williams Exterior Repaint",
    customerName: "Sarah Williams",
    customerEmail: "sarah.w@email.com",
    value: 8200,
    stage: "qualified",
    probability: 50,
    expectedCloseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    jobAddress: "456 Oak Avenue, Franklin, TN 37064",
    notes: "Comparing quotes. Need to follow up next week."
  },
  {
    id: "deal-3",
    title: "Chen Kitchen Cabinets",
    customerName: "Michael Chen",
    customerEmail: "m.chen@email.com",
    value: 3200,
    stage: "won",
    probability: 100,
    expectedCloseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    jobAddress: "789 Pine Road, Brentwood, TN 37027",
    notes: "Contract signed. Starting next week."
  },
  {
    id: "deal-4",
    title: "Thompson Office Suite",
    customerName: "Robert Thompson",
    customerEmail: "r.thompson@business.com",
    value: 12500,
    stage: "negotiation",
    probability: 60,
    expectedCloseDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    jobAddress: "100 Commerce Way, Nashville, TN 37203",
    notes: "Commercial project. 6 offices + conference room."
  },
  {
    id: "deal-5",
    title: "Garcia New Construction",
    customerName: "Maria Garcia",
    customerEmail: "maria.garcia@email.com",
    value: 15000,
    stage: "lead",
    probability: 25,
    expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    jobAddress: "New Build - Lot 42, Murfreesboro, TN",
    notes: "Builder referral. Meeting scheduled for site visit."
  }
];

const demoCalendarEvents: DemoCalendarEvent[] = [
  {
    id: "cal-1",
    title: "Anderson Estimate",
    description: "On-site estimate for interior painting",
    startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    eventType: "estimate",
    location: "123 Maple Street, Nashville"
  },
  {
    id: "cal-2",
    title: "Williams Job Start",
    description: "Exterior painting - Day 1",
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
    eventType: "job",
    location: "456 Oak Avenue, Franklin"
  },
  {
    id: "cal-3",
    title: "Team Meeting",
    description: "Weekly crew standup",
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    eventType: "meeting",
    location: "Office"
  },
  {
    id: "cal-4",
    title: "Chen Cabinet Project",
    description: "Kitchen cabinet refinishing",
    startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    eventType: "job",
    location: "789 Pine Road, Brentwood"
  }
];

const demoCrewMembers: DemoCrewMember[] = [
  { id: "crew-1", name: "Marcus Johnson", role: "Lead Painter", phone: "(615) 555-1001", status: "active" },
  { id: "crew-2", name: "David Martinez", role: "Painter", phone: "(615) 555-1002", status: "active" },
  { id: "crew-3", name: "James Wilson", role: "Painter", phone: "(615) 555-1003", status: "active" },
  { id: "crew-4", name: "Chris Taylor", role: "Apprentice", phone: "(615) 555-1004", status: "active" }
];

const DemoContext = createContext<DemoContext>({
  isDemoMode: false,
  demoBookings: [],
  demoCRMDeals: [],
  demoCalendarEvents: [],
  demoCrewMembers: []
});

export function DemoProvider({ children }: { children: ReactNode }) {
  const tenant = useTenant();
  const isDemoMode = tenant.id === "demo";

  return (
    <DemoContext.Provider value={{
      isDemoMode,
      demoBookings: isDemoMode ? demoBookings : [],
      demoCRMDeals: isDemoMode ? demoCRMDeals : [],
      demoCalendarEvents: isDemoMode ? demoCalendarEvents : [],
      demoCrewMembers: isDemoMode ? demoCrewMembers : []
    }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  return useContext(DemoContext);
}
