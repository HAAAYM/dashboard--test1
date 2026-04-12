'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Settings, 
  Key, 
  Mail, 
  Bell,
  Shield,
  LogOut,
  Edit,
  Activity,
  Lock,
  Smartphone,
  Globe,
  ChevronDown,
  ChevronRight,
  Users
} from 'lucide-react';
import { 
  currentUser, 
  staffTabs, 
  connectedDevices, 
  recentActivity, 
  importantNotifications, 
  recentNotifications 
} from '@/features/profile/profile-mock';

export default function ProfilePage() {
  const [expandedTabs, setExpandedTabs] = useState<string[]>(['overview']);

  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const toggleTab = (tabId: string) => {
    setExpandedTabs(prev => 
      prev.includes(tabId) 
        ? prev.filter(id => id !== tabId)
        : [...prev, tabId]
    );
  };

  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Staff Profile</h1>
        <p className="text-muted-foreground">
          University staff dashboard profile and settings
        </p>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-32 w-32">
                {currentUser.avatar ? (
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                ) : (
                  <AvatarFallback className="text-4xl font-bold bg-primary text-primary-foreground">
                    {getInitials(currentUser.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              {/* Status indicator */}
              <div className={`absolute bottom-2 right-2 h-8 w-8 rounded-full border-4 border-background ${
                currentUser.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
              }`} />
            </div>
            
            {/* Staff Info */}
            <div className="flex-1 text-center md:text-right">
              <CardTitle className="text-2xl">{currentUser.name}</CardTitle>
              <CardDescription className="text-lg font-medium text-foreground mt-2">
                {currentUser.position}
              </CardDescription>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{currentUser.role}</span>
              </div>
              
              {/* Staff Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{currentUser.lastLogin.split(' ')[0]}</div>
                  <div className="text-xs text-muted-foreground">Last Login</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{currentUser.joinedDate.split('-')[0]}</div>
                  <div className="text-xs text-muted-foreground">Joined</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{currentUser.employeeId}</div>
                  <div className="text-xs text-muted-foreground">Employee ID</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">3</div>
                  <div className="text-xs text-muted-foreground">Active Sessions</div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Three Main Tabs with Prominent Borders */}
      <div className="grid gap-4 lg:grid-cols-3">
        {staffTabs.map((tab) => {
          const Icon = tab.icon;
          const isExpanded = expandedTabs.includes(tab.id);
          
          return (
            <Card key={tab.id} className="overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <div 
                className="flex items-center justify-between p-6 cursor-pointer bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 transition-colors"
                onClick={() => toggleTab(tab.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary text-primary-foreground rounded-lg">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{tab.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{tab.description}</p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-6 w-6 text-primary" />
                ) : (
                  <ChevronRight className="h-6 w-6 text-primary" />
                )}
              </div>
              
              {isExpanded && (
                <div className="border-t-2 border-primary/20 p-6 space-y-6 bg-gradient-to-b from-background to-muted/30">
                  {tab.id === 'devices' && (
                    <>
                      {/* Connected Devices */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-xl text-primary border-b border-primary/20 pb-2">
                          Connected Devices
                        </h4>
                        <div className="space-y-3">
                          {connectedDevices.map((device) => (
                            <div key={device.id} className="flex items-center justify-between p-4 bg-background rounded-md border border-primary/20 hover:bg-primary/5 transition-colors">
                              {device.type === 'mobile' ? (
                                <Smartphone className={`h-5 w-5 ${device.isCurrent ? 'text-green-600' : 'text-muted-foreground'}`} />
                              ) : (
                                <Globe className={`h-5 w-5 ${device.isCurrent ? 'text-green-600' : 'text-muted-foreground'}`} />
                              )}
                              <div>
                                <div className="font-semibold">
                                  {device.name}
                                  {device.isCurrent && ' (Current)'}
                                </div>
                                <div className="text-sm text-muted-foreground">Last used: {device.lastUsed}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Device Security */}
                      <div className="space-y-4 pt-6 border-t border-primary/20">
                        <h4 className="font-bold text-xl text-primary border-b border-primary/20 pb-2">
                          Device Security
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 bg-background rounded-md border border-primary/20 hover:bg-primary/5 transition-colors">
                            <div>
                              <div className="font-semibold">Two-Factor Authentication</div>
                              <div className="text-sm text-muted-foreground">Extra security for new devices</div>
                            </div>
                            <Button variant="outline" size="sm" className="border-primary/20 hover:border-primary/40 hover:bg-primary/5">Configure</Button>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-background rounded-md border border-primary/20 hover:bg-primary/5 transition-colors">
                            <div>
                              <div className="font-semibold">Device Management</div>
                              <div className="text-sm text-muted-foreground">Remove unknown devices</div>
                            </div>
                            <Button variant="outline" size="sm" className="border-primary/20 hover:border-primary/40 hover:bg-primary/5">Manage</Button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {tab.id === 'overview' && (
                    <>
                      {/* Staff Information */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-xl text-primary border-b border-primary/20 pb-2">
                          Staff Information
                        </h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Full Name</label>
                            <div className="p-3 bg-background rounded-md border border-primary/20 font-medium">{currentUser.name}</div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">University Email</label>
                            <div className="p-3 bg-background rounded-md border border-primary/20 font-medium">{currentUser.email}</div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Position</label>
                            <div className="p-3 bg-background rounded-md border border-primary/20 font-medium">{currentUser.position}</div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Department</label>
                            <div className="p-3 bg-background rounded-md border border-primary/20 font-medium">{currentUser.department}</div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Employee ID</label>
                            <div className="p-3 bg-background rounded-md border border-primary/20 font-medium">{currentUser.employeeId}</div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Join Date</label>
                            <div className="p-3 bg-background rounded-md border border-primary/20 font-medium">{currentUser.joinedDate}</div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="space-y-4 pt-6 border-t border-primary/20">
                        <h4 className="font-bold text-xl text-primary border-b border-primary/20 pb-2">
                          Recent Activity
                        </h4>
                        <div className="space-y-3">
                          {recentActivity.map((activity) => {
                            const getIcon = (iconName: string) => {
                              switch (iconName) {
                                case 'Activity': return <Activity className="h-5 w-5 text-primary" />;
                                case 'Users': return <Users className="h-5 w-5 text-primary" />;
                                case 'Shield': return <Shield className="h-5 w-5 text-primary" />;
                                default: return <Activity className="h-5 w-5 text-primary" />;
                              }
                            };
                            
                            return (
                              <div key={activity.id} className="flex items-center justify-between p-4 bg-background rounded-md border border-primary/20 hover:bg-primary/5 transition-colors">
                                <div>
                                  <div className="font-semibold">{activity.action}</div>
                                  <div className="text-sm text-muted-foreground">{activity.timestamp}</div>
                                </div>
                                {getIcon(activity.icon)}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {tab.id === 'settings' && (
                    <>
                      {/* Security Settings */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-xl text-primary border-b border-primary/20 pb-2">
                          Security Settings
                        </h4>
                        <div className="space-y-3">
                          <Button variant="outline" className="w-full justify-start border-primary/20 hover:border-primary/40 hover:bg-primary/5">
                            <Key className="h-4 w-4 mr-3 text-primary" />
                            Change Password
                          </Button>
                          <Button variant="outline" className="w-full justify-start border-primary/20 hover:border-primary/40 hover:bg-primary/5">
                            <Mail className="h-4 w-4 mr-3 text-primary" />
                            Change Email
                          </Button>
                          <Button variant="outline" className="w-full justify-start border-primary/20 hover:border-primary/40 hover:bg-primary/5">
                            <Lock className="h-4 w-4 mr-3 text-primary" />
                            Two-Factor Authentication
                          </Button>
                        </div>
                      </div>

                      
                      {/* Important Notifications */}
                      <div className="space-y-4 pt-6 border-t border-primary/20">
                        <h4 className="font-bold text-xl text-primary border-b border-primary/20 pb-2">
                          Important Notifications
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Only critical system notifications will be sent to your mobile app
                        </p>
                        
                        <div className="space-y-3">
                          {importantNotifications.map((notification) => (
                            <div key={notification.id} className="flex items-center justify-between p-4 bg-background rounded-md border border-primary/20 hover:bg-primary/5 transition-colors">
                              <div>
                                <div className="font-semibold">{notification.title}</div>
                                <div className="text-sm text-muted-foreground">{notification.description}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`h-3 w-3 ${notification.status === 'active' ? 'bg-green-500' : 'bg-gray-400'} rounded-full`}></div>
                                <span className={`text-sm ${notification.status === 'active' ? 'text-green-600' : 'text-gray-600'} font-medium capitalize`}>
                                  {notification.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Notifications */}
                      <div className="space-y-4 pt-6 border-t border-primary/20">
                        <h4 className="font-bold text-xl text-primary border-b border-primary/20 pb-2">
                          Recent Notifications
                        </h4>
                        <div className="space-y-3">
                          {recentNotifications.map((notification) => {
                            const getColorClass = (color: string) => {
                              switch (color) {
                                case 'blue': return 'bg-blue-500';
                                case 'yellow': return 'bg-yellow-500';
                                case 'green': return 'bg-green-500';
                                default: return 'bg-gray-500';
                              }
                            };
                            
                            return (
                              <div key={notification.id} className="p-4 bg-background rounded-md border border-primary/20 hover:bg-primary/5 transition-colors">
                                <div className="flex items-start gap-3">
                                  <div className={`h-3 w-3 ${getColorClass(notification.color)} rounded-full mt-2`}></div>
                                  <div className="flex-1">
                                    <div className="font-semibold">{notification.title}</div>
                                    <div className="text-sm text-muted-foreground">{notification.description}</div>
                                    <div className="text-xs text-muted-foreground mt-1">{notification.timestamp}</div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Logout Button */}
      <Card>
        <CardContent className="p-4">
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={() => {
              console.log('Logout');
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout from Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
