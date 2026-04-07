'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, User, Shield, Bell, Database, Palette, Globe, Key } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Configure system settings and administrative preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Basic system configuration and platform settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform Name</label>
                  <Input defaultValue="Edu Mate" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Admin Email</label>
                  <Input defaultValue="admin@edumate.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Timezone</label>
                  <Select defaultValue="utc">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">EST</SelectItem>
                      <SelectItem value="pst">PST</SelectItem>
                      <SelectItem value="gmt">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Language</label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Platform Description</label>
                <Textarea
                  defaultValue="Professional educational platform for university students and faculty."
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Maintenance Mode</div>
                  <p className="text-xs text-muted-foreground">
                    Enable to show maintenance page to users
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security policies and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Session Timeout (minutes)</label>
                  <Input type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Login Attempts</label>
                  <Input type="number" defaultValue="5" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password Min Length</label>
                  <Input type="number" defaultValue="8" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password Expiry (days)</label>
                  <Input type="number" defaultValue="90" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Two-Factor Authentication</div>
                    <p className="text-xs text-muted-foreground">
                      Require 2FA for admin accounts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Email Verification</div>
                    <p className="text-xs text-muted-foreground">
                      Require email verification for new users
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">IP Whitelist</div>
                    <p className="text-xs text-muted-foreground">
                      Restrict admin access to specific IPs
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure email and in-app notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">New User Registration</div>
                    <p className="text-xs text-muted-foreground">
                      Notify admins when new users register
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Verification Requests</div>
                    <p className="text-xs text-muted-foreground">
                      Notify when users submit verification requests
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Content Reports</div>
                    <p className="text-xs text-muted-foreground">
                      Notify when content is reported
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">System Alerts</div>
                    <p className="text-xs text-muted-foreground">
                      Critical system notifications
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Daily Summary</div>
                    <p className="text-xs text-muted-foreground">
                      Daily activity summary reports
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notification Email</label>
                <Input defaultValue="notifications@edumate.com" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance Settings
              </CardTitle>
              <CardDescription>
                Customize the look and feel of the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Theme</label>
                  <Select defaultValue="dark">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Accent Color</label>
                  <Select defaultValue="gold">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Custom CSS</label>
                <Textarea
                  placeholder="Add custom CSS rules here..."
                  rows={6}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Compact Mode</div>
                  <p className="text-xs text-muted-foreground">
                    Reduce spacing for more content density
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Settings
              </CardTitle>
              <CardDescription>
                Configure API access and integration settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">API Rate Limit (requests/minute)</label>
                <Input type="number" defaultValue="1000" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Webhook URL</label>
                <Input placeholder="https://your-app.com/webhook" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Enable Public API</div>
                    <p className="text-xs text-muted-foreground">
                      Allow external API access
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">API Documentation</div>
                    <p className="text-xs text-muted-foreground">
                      Publish API documentation
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Backup Settings
              </CardTitle>
              <CardDescription>
                Configure automated backups and data retention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Backup Frequency</label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Retention Period (days)</label>
                  <Input type="number" defaultValue="30" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Backup Location</label>
                <Select defaultValue="local">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Storage</SelectItem>
                    <SelectItem value="cloud">Cloud Storage</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Auto Backup</div>
                  <p className="text-xs text-muted-foreground">
                    Enable automated backups
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Backup Now</Button>
                <Button variant="outline">Restore Backup</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
