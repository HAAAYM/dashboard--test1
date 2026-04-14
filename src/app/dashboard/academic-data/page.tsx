'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  Users, 
  GraduationCap, 
  Building, 
  Database,
  CheckCircle,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Save
} from 'lucide-react';

export default function AcademicDataPage() {
  const [recordType, setRecordType] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [batch, setBatch] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const colleges = [
    { id: 'eng', name: 'College of Engineering' },
    { id: 'med', name: 'College of Medicine' },
    { id: 'sci', name: 'College of Science' },
    { id: 'bus', name: 'College of Business' }
  ];

  const departments = {
    eng: [
      { id: 'cs', name: 'Computer Science' },
      { id: 'ce', name: 'Civil Engineering' },
      { id: 'ee', name: 'Electrical Engineering' }
    ],
    med: [
      { id: 'surgery', name: 'Surgery' },
      { id: 'medicine', name: 'Internal Medicine' },
      { id: 'pediatrics', name: 'Pediatrics' }
    ]
  };

  const specializations = {
    cs: [
      { id: 'ai', name: 'Artificial Intelligence' },
      { id: 'se', name: 'Software Engineering' },
      { id: 'ds', name: 'Data Science' }
    ],
    ce: [
      { id: 'structural', name: 'Structural Engineering' },
      { id: 'transport', name: 'Transportation Engineering' }
    ]
  };

  const mockPreviewData = [
    {
      academicId: '2023001',
      fullName: 'Ahmed Mohammed Ali',
      cardId: '1234567890',
      college: 'College of Engineering',
      specialization: 'Computer Science',
      batch: '2023',
      validationStatus: 'valid'
    },
    {
      academicId: '2023002',
      fullName: 'Fatima Hassan Omar',
      cardId: '0987654321',
      college: 'College of Engineering',
      specialization: 'Computer Science',
      batch: '2023',
      validationStatus: 'missing-field'
    },
    {
      academicId: '2023003',
      fullName: 'Mohammed Khalid Ahmed',
      cardId: '1122334455',
      college: 'College of Engineering',
      specialization: 'Computer Science',
      batch: '2023',
      validationStatus: 'duplicate'
    }
  ];

  const getValidationBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-green-100 text-green-800">Valid</Badge>;
      case 'missing-field':
        return <Badge className="bg-yellow-100 text-yellow-800">Missing Field</Badge>;
      case 'duplicate':
        return <Badge className="bg-red-100 text-red-800">Duplicate</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const getFilteredDepartments = () => {
    return departments[college as keyof typeof departments] || [];
  };

  const getFilteredSpecializations = () => {
    return specializations[department as keyof typeof specializations] || [];
  };

  const filteredData = mockPreviewData.filter(item =>
    item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.academicId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Academic Data</h1>
          <p className="text-muted-foreground">
            Import and organize university data for authentication and academic customization
          </p>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Import File
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Academic Records</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,543</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Imports</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Processing now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student Records</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10,234</div>
            <p className="text-xs text-muted-foreground">+1.8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doctor Records</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,309</div>
            <p className="text-xs text-muted-foreground">+0.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Import Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Import Settings</CardTitle>
          <CardDescription>
            Configure the academic context for your data import
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Record Type</label>
              <Select value={recordType} onValueChange={setRecordType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="students">Students</SelectItem>
                  <SelectItem value="doctors">Doctors</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">College</label>
              <Select value={college} onValueChange={setCollege}>
                <SelectTrigger>
                  <SelectValue placeholder="Select college" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select 
                value={department} 
                onValueChange={setDepartment}
                disabled={!college}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {getFilteredDepartments().map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Specialization</label>
              <Select 
                value={specialization} 
                onValueChange={setSpecialization}
                disabled={!department}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  {getFilteredSpecializations().map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Batch Number</label>
              <Input 
                value={batch} 
                onChange={(e) => setBatch(e.target.value)}
                placeholder="e.g., 2023"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Program Duration</label>
              <Input value="4 years" disabled />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Expected Graduation</label>
              <Input value="2027" disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>
            Upload your academic data file. Minimum required fields: Academic ID, Card ID, Full Name
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-xs text-gray-500">
                Supported formats: .csv, .xlsx, .xls
              </p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <Button asChild variant="outline">
                <label htmlFor="file-upload" className="cursor-pointer">
                  Choose File
                </label>
              </Button>
            </div>
          </div>

          {selectedFile && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">{selectedFile.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Column Mapping */}
      <Card>
        <CardHeader>
          <CardTitle>Column Mapping</CardTitle>
          <CardDescription>
            Map your file columns to the required academic fields
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Academic ID *</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="column1">Column A: Student ID</SelectItem>
                  <SelectItem value="column2">Column B: Academic ID</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Card ID *</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="column3">Column C: Card Number</SelectItem>
                  <SelectItem value="column4">Column D: ID Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name *</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="column5">Column E: Name</SelectItem>
                  <SelectItem value="column6">Column F: Full Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Level</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="column7">Column G: Level</SelectItem>
                  <SelectItem value="column8">Column H: Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Semester</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="column9">Column I: Semester</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Group</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="column10">Column J: Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Preview Table */}
      <Card>
        <CardHeader>
          <CardTitle>Data Preview</CardTitle>
          <CardDescription>
            Review and validate your imported data before finalizing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Academic ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Full Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Card ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      College
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specialization
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{item.academicId}</td>
                      <td className="px-4 py-3 text-sm">{item.fullName}</td>
                      <td className="px-4 py-3 text-sm">{item.cardId}</td>
                      <td className="px-4 py-3 text-sm">{item.college}</td>
                      <td className="px-4 py-3 text-sm">{item.specialization}</td>
                      <td className="px-4 py-3 text-sm">{item.batch}</td>
                      <td className="px-4 py-3 text-sm">
                        {getValidationBadge(item.validationStatus)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Import Summary</CardTitle>
          <CardDescription>
            Review the final summary before completing the import process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold">150</div>
              <p className="text-sm text-gray-600">Total Rows</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">142</div>
              <p className="text-sm text-gray-600">Valid Records</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">5</div>
              <p className="text-sm text-gray-600">Missing Fields</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">3</div>
              <p className="text-sm text-gray-600">Duplicates</p>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Record Type:</span>
              <span>{recordType || 'Not selected'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">College:</span>
              <span>{colleges.find(c => c.id === college)?.name || 'Not selected'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Department:</span>
              <span>{getFilteredDepartments().find(d => d.id === department)?.name || 'Not selected'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Specialization:</span>
              <span>{getFilteredSpecializations().find(s => s.id === specialization)?.name || 'Not selected'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Batch:</span>
              <span>{batch || 'Not selected'}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="gap-2">
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Import Records
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
