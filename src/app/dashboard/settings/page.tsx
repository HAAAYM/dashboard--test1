'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings, User, Shield, Bell, Database, Palette, Globe, Key, ChevronRight, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function SettingsPage() {
  const { t } = useTranslation();
  const [expandedTabs, setExpandedTabs] = useState<string[]>(['general']);
  
  const toggleTab = (tabId: string) => {
    setExpandedTabs(prev => 
      prev.includes(tabId) 
        ? prev.filter(id => id !== tabId)
        : [...prev, tabId]
    );
  };

  const settingsTabs = [
    {
      id: 'general',
      title: t('settings.generalSettings'),
      icon: Settings,
      description: t('settings.generalSettingsDescription')
    },
    {
      id: 'security',
      title: t('settings.securitySettings'),
      icon: Shield,
      description: t('settings.securitySettingsDescription')
    },
    {
      id: 'notifications',
      title: t('settings.notificationSettings'),
      icon: Bell,
      description: t('settings.notificationSettingsDescription')
    },
    {
      id: 'appearance',
      title: 'Appearance Settings',
      icon: Palette,
      description: 'Customize the look and feel of the admin panel'
    },
    {
      id: 'api',
      title: 'API Settings',
      icon: Key,
      description: 'Configure API access and integration settings'
    },
    {
      id: 'backup',
      title: 'Backup Settings',
      icon: Database,
      description: 'Configure automated backups and data retention'
    }
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('settings.title')}</h1>
        <p className="text-muted-foreground">
          {t('settings.general')}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {settingsTabs.map((tab) => {
          const Icon = tab.icon;
          const isExpanded = expandedTabs.includes(tab.id);
          
          return (
            <Card key={tab.id} className="overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <div 
                className="flex items-center justify-between p-6 cursor-pointer bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 transition-colors"
                onClick={() => toggleTab(tab.id)}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-bold text-lg">{tab.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{tab.description}</p>
                  </div>
                  <div className="p-3 bg-primary text-primary-foreground rounded-lg">
                    <Icon className="h-6 w-6" />
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
                  {tab.id === 'general' && (
                    <>
                      {/* Platform Settings */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-xl text-primary border-b border-primary/20 pb-2">
                          Platform Configuration
                        </h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">{t('settings.fields.platformName')}</label>
                            <Input defaultValue="Edu Mate" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">{t('settings.fields.adminEmail')}</label>
                            <Input defaultValue="admin@edumate.com" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">{t('settings.fields.timezone')}</label>
                            <Select defaultValue="utc">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="utc">{t('settings.options.timezones.utc')}</SelectItem>
                                <SelectItem value="est">{t('settings.options.timezones.est')}</SelectItem>
                                <SelectItem value="pst">{t('settings.options.timezones.pst')}</SelectItem>
                                <SelectItem value="gmt">{t('settings.options.timezones.gmt')}</SelectItem>
                                <SelectItem value="cst">{t('settings.options.timezones.cst')}</SelectItem>
                                <SelectItem value="mst">{t('settings.options.timezones.mst')}</SelectItem>
                                <SelectItem value="ist">{t('settings.options.timezones.ist')}</SelectItem>
                                <SelectItem value="jst">{t('settings.options.timezones.jst')}</SelectItem>
                                <SelectItem value="aest">{t('settings.options.timezones.aest')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">{t('settings.fields.defaultLanguage')}</label>
                            <Select defaultValue="en">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ar">{t('settings.options.languages.arabic')}</SelectItem>
                                <SelectItem value="en">{t('settings.options.languages.english')}</SelectItem>
                                <SelectItem value="es">{t('settings.options.languages.spanish')}</SelectItem>
                                <SelectItem value="fr">{t('settings.options.languages.french')}</SelectItem>
                                <SelectItem value="de">{t('settings.options.languages.german')}</SelectItem>
                                <SelectItem value="zh">{t('settings.options.languages.chinese')}</SelectItem>
                                <SelectItem value="hi">{t('settings.options.languages.hindi')}</SelectItem>
                                <SelectItem value="pt">{t('settings.options.languages.portuguese')}</SelectItem>
                                <SelectItem value="ru">{t('settings.options.languages.russian')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* System Settings */}
                      <div className="space-y-4 pt-6 border-t border-primary/20">
                        <h4 className="font-bold text-xl text-primary border-b border-primary/20 pb-2">
                          System Configuration
                        </h4>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t('settings.fields.platformDescription')}</label>
                          <Textarea
                            defaultValue="Professional educational platform for university students and faculty."
                            rows={3}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="text-sm font-medium">{t('settings.switches.maintenanceMode')}</div>
                            <p className="text-xs text-muted-foreground">
                              {t('settings.descriptions.maintenanceMode')}
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </>
                  )}

                  {tab.id === 'security' && (
                    <>
                      {/* System Security */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-xl text-primary border-b border-primary/20 pb-2">
                          System Security
                        </h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">{t('settings.fields.sessionTimeout')}</label>
                            <Input type="number" defaultValue="30" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">{t('settings.fields.maxLoginAttempts')}</label>
                            <Input type="number" defaultValue="5" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">{t('settings.fields.passwordMinLength')}</label>
                            <Input type="number" defaultValue="8" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">{t('settings.fields.passwordExpiry')}</label>
                            <Input type="number" defaultValue="90" />
                          </div>
                        </div>
                      </div>

                      {/* Security Features */}
                      <div className="space-y-4 pt-6 border-t border-primary/20">
                        <h4 className="font-bold text-xl text-primary border-b border-primary/20 pb-2">
                          Security Features
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="text-sm font-medium">{t('settings.switches.twoFactorAuth')}</div>
                              <p className="text-xs text-muted-foreground">
                                {t('settings.descriptions.twoFactorAuth')}
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="text-sm font-medium">{t('settings.switches.emailVerification')}</div>
                              <p className="text-xs text-muted-foreground">
                                {t('settings.descriptions.emailVerification')}
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="text-sm font-medium">{t('settings.switches.ipWhitelist')}</div>
                              <p className="text-xs text-muted-foreground">
                                {t('settings.descriptions.ipWhitelist')}
                              </p>
                            </div>
                            <Switch />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {tab.id === 'notifications' && (
                    <>
                      {/* System Notifications */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-xl text-primary border-b border-primary/20 pb-2">
                          System Notifications
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="text-sm font-medium">{t('settings.switches.newUserRegistration')}</div>
                              <p className="text-xs text-muted-foreground">
                                {t('settings.descriptions.newUserRegistration')}
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="text-sm font-medium">{t('settings.switches.verificationRequests')}</div>
                              <p className="text-xs text-muted-foreground">
                                {t('settings.descriptions.verificationRequests')}
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="text-sm font-medium">{t('settings.switches.contentReports')}</div>
                              <p className="text-xs text-muted-foreground">
                                {t('settings.descriptions.contentReports')}
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="text-sm font-medium">{t('settings.switches.systemAlerts')}</div>
                              <p className="text-xs text-muted-foreground">
                                {t('settings.descriptions.systemAlerts')}
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="text-sm font-medium">{t('settings.switches.dailySummary')}</div>
                              <p className="text-xs text-muted-foreground">
                                {t('settings.descriptions.dailySummary')}
                              </p>
                            </div>
                            <Switch />
                          </div>
                        </div>
                      </div>

                      {/* Notification Email */}
                      <div className="space-y-4 pt-6 border-t border-primary/20">
                        <h4 className="font-bold text-xl text-primary border-b border-primary/20 pb-2">
                          Notification Email
                        </h4>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t('settings.fields.notificationEmail')}</label>
                          <Input defaultValue="admin@edumate.com" />
                        </div>
                      </div>
                    </>
                  )}

                  {tab.id === 'appearance' && (
                    <>
                      {/* Theme Settings */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-xl text-primary border-b border-primary/20 pb-2">
                          Theme Configuration
                        </h4>
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
                                <SelectItem value="auto">Auto (Day/Night)</SelectItem>
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
                                <SelectItem value="red">Red</SelectItem>
                                <SelectItem value="orange">Orange</SelectItem>
                                <SelectItem value="pink">Pink</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Font Size</label>
                            <Select defaultValue="medium">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small">Small</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="large">Large</SelectItem>
                                <SelectItem value="extra-large">Extra Large</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Border Radius</label>
                            <Select defaultValue="medium">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="small">Small</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="large">Large</SelectItem>
                                <SelectItem value="extra-large">Extra Large</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Advanced Settings */}
                      <div className="space-y-4 pt-6 border-t border-primary/20">
                        <h4 className="font-bold text-xl text-primary border-b border-primary/20 pb-2">
                          Advanced Settings
                        </h4>
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
                      </div>
                    </>
                  )}

                  {tab.id === 'api' && (
                    <>
                      {/* API Configuration */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-xl text-primary border-b border-primary/20 pb-2">
                          API Configuration
                        </h4>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">API Rate Limit (requests/minute)</label>
                          <Input type="number" defaultValue="1000" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Webhook URL</label>
                          <Input placeholder="https://your-app.com/webhook" />
                        </div>
                      </div>

                      {/* API Features */}
                      <div className="space-y-4 pt-6 border-t border-primary/20">
                        <h4 className="font-bold text-xl text-primary border-b border-primary/20 pb-2">
                          API Features
                        </h4>
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
                      </div>
                    </>
                  )}

                  {tab.id === 'backup' && (
                    <>
                      {/* Backup Configuration */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-xl text-primary border-b border-primary/20 pb-2">
                          Backup Configuration
                        </h4>
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
                      </div>

                      {/* Backup Actions */}
                      <div className="space-y-4 pt-6 border-t border-primary/20">
                        <h4 className="font-bold text-xl text-primary border-b border-primary/20 pb-2">
                          Backup Actions
                        </h4>
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
                      </div>
                    </>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          {t('settings.save')}
        </Button>
      </div>
    </div>
  );
}
