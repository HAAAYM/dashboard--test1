'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Activity, 
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Settings,
  Shield,
  Database,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
  status: 'success' | 'failed' | 'pending';
  ip: string;
  userAgent?: string;
}

const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    timestamp: '2024-01-15 14:30:22',
    user: 'John Doe',
    action: 'User Created',
    target: 'Alice Brown',
    details: 'New user account created with moderator role',
    severity: 'medium',
    status: 'success',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  {
    id: '2',
    timestamp: '2024-01-15 14:25:15',
    user: 'Jane Smith',
    action: 'Permission Modified',
    target: 'System Settings',
    details: 'Updated dashboard access permissions for moderators',
    severity: 'high',
    status: 'success',
    ip: '192.168.1.101'
  },
  {
    id: '3',
    timestamp: '2024-01-15 14:20:08',
    user: 'System',
    action: 'Login Attempt Failed',
    target: 'admin@edumate.com',
    details: 'Multiple failed login attempts detected',
    severity: 'high',
    status: 'failed',
    ip: '192.168.1.102'
  },
  {
    id: '4',
    timestamp: '2024-01-15 14:15:33',
    user: 'Bob Johnson',
    action: 'Role Changed',
    target: 'Charlie Wilson',
    details: 'Changed user role from user to moderator',
    severity: 'medium',
    status: 'success',
    ip: '192.168.1.103'
  },
  {
    id: '5',
    timestamp: '2024-01-15 14:10:12',
    user: 'Alice Brown',
    action: 'Settings Updated',
    target: 'Email Configuration',
    details: 'Modified SMTP settings for notifications',
    severity: 'low',
    status: 'success',
    ip: '192.168.1.104'
  },
  {
    id: '6',
    timestamp: '2024-01-15 14:05:45',
    user: 'System',
    action: 'Backup Completed',
    target: 'Database',
    details: 'Automated daily backup completed successfully',
    severity: 'low',
    status: 'success',
    ip: 'localhost'
  },
  {
    id: '7',
    timestamp: '2024-01-15 14:00:18',
    user: 'John Doe',
    action: 'User Deleted',
    target: 'David Lee',
    details: 'User account deleted due to inactivity',
    severity: 'high',
    status: 'success',
    ip: '192.168.1.100'
  },
  {
    id: '8',
    timestamp: '2024-01-15 13:55:30',
    user: 'Jane Smith',
    action: 'Password Reset',
    target: 'eve@edumate.com',
    details: 'Password reset request processed',
    severity: 'medium',
    status: 'pending',
    ip: '192.168.1.101'
  }
];

const actionTypes = [
  { value: 'all', label: 'All Actions' },
  { value: 'user_created', label: 'User Created' },
  { value: 'user_deleted', label: 'User Deleted' },
  { value: 'permission_modified', label: 'Permission Modified' },
  { value: 'role_changed', label: 'Role Changed' },
  { value: 'settings_updated', label: 'Settings Updated' },
  { value: 'login_attempt', label: 'Login Attempt' }
];

const severityLevels = [
  { value: 'all', label: 'All Severities' },
  { value: 'low', label: 'Low', color: 'bg-green-600' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-600' },
  { value: 'high', label: 'High', color: 'bg-red-600' }
];

const statusTypes = [
  { value: 'all', label: 'All Statuses' },
  { value: 'success', label: 'Success', color: 'bg-green-600' },
  { value: 'failed', label: 'Failed', color: 'bg-red-600' },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-600' }
];

export function ActivityLog() {
  const [logs, setLogs] = useState(mockActivityLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action.toLowerCase().includes(actionFilter.replace('_', ' '));
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesAction && matchesSeverity && matchesStatus;
  });

  // Get severity info
  const getSeverityInfo = (severity: string) => {
    return severityLevels.find(s => s.value === severity) || severityLevels[0];
  };

  // Get status info
  const getStatusInfo = (status: string) => {
    return statusTypes.find(s => s.value === status) || statusTypes[0];
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  // Get action icon
  const getActionIcon = (action: string) => {
    if (action.includes('User')) return <User className="h-4 w-4" />;
    if (action.includes('Permission') || action.includes('Role')) return <Shield className="h-4 w-4" />;
    if (action.includes('Settings')) return <Settings className="h-4 w-4" />;
    if (action.includes('Login')) return <Activity className="h-4 w-4" />;
    if (action.includes('Backup')) return <Database className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  // Export logs
  const exportLogs = () => {
    const csv = [
      ['Timestamp', 'User', 'Action', 'Target', 'Details', 'Severity', 'Status', 'IP'],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.user,
        log.action,
        log.target,
        log.details,
        log.severity,
        log.status,
        log.ip
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'activity-logs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Activity Log</h2>
        <p className="text-muted-foreground">
          Monitor and track all administrative actions and system events
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{logs.length}</p>
                <p className="text-xs text-muted-foreground">Total Activities</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {logs.filter(l => l.status === 'success').length}
                </p>
                <p className="text-xs text-muted-foreground">Successful</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">
                  {logs.filter(l => l.status === 'failed').length}
                </p>
                <p className="text-xs text-muted-foreground">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">
                  {logs.filter(l => l.severity === 'high').length}
                </p>
                <p className="text-xs text-muted-foreground">High Severity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Activity Log Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activity Logs
              </CardTitle>
              <CardDescription>
                Real-time monitoring of system activities and user actions
              </CardDescription>
            </div>
            <Button onClick={exportLogs} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                {actionTypes.map(action => (
                  <SelectItem key={action.value} value={action.value}>
                    {action.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                {severityLevels.map(severity => (
                  <SelectItem key={severity.value} value={severity.value}>
                    {severity.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusTypes.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Activity Logs Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => {
                  const severityInfo = getSeverityInfo(log.severity);
                  const statusInfo = getStatusInfo(log.status);
                  
                  return (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{log.timestamp}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{log.user}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          <span>{log.action}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{log.target}</TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {log.details}
                      </TableCell>
                      <TableCell>
                        <Badge className={severityInfo.color}>
                          {severityInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          <Badge variant="outline" className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{log.ip}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
