'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Group, type GroupSettings } from '../groups-types';
import { User } from '@/types';
import { UserRole } from '@/lib/permissions/roles';
import { groupsService } from '../groups-service';
import { toast } from 'sonner';

interface GroupSettingsProps {
  group: Group;
  currentUser: User | null;
  onSettingsUpdated?: () => void;
}

export function GroupSettings({ group, currentUser, onSettingsUpdated }: GroupSettingsProps) {
  const [settings, setSettings] = useState<GroupSettings>(group.settings);
  const [isSaving, setIsSaving] = useState(false);

  const canManageSettings = currentUser?.role === UserRole.ADMIN || 
                          currentUser?.role === UserRole.SUPER_ADMIN || 
                          currentUser?.id === group.ownerId;

  const handleSaveSettings = async () => {
    if (!canManageSettings) return;

    setIsSaving(true);
    try {
      // Call actual service to update group settings
      const result = await groupsService.updateGroup(
        group.id, 
        { settings }, 
        currentUser?.displayName || 'Unknown'
      );
      
      if (result.success) {
        toast.success('Group settings saved successfully');
        onSettingsUpdated?.();
      } else {
        toast.error(result.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = <K extends keyof GroupSettings>(
    key: K, 
    value: GroupSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            Group Settings
            {!canManageSettings && (
              <Badge variant="secondary" className="text-xs">
                Read-only
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visitor Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Visitor Access</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="visitor-preview">Visitor Preview</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow non-members to preview the group before joining
                  </p>
                </div>
                <Switch
                  id="visitor-preview"
                  checked={settings.visitorPreviewEnabled}
                  onCheckedChange={(checked) => updateSetting('visitorPreviewEnabled', checked)}
                  disabled={!canManageSettings}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="visitor-media">Visitors Can See Media</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow visitors to view uploaded media files
                  </p>
                </div>
                <Switch
                  id="visitor-media"
                  checked={settings.visitorCanSeeMedia}
                  onCheckedChange={(checked) => updateSetting('visitorCanSeeMedia', checked)}
                  disabled={!canManageSettings}
                />
              </div>
            </div>
          </div>

          {/* Join Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Join Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="join-approval">Require Join Approval</Label>
                  <p className="text-sm text-muted-foreground">
                    New members must be approved by moderators
                  </p>
                </div>
                <Switch
                  id="join-approval"
                  checked={settings.requireJoinApproval}
                  onCheckedChange={(checked) => updateSetting('requireJoinApproval', checked)}
                  disabled={!canManageSettings}
                />
              </div>
            </div>
          </div>

          {/* Media Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Media Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="allow-media">Allow Media Uploads</Label>
                  <p className="text-sm text-muted-foreground">
                    Members can upload files and media
                  </p>
                </div>
                <Switch
                  id="allow-media"
                  checked={settings.allowMedia}
                  onCheckedChange={(checked) => updateSetting('allowMedia', checked)}
                  disabled={!canManageSettings}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-size">Max Media Size (MB)</Label>
                <p className="text-sm text-muted-foreground">
                  Maximum file size for uploads
                </p>
                <Input
                  id="max-size"
                  type="number"
                  value={settings.maxMediaSizeMB}
                  onChange={(e) => updateSetting('maxMediaSizeMB', parseInt(e.target.value) || 0)}
                  disabled={!canManageSettings}
                  min="1"
                  max="1000"
                  className="w-32"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          {canManageSettings && (
            <div className="flex justify-end">
              <Button 
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="min-w-32"
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          )}

          {/* Current Settings Display */}
          <div className="mt-8 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-4">Current Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span>Visitor Mode:</span>
                <Badge variant={settings.visitorPreviewEnabled ? 'default' : 'secondary'}>
                  {settings.visitorPreviewEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Visitor Media Access:</span>
                <Badge variant={settings.visitorCanSeeMedia ? 'default' : 'secondary'}>
                  {settings.visitorCanSeeMedia ? 'Allowed' : 'Blocked'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Join Approval:</span>
                <Badge variant={settings.requireJoinApproval ? 'default' : 'secondary'}>
                  {settings.requireJoinApproval ? 'Required' : 'Not Required'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Media Uploads:</span>
                <Badge variant={settings.allowMedia ? 'default' : 'secondary'}>
                  {settings.allowMedia ? 'Allowed' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Max File Size:</span>
                <Badge variant="outline">
                  {settings.maxMediaSizeMB} MB
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
