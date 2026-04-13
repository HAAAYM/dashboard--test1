'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Settings, MessageSquare, Shield, Zap, Brain, Volume2 } from 'lucide-react';
import { AIProvider, useAI } from '@/features/ai-control/ai-provider';
import { AIStatus, ResponseStyle, AISettings } from '@/features/ai-control/ai-types';

function AIControlContent() {
  const { settings, loading, error, updateSettings } = useAI();
  const [isSaving, setIsSaving] = useState(false);

  const handleStatusToggle = async () => {
    if (!settings) return;
    setIsSaving(true);
    await updateSettings({ 
      status: settings.status === 'active' ? 'disabled' : 'active' 
    });
    setIsSaving(false);
  };

  const handleStyleChange = async (newStyle: ResponseStyle) => {
    if (!settings) return;
    setIsSaving(true);
    await updateSettings({ responseStyle: newStyle });
    setIsSaving(false);
  };

  const handleFieldChange = async (field: keyof AISettings, value: any) => {
    if (!settings) return;
    setIsSaving(true);
    await updateSettings({ [field]: value });
    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center"> 
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading AI settings...</p>
        </div>
      </div>
    );
  }

  if (error || !settings) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-destructive mb-2">
              Failed to Load AI Settings
            </h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Bot Control</h1>
          <p className="text-muted-foreground">
            Configure and manage the AI assistant behavior and responses
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Advanced Settings
          </Button>
        </div>
      </div>

      {/* AI Status Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Bot Status
          </CardTitle>
          <CardDescription>
            Current operational status and basic configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">AI Assistant</span>
                <Badge 
                  variant="default" 
                  className={settings.status === 'active' ? 'bg-green-600' : 'bg-red-600'}
                >
                  {settings.status === 'active' ? 'Active' : 'Disabled'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                AI bot is {settings.status === 'active' ? 'currently responding to user queries' : 'currently disabled'}
              </p>
            </div>
            <Switch 
              checked={settings.status === 'active'} 
              onCheckedChange={handleStatusToggle}
              disabled={isSaving}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Response Style</label>
              <Select 
                value={settings.responseStyle} 
                onValueChange={(value: ResponseStyle) => handleStyleChange(value)}
                disabled={isSaving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="strict">Strict</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Response Delay (ms)</label>
              <Input 
                type="number" 
                value={isNaN(settings.responseDelayMs) ? 1000 : settings.responseDelayMs}
                onChange={(e) => handleFieldChange('responseDelayMs', parseInt(e.target.value) || 0)}
                min="0" 
                max="10000"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max Response Length</label>
              <Input 
                type="number" 
                value={isNaN(settings.maxResponseLength) ? 500 : settings.maxResponseLength}
                onChange={(e) => handleFieldChange('maxResponseLength', parseInt(e.target.value) || 1)}
                min="1" 
                max="10000"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Confidence Threshold</label>
              <Input 
                type="number" 
                value={isNaN(settings.confidenceThreshold) ? 0.7 : settings.confidenceThreshold}
                onChange={(e) => handleFieldChange('confidenceThreshold', parseFloat(e.target.value) || 0)}
                min="0" 
                max="1" 
                step="0.1"
                disabled={isSaving}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topics Management */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Allowed Topics
            </CardTitle>
            <CardDescription>
              Topics the AI bot is allowed to discuss
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {settings.allowedTopics.map((topic) => (
                <Badge key={topic} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {topic}
                </Badge>
              ))}
              <Button variant="outline" size="sm" disabled>
                + Add Topic
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              The AI will only respond to questions related to these topics
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Blocked Topics
            </CardTitle>
            <CardDescription>
              Topics the AI bot will not discuss
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {settings.blockedTopics.map((topic) => (
                <Badge key={topic} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  {topic}
                </Badge>
              ))}
              <Button variant="outline" size="sm" disabled>
                + Add Topic
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              The AI will decline to discuss these topics and redirect users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Interactions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground">-0.3s from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Rate</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalations</CardTitle>
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">-15% from last week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AIControlPage() {
  return (
    <AIProvider>
      <AIControlContent />
    </AIProvider>
  );
}
