import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, 
         addWeeks, subWeeks, isSameMonth, isSameDay, parseISO, startOfDay, endOfDay,
         setHours, setMinutes, differenceInMinutes, isToday } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin, 
  User, Bell, Trash2, Edit2, X, Check, AlertCircle
} from "lucide-react";
import type { CalendarEvent } from "@shared/schema";

const EVENT_TYPES = [
  { value: 'appointment', label: 'Appointment', defaultColor: '#3b82f6' },
  { value: 'meeting', label: 'Meeting', defaultColor: '#8b5cf6' },
  { value: 'deadline', label: 'Deadline', defaultColor: '#ef4444' },
  { value: 'task', label: 'Task', defaultColor: '#22c55e' },
  { value: 'reminder', label: 'Reminder', defaultColor: '#f59e0b' },
  { value: 'follow-up', label: 'Follow-up', defaultColor: '#06b6d4' },
  { value: 'estimate', label: 'Estimate', defaultColor: '#ec4899' },
  { value: 'job', label: 'Job', defaultColor: '#10b981' },
];

const COLOR_PRESETS = [
  '#3b82f6', '#8b5cf6', '#ef4444', '#22c55e', '#f59e0b', 
  '#06b6d4', '#ec4899', '#10b981', '#6366f1', '#84cc16'
];

const REMINDER_OPTIONS = [
  { value: 5, label: '5 minutes before' },
  { value: 15, label: '15 minutes before' },
  { value: 30, label: '30 minutes before' },
  { value: 60, label: '1 hour before' },
  { value: 120, label: '2 hours before' },
  { value: 1440, label: '1 day before' },
];

interface EventFormData {
  title: string;
  description: string;
  eventType: string;
  startTime: string;
  startDate: string;
  endTime: string;
  endDate: string;
  isAllDay: boolean;
  location: string;
  color: string;
  assignedTo: string;
  notes: string;
  reminderMinutes: number | null;
}

function EventCard({ event, onClick }: { event: CalendarEvent; onClick: () => void }) {
  const eventColor = event.colorCode || EVENT_TYPES.find(t => t.value === event.eventType)?.defaultColor || '#3b82f6';
  
  return (
    <div
      onClick={onClick}
      className="px-2 py-1 rounded text-xs text-white truncate cursor-pointer hover:opacity-90 transition-opacity"
      style={{ backgroundColor: eventColor }}
      data-testid={`calendar-event-${event.id}`}
    >
      {!event.allDay && event.startTime && (
        <span className="font-medium mr-1">
          {format(new Date(event.startTime), 'h:mm a')}
        </span>
      )}
      <span>{event.title}</span>
    </div>
  );
}

