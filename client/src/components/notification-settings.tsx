import { Bell, BellOff, Mail, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNotifications } from '@/hooks/use-notifications';
import { useState } from 'react';

interface NotificationSettingsProps {
  userId?: string;
}

export function NotificationSettings({ userId }: NotificationSettingsProps) {
  const {
    permission,
    isSubscribed,
    isLoading,
    enableNotifications,
    disableNotifications,
    isSupported
  } = useNotifications(userId);

  const [emailReminders, setEmailReminders] = useState(true);

  const handlePushToggle = async () => {
    if (isSubscribed) {
      await disableNotifications();
    } else {
      await enableNotifications();
    }
  };

  const getPermissionBadge = () => {
    if (!isSupported) {
      return <Badge variant="secondary">Not Supported</Badge>;
    }
    switch (permission) {
      case 'granted':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Enabled</Badge>;
      case 'denied':
        return <Badge variant="destructive">Blocked</Badge>;
      case 'default':
        return <Badge variant="secondary">Not Set</Badge>;
      default:
        return <Badge variant="secondary">Loading...</Badge>;
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="w-5 h-5 text-accent" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Control how you receive appointment reminders
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Mail className="w-4 h-4 text-accent" />
            </div>
            <div>
              <Label className="text-sm font-medium">Email Reminders</Label>
              <p className="text-xs text-muted-foreground">
                Receive email notifications 24h and 1h before appointments
              </p>
            </div>
          </div>
          <Switch
            checked={emailReminders}
            onCheckedChange={setEmailReminders}
            data-testid="switch-email-reminders"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              {isSubscribed ? (
                <Bell className="w-4 h-4 text-accent" />
              ) : (
                <BellOff className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Browser Notifications</Label>
                {getPermissionBadge()}
              </div>
              <p className="text-xs text-muted-foreground">
                Get instant push notifications for upcoming appointments
              </p>
            </div>
          </div>
          {isSupported ? (
            permission === 'denied' ? (
              <Button
                size="sm"
                variant="outline"
                disabled
                data-testid="button-push-blocked"
              >
                Blocked
              </Button>
            ) : (
              <Switch
                checked={isSubscribed}
                onCheckedChange={handlePushToggle}
                disabled={isLoading}
                data-testid="switch-push-notifications"
              />
            )
          ) : (
            <Badge variant="secondary">Not Available</Badge>
          )}
        </div>

        {permission === 'denied' && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
            <div className="text-xs text-destructive">
              <p className="font-medium">Notifications Blocked</p>
              <p>To enable push notifications, please update your browser settings to allow notifications from this site.</p>
            </div>
          </div>
        )}

        {!isSupported && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-white/5">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium">Browser Not Supported</p>
              <p>Push notifications are not supported in your current browser. Email reminders will still work.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
