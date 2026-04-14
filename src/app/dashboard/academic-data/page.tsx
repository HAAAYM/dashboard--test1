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
import { useTranslation } from 'react-i18next';

export default function AcademicDataPage() {
  const { t } = useTranslation();
  const [recordType, setRecordType] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [batch, setBatch] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const colleges = [
    { id: 'eng', name: t('academicData.colleges.eng') },
    { id: 'med', name: t('academicData.colleges.med') },
    { id: 'sci', name: t('academicData.colleges.sci') },
    { id: 'bus', name: t('academicData.colleges.bus') }
  ];

  const departments = {
    eng: [
      { id: 'cs', name: t('academicData.departments.cs') },
      { id: 'ce', name: t('academicData.departments.ce') },
      { id: 'ee', name: t('academicData.departments.ee') }
    ],
    med: [
      { id: 'surgery', name: t('academicData.departments.surgery') },
      { id: 'medicine', name: t('academicData.departments.medicine') },
      { id: 'pediatrics', name: t('academicData.departments.pediatrics') }
    ]
  };

  const specializations = {
    cs: [
      { id: 'ai', name: t('academicData.specializations.ai') },
      { id: 'se', name: t('academicData.specializations.se') },
      { id: 'ds', name: t('academicData.specializations.ds') }
    ],
    ce: [
      { id: 'structural', name: t('academicData.specializations.structural') },
      { id: 'transport', name: t('academicData.specializations.transport') }
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
        return <Badge className="bg-muted/30 text-green-400 border-green-600/30">{t('academicData.status.valid')}</Badge>;
      case 'missing-field':
        return <Badge className="bg-muted/30 text-yellow-400 border-yellow-600/30">{t('academicData.status.missingField')}</Badge>;
      case 'duplicate':
        return <Badge className="bg-muted/30 text-red-400 border-red-600/30">{t('academicData.status.duplicate')}</Badge>;
      default:
        return <Badge className="bg-muted/30 text-muted-foreground border-muted/50">{t('academicData.status.unknown')}</Badge>;
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
          <h1 className="text-2xl font-bold">{t('academicData.title')}</h1>
          <p className="text-muted-foreground">
            {t('academicData.description')}
          </p>
        </div>
        <Button className="gap-2">
          {t('dir') === 'rtl' ? (
            <>
              {t('academicData.importFile')}
              <Upload className="h-4 w-4" />
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              {t('academicData.importFile')}
            </>
          )}
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('academicData.statistics.totalRecords')}</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,543</div>
            <p className="text-xs text-muted-foreground">{t('academicData.statistics.fromLastMonth', { value: '2.1' })}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('academicData.statistics.activeImports')}</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">{t('academicData.statistics.processingNow')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('academicData.statistics.studentRecords')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10,234</div>
            <p className="text-xs text-muted-foreground">{t('academicData.statistics.fromLastMonth', { value: '1.8' })}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('academicData.statistics.doctorRecords')}</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,309</div>
            <p className="text-xs text-muted-foreground">{t('academicData.statistics.fromLastMonth', { value: '0.5' })}</p>
          </CardContent>
        </Card>
      </div>

      {/* Import Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('academicData.importSettings.title')}</CardTitle>
          <CardDescription>
            {t('academicData.importSettings.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('academicData.importSettings.recordType')}</label>
              <Select value={recordType} onValueChange={setRecordType}>
                <SelectTrigger>
                  <SelectValue placeholder={t('academicData.importSettings.selectType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="students">{t('academicData.recordTypes.students')}</SelectItem>
                  <SelectItem value="doctors">{t('academicData.recordTypes.doctors')}</SelectItem>
                  <SelectItem value="staff">{t('academicData.recordTypes.staff')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('academicData.importSettings.college')}</label>
              <Select value={college} onValueChange={setCollege}>
                <SelectTrigger>
                  <SelectValue placeholder={t('academicData.importSettings.selectCollege')} />
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
              <label className="text-sm font-medium">{t('academicData.importSettings.department')}</label>
              <Select 
                value={department} 
                onValueChange={setDepartment}
                disabled={!college}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('academicData.importSettings.selectDepartment')} />
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
              <label className="text-sm font-medium">{t('academicData.importSettings.specialization')}</label>
              <Select 
                value={specialization} 
                onValueChange={setSpecialization}
                disabled={!department}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('academicData.importSettings.selectSpecialization')} />
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
              <label className="text-sm font-medium">{t('academicData.importSettings.batchNumber')}</label>
              <Input 
                value={batch} 
                onChange={(e) => setBatch(e.target.value)}
                placeholder={t('academicData.importSettings.batchPlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('academicData.importSettings.programDuration')}</label>
              <Input value={t('academicData.importSettings.fourYears')} disabled />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('academicData.importSettings.expectedGraduation')}</label>
              <Input value={t('academicData.importSettings.year2027')} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>{t('academicData.fileUpload.title')}</CardTitle>
          <CardDescription>
            {t('academicData.fileUpload.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {t('academicData.fileUpload.dragDropText')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('academicData.fileUpload.supportedFormats')}
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
                  {t('academicData.fileUpload.chooseFile')}
                </label>
              </Button>
            </div>
          </div>

          {selectedFile && (
            <div className="mt-4 p-4 bg-card border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{selectedFile.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({t('academicData.fileUpload.fileSize', { size: (selectedFile.size / 1024 / 1024).toFixed(2) })})
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
          <CardTitle>{t('academicData.columnMapping.title')}</CardTitle>
          <CardDescription>
            {t('academicData.columnMapping.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('academicData.columnMapping.academicId')} *</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={t('academicData.columnMapping.selectColumn')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="column1">{t('academicData.columnMapping.columnA')}: {t('academicData.columnMapping.studentId')}</SelectItem>
                  <SelectItem value="column2">{t('academicData.columnMapping.columnB')}: {t('academicData.columnMapping.academicId')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('academicData.columnMapping.cardId')} *</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={t('academicData.columnMapping.selectColumn')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="column3">{t('academicData.columnMapping.columnC')}: {t('academicData.columnMapping.cardNumber')}</SelectItem>
                  <SelectItem value="column4">{t('academicData.columnMapping.columnD')}: {t('academicData.columnMapping.idCard')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('academicData.columnMapping.fullName')} *</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={t('academicData.columnMapping.selectColumn')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="column5">{t('academicData.columnMapping.columnE')}: {t('academicData.columnMapping.name')}</SelectItem>
                  <SelectItem value="column6">{t('academicData.columnMapping.columnF')}: {t('academicData.columnMapping.fullName')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('academicData.columnMapping.level')}</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={t('academicData.columnMapping.selectColumn')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="column7">{t('academicData.columnMapping.columnG')}: {t('academicData.columnMapping.level')}</SelectItem>
                  <SelectItem value="column8">{t('academicData.columnMapping.columnH')}: {t('academicData.columnMapping.year')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('academicData.columnMapping.semester')}</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={t('academicData.columnMapping.selectColumn')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="column9">{t('academicData.columnMapping.columnI')}: {t('academicData.columnMapping.semester')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('academicData.columnMapping.group')}</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={t('academicData.columnMapping.selectColumn')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="column10">{t('academicData.columnMapping.columnJ')}: {t('academicData.columnMapping.group')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Preview Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('academicData.dataPreview.title')}</CardTitle>
          <CardDescription>
            {t('academicData.dataPreview.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute top-2.5 h-4 w-4 text-muted-foreground ${t('dir') === 'rtl' ? 'right-2' : 'left-2'}`} />
                <Input
                  placeholder={t('academicData.dataPreview.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${t('dir') === 'rtl' ? 'pr-8' : 'pl-8'} bg-background border-border`}
                />
              </div>
            </div>
            <Button variant="outline" className="gap-2 bg-muted/50 border-muted-200 hover:bg-muted/70">
              {t('dir') === 'rtl' ? (
                <>
                  {t('academicData.dataPreview.filter')}
                  <Filter className="h-4 w-4" />
                </>
              ) : (
                <>
                  <Filter className="h-4 w-4" />
                  {t('academicData.dataPreview.filter')}
                </>
              )}
            </Button>
          </div>

          <div className="rounded-md border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className={`px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}>
                      {t('academicData.dataPreview.headers.academicId')}
                    </th>
                    <th className={`px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}>
                      {t('academicData.dataPreview.headers.fullName')}
                    </th>
                    <th className={`px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}>
                      {t('academicData.dataPreview.headers.cardId')}
                    </th>
                    <th className={`px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}>
                      {t('academicData.dataPreview.headers.college')}
                    </th>
                    <th className={`px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}>
                      {t('academicData.dataPreview.headers.specialization')}
                    </th>
                    <th className={`px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}>
                      {t('academicData.dataPreview.headers.batch')}
                    </th>
                    <th className={`px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}>
                      {t('academicData.dataPreview.headers.status')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {filteredData.map((item, index) => (
                    <tr key={index} className="hover:bg-muted/20">
                      <td className={`px-4 py-3 text-sm text-foreground ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}>{item.academicId}</td>
                      <td className={`px-4 py-3 text-sm text-foreground ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}>{item.fullName}</td>
                      <td className={`px-4 py-3 text-sm text-foreground ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}>{item.cardId}</td>
                      <td className={`px-4 py-3 text-sm text-foreground ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}>{item.college}</td>
                      <td className={`px-4 py-3 text-sm text-foreground ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}>{item.specialization}</td>
                      <td className={`px-4 py-3 text-sm text-foreground ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}>{item.batch}</td>
                      <td className={`px-4 py-3 text-sm ${t('dir') === 'rtl' ? 'text-right' : 'text-left'}`}>
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
          <CardTitle>{t('academicData.importSummary.title')}</CardTitle>
          <CardDescription>
            {t('academicData.importSummary.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-card border-border rounded-lg">
              <div className="text-2xl font-bold text-foreground">150</div>
              <p className="text-sm text-muted-foreground">{t('academicData.importSummary.totalRows')}</p>
            </div>
            <div className="text-center p-4 bg-card border-border rounded-lg">
              <div className="text-2xl font-bold text-green-400">142</div>
              <p className="text-sm text-muted-foreground">{t('academicData.importSummary.validRecords')}</p>
            </div>
            <div className="text-center p-4 bg-card border-border rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">5</div>
              <p className="text-sm text-muted-foreground">{t('academicData.importSummary.missingFields')}</p>
            </div>
            <div className="text-center p-4 bg-card border-border rounded-lg">
              <div className="text-2xl font-bold text-red-400">3</div>
              <p className="text-sm text-muted-foreground">{t('academicData.importSummary.duplicates')}</p>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{t('academicData.importSummary.recordType')}:</span>
              <span>{recordType || t('academicData.importSettings.notSelected')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{t('academicData.importSummary.college')}:</span>
              <span>{colleges.find(c => c.id === college)?.name || t('academicData.importSettings.notSelected')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{t('academicData.importSummary.department')}:</span>
              <span>{getFilteredDepartments().find(d => d.id === department)?.name || t('academicData.importSettings.notSelected')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{t('academicData.importSummary.specialization')}:</span>
              <span>{getFilteredSpecializations().find(s => s.id === specialization)?.name || t('academicData.importSettings.notSelected')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{t('academicData.importSummary.batch')}:</span>
              <span>{batch || t('academicData.importSettings.notSelected')}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="gap-2">
              {t('dir') === 'rtl' ? (
                <>
                  {t('academicData.importSummary.saveDraft')}
                  <Save className="h-4 w-4" />
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {t('academicData.importSummary.saveDraft')}
                </>
              )}
            </Button>
            <Button className="gap-2">
              {t('dir') === 'rtl' ? (
                <>
                  {t('academicData.importSummary.importRecords')}
                  <Upload className="h-4 w-4" />
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  {t('academicData.importSummary.importRecords')}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