function MonthView({ 
  currentDate, 
  events, 
  onDateClick, 
  onEventClick 
}: { 
  currentDate: Date; 
  events: CalendarEvent[]; 
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = [];
  let day = calendarStart;
  
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }
  
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 border-b">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
          <div key={dayName} className="p-2 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0">
            {dayName}
          </div>
        ))}
      </div>
      <div className="flex-1 grid grid-rows-5 md:grid-rows-6">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 border-b last:border-b-0">
            {week.map((dayDate, dayIndex) => {
              const dayEvents = events.filter(e => 
                e.startTime && isSameDay(new Date(e.startTime), dayDate)
              );
              const isCurrentMonth = isSameMonth(dayDate, currentDate);
              const isCurrentDay = isToday(dayDate);
              
              return (
                <div
                  key={dayIndex}
                  className={`min-h-[80px] md:min-h-[100px] p-1 border-r last:border-r-0 cursor-pointer hover-elevate transition-colors ${
                    !isCurrentMonth ? 'bg-muted/30' : ''
                  } ${isCurrentDay ? 'bg-primary/5' : ''}`}
                  onClick={() => onDateClick(dayDate)}
                  data-testid={`calendar-day-${format(dayDate, 'yyyy-MM-dd')}`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isCurrentDay ? 'text-primary' : !isCurrentMonth ? 'text-muted-foreground' : ''
                  }`}>
                    {format(dayDate, 'd')}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 3).map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        onClick={() => {
                          onEventClick(event);
                        }}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground px-2">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function WeekView({ 
  currentDate, 
  events, 
  onTimeClick, 
  onEventClick 
}: { 
  currentDate: Date; 
  events: CalendarEvent[]; 
  onTimeClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}) {
  const weekStart = startOfWeek(currentDate);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="grid grid-cols-8 border-b sticky top-0 bg-background z-10">
        <div className="p-2 border-r" />
        {days.map((day) => (
          <div 
            key={day.toISOString()} 
            className={`p-2 text-center border-r last:border-r-0 ${
              isToday(day) ? 'bg-primary/5' : ''
            }`}
          >
            <div className="text-sm font-medium">{format(day, 'EEE')}</div>
            <div className={`text-lg ${isToday(day) ? 'text-primary font-bold' : ''}`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1">
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b min-h-[60px]">
            <div className="p-1 text-xs text-muted-foreground text-right border-r">
              {format(setHours(new Date(), hour), 'h a')}
            </div>
            {days.map((day) => {
              const hourStart = setMinutes(setHours(day, hour), 0);
              const hourEnd = setMinutes(setHours(day, hour), 59);
              const hourEvents = events.filter(e => {
                if (!e.startTime) return false;
                const eventStart = new Date(e.startTime);
                return isSameDay(eventStart, day) && 
                       eventStart.getHours() === hour;
              });
              
              return (
                <div
                  key={day.toISOString()}
                  className="p-0.5 border-r last:border-r-0 cursor-pointer hover:bg-muted/50 transition-colors relative"
                  onClick={() => onTimeClick(hourStart)}
                  data-testid={`calendar-hour-${format(day, 'yyyy-MM-dd')}-${hour}`}
                >
                  {hourEvents.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onClick={() => onEventClick(event)}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function DayView({ 
  currentDate, 
  events, 
  onTimeClick, 
  onEventClick 
}: { 
  currentDate: Date; 
  events: CalendarEvent[]; 
  onTimeClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayEvents = events.filter(e => 
    e.startTime && isSameDay(new Date(e.startTime), currentDate)
  );
  
  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="p-4 border-b sticky top-0 bg-background z-10">
        <div className="text-xl font-semibold">{format(currentDate, 'EEEE, MMMM d, yyyy')}</div>
        <div className="text-sm text-muted-foreground mt-1">
          {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
        </div>
      </div>
      <div className="flex-1">
        {hours.map((hour) => {
          const hourStart = setMinutes(setHours(currentDate, hour), 0);
          const hourEvents = dayEvents.filter(e => {
            if (!e.startTime) return false;
            const eventStart = new Date(e.startTime);
            return eventStart.getHours() === hour;
          });
          
          return (
            <div key={hour} className="flex border-b min-h-[70px]">
              <div className="w-20 p-2 text-sm text-muted-foreground text-right border-r flex-shrink-0">
                {format(setHours(new Date(), hour), 'h:mm a')}
              </div>
              <div
                className="flex-1 p-1 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onTimeClick(hourStart)}
                data-testid={`calendar-day-hour-${hour}`}
              >
                <div className="space-y-1">
                  {hourEvents.map((event) => {
                    const eventColor = event.colorCode || EVENT_TYPES.find(t => t.value === event.eventType)?.defaultColor || '#3b82f6';
                    return (
                      <div
                        key={event.id}
                        className="p-2 rounded cursor-pointer"
                        style={{ backgroundColor: eventColor }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        data-testid={`calendar-event-detail-${event.id}`}
                      >
                        <div className="text-white font-medium">{event.title}</div>
                        {event.startTime && event.endTime && (
                          <div className="text-white/80 text-sm">
                            {format(new Date(event.startTime), 'h:mm a')} - {format(new Date(event.endTime), 'h:mm a')}
                          </div>
                        )}
                        {event.location && (
                          <div className="text-white/80 text-sm flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CRMCalendar() {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    eventType: 'appointment',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endDate: format(new Date(), 'yyyy-MM-dd'),
    endTime: '10:00',
    isAllDay: false,
    location: '',
    color: '#3b82f6',
    assignedTo: '',
    notes: '',
    reminderMinutes: 15,
  });
  
  const { startDate, endDate } = useMemo(() => {
    if (view === 'month') {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      return {
        startDate: startOfWeek(monthStart),
        endDate: endOfWeek(monthEnd)
      };
    } else if (view === 'week') {
      return {
        startDate: startOfWeek(currentDate),
        endDate: endOfWeek(currentDate)
      };
    } else {
      return {
        startDate: startOfDay(currentDate),
        endDate: endOfDay(currentDate)
      };
    }
  }, [currentDate, view]);
  
  const { data: events = [], isLoading } = useQuery<CalendarEvent[]>({
    queryKey: ['/api/calendar/events', startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const response = await fetch(`/api/calendar/events?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
      if (!response.ok) throw new Error('Failed to fetch events');
      return response.json();
    },
  });
  
  const createEventMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/calendar/events', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendar/events'] });
      setShowEventModal(false);
      resetForm();
      toast({ title: "Event created successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to create event", variant: "destructive" });
    }
  });
  
  const updateEventMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiRequest('PATCH', `/api/calendar/events/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendar/events'] });
      setShowEventModal(false);
      setSelectedEvent(null);
      resetForm();
      toast({ title: "Event updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to update event", variant: "destructive" });
    }
  });
  
  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/calendar/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendar/events'] });
      setShowEventModal(false);
      setSelectedEvent(null);
      toast({ title: "Event deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to delete event", variant: "destructive" });
    }
  });
  
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      eventType: 'appointment',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      startTime: '09:00',
      endDate: format(new Date(), 'yyyy-MM-dd'),
      endTime: '10:00',
      isAllDay: false,
      location: '',
      color: '#3b82f6',
      assignedTo: '',
      notes: '',
      reminderMinutes: 15,
    });
  };
  
  const openNewEventModal = (date?: Date) => {
    resetForm();
    if (date) {
      setFormData(prev => ({
        ...prev,
        startDate: format(date, 'yyyy-MM-dd'),
        endDate: format(date, 'yyyy-MM-dd'),
        startTime: format(date, 'HH:mm'),
        endTime: format(addDays(date, 0).setHours(date.getHours() + 1), 'HH:mm'),
      }));
    }
    setSelectedEvent(null);
    setShowEventModal(true);
  };
  
  const openEditEventModal = (event: CalendarEvent) => {
    setSelectedEvent(event);
    const eventStart = event.startTime ? new Date(event.startTime) : new Date();
    const eventEnd = event.endTime ? new Date(event.endTime) : new Date();
    
    setFormData({
      title: event.title,
      description: event.description || '',
      eventType: event.eventType,
      startDate: format(eventStart, 'yyyy-MM-dd'),
      startTime: format(eventStart, 'HH:mm'),
      endDate: format(eventEnd, 'yyyy-MM-dd'),
      endTime: format(eventEnd, 'HH:mm'),
      isAllDay: event.allDay || false,
      location: event.location || '',
      color: event.colorCode || '#3b82f6',
      assignedTo: event.assignedTo || '',
      notes: event.notes || '',
      reminderMinutes: 15,
    });
    setShowEventModal(true);
  };
  
  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast({ title: "Please enter a title", variant: "destructive" });
      return;
    }
    
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
    
    const eventData = {
      title: formData.title,
      description: formData.description || null,
      eventType: formData.eventType,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      isAllDay: formData.isAllDay,
      location: formData.location || null,
      color: formData.color,
      assignedTo: formData.assignedTo || null,
      notes: formData.notes || null,
      reminders: formData.reminderMinutes ? [{
        reminderTime: new Date(startDateTime.getTime() - formData.reminderMinutes * 60000).toISOString(),
        reminderType: 'notification',
        reminderMinutes: formData.reminderMinutes,
      }] : [],
    };
    
    if (selectedEvent) {
      updateEventMutation.mutate({ id: selectedEvent.id, data: eventData });
    } else {
      createEventMutation.mutate(eventData);
    }
  };
  
  const navigatePrevious = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };
  
  const navigateNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const getHeaderTitle = () => {
    if (view === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else if (view === 'week') {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
    } else {
      return format(currentDate, 'MMMM d, yyyy');
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0 pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <CardTitle>CRM Calendar</CardTitle>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToToday}
              data-testid="button-calendar-today"
            >
              Today
            </Button>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={navigatePrevious}
                data-testid="button-calendar-prev"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="min-w-[180px] text-center font-medium">
                {getHeaderTitle()}
              </span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={navigateNext}
                data-testid="button-calendar-next"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            <Tabs value={view} onValueChange={(v) => setView(v as any)}>
              <TabsList>
                <TabsTrigger value="month" data-testid="button-view-month">Month</TabsTrigger>
                <TabsTrigger value="week" data-testid="button-view-week">Week</TabsTrigger>
                <TabsTrigger value="day" data-testid="button-view-day">Day</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button onClick={() => openNewEventModal()} data-testid="button-new-event">
              <Plus className="w-4 h-4 mr-1" />
              New Event
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-muted-foreground">Loading calendar...</div>
          </div>
        ) : (
          <div className="h-full border rounded-md overflow-hidden">
            {view === 'month' && (
              <MonthView
                currentDate={currentDate}
                events={events}
                onDateClick={openNewEventModal}
                onEventClick={openEditEventModal}
              />
            )}
            {view === 'week' && (
              <WeekView
                currentDate={currentDate}
                events={events}
                onTimeClick={openNewEventModal}
                onEventClick={openEditEventModal}
              />
            )}
            {view === 'day' && (
              <DayView
                currentDate={currentDate}
                events={events}
                onTimeClick={openNewEventModal}
                onEventClick={openEditEventModal}
              />
            )}
          </div>
        )}
      </CardContent>
      
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? 'Edit Event' : 'New Event'}
            </DialogTitle>
            <DialogDescription>
              {selectedEvent ? 'Update the event details below.' : 'Fill in the details for your new event.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Event title"
                data-testid="input-event-title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type</Label>
              <Select 
                value={formData.eventType} 
                onValueChange={(v) => {
                  const type = EVENT_TYPES.find(t => t.value === v);
                  setFormData(prev => ({ 
                    ...prev, 
                    eventType: v,
                    color: type?.defaultColor || prev.color
                  }));
                }}
              >
                <SelectTrigger data-testid="select-event-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: type.defaultColor }} 
                        />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                id="allDay"
                checked={formData.isAllDay}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAllDay: checked }))}
              />
              <Label htmlFor="allDay">All day event</Label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  data-testid="input-start-date"
                />
              </div>
              {!formData.isAllDay && (
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    data-testid="input-start-time"
                  />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  data-testid="input-end-date"
                />
              </div>
              {!formData.isAllDay && (
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    data-testid="input-end-time"
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Event location"
                data-testid="input-location"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.color === color ? 'border-foreground scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    data-testid={`button-color-${color}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reminder">Reminder</Label>
              <Select 
                value={formData.reminderMinutes?.toString() || 'none'} 
                onValueChange={(v) => setFormData(prev => ({ 
                  ...prev, 
                  reminderMinutes: v === 'none' ? null : parseInt(v)
                }))}
              >
                <SelectTrigger data-testid="select-reminder">
                  <SelectValue placeholder="Set reminder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No reminder</SelectItem>
                  {REMINDER_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Event description"
                rows={3}
                data-testid="input-description"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes"
                rows={2}
                data-testid="input-notes"
              />
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            {selectedEvent && (
              <Button
                variant="destructive"
                onClick={() => deleteEventMutation.mutate(selectedEvent.id)}
                disabled={deleteEventMutation.isPending}
                data-testid="button-delete-event"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            )}
            <div className="flex-1" />
            <Button
              variant="outline"
              onClick={() => setShowEventModal(false)}
              data-testid="button-cancel-event"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createEventMutation.isPending || updateEventMutation.isPending}
              data-testid="button-save-event"
            >
              <Check className="w-4 h-4 mr-1" />
              {selectedEvent ? 'Update' : 'Create'} Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
