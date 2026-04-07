'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, Filter, FileText, User, Shield, Settings, Calendar } from 'lucide-react';

export default function AuditLogsPage() {
  const auditLogs = [
    {
      id: '1',
      admin: 'Super Admin',
      action: 'User Management',
      target: 'User Alice Johnson',
      details: 'Changed role from Viewer to Moderator',
      timestamp: '2024-04-01 14:30:22',
      ip: '192.168.1.1',
      severity: 'medium',
    },
    {
      id: '2',
      admin: 'Dr. John Doe',
      action: 'Content Moderation',
      target: 'Post #1234',
      details: 'Hidden post due to policy violation',
      timestamp: '2024-04-01 14:25:15',
      ip: '192.168.1.2',
      severity: 'high',
    },
    {
      id: '3',
      admin: 'Jane Smith',
      action: 'Verification',
      target: 'Verification Request #567',
      details: 'Approved student verification',
      timestamp: '2024-04-01 14:20:08',
      ip: '192.168.1.3',
      severity: 'low',
    },
    {
      id: '4',
      admin: 'Super Admin',
      action: 'System Settings',
      target: 'AI Bot Configuration',
      details: 'Updated response style to Professional',
      timestamp: '2024-04-01 14:15:45',
      ip: '192.168.1.1',
      severity: 'medium',
    },
    {
      id: '5',
      admin: 'Dr. John Doe',
      action: 'Group Management',
      target: 'Group "Study Group - Advanced Algorithms"',
      details: 'Changed privacy from Public to Private',
      timestamp: '2024-04-01 14:10:30',
      ip: '192.168.1.2',
      severity: 'medium',
    },
    {
      id: '6',
      admin: 'Jane Smith',
      action: 'Report Resolution',
      target: 'Report #890',
      details: 'Resolved harassment report - User suspended',
      timestamp: '2024-04-01 14:05:12',
      ip: '192.168.1.3',
      severity: 'high',
    },
    {
      id: '7',
      admin: 'Super Admin',
      action: 'Library Management',
      target: 'File "Algorithm Textbook.pdf"',
      details: 'Deleted file due to copyright violation',
      timestamp: '2024-04-01 14:00:55',
      ip: '192.168.1.1',
      severity: 'high',
    },
    {
      id: '8',
      admin: 'Dr. John Doe',
      action: 'User Authentication',
      target: 'User Bob Wilson',
      details: 'Reset user password',
      timestamp: '2024-04-01 13:55:40',
      ip: '192.168.1.2',
      severity: 'low',
    },
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-600 text-white">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'User Management':
        return <User className="h-4 w-4" />;
      case 'Content Moderation':
        return <FileText className="h-4 w-4" />;
      case 'Verification':
        return <Shield className="h-4 w-4" />;
      case 'System Settings':
        return <Settings className="h-4 w-4" />;
      case 'Group Management':
        return <User className="h-4 w-4" />;
      case 'Report Resolution':
        return <FileText className="h-4 w-4" />;
      case 'Library Management':
        return <FileText className="h-4 w-4" />;
      case 'User Authentication':
        return <Shield className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground">
            Track and monitor all administrative actions and system changes
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Severity</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">23</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Admins</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Changes</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Audit Logs</CardTitle>
              <CardDescription>
                Detailed log of all administrative actions
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search audit logs..."
                  className="pl-8 w-[250px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{log.timestamp}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {log.admin.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span>{log.admin}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <span>{log.action}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <span className="truncate">{log.target}</span>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <span className="truncate text-sm text-muted-foreground">{log.details}</span>
                  </TableCell>
                  <TableCell>
                    {getSeverityBadge(log.severity)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {log.ip}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
