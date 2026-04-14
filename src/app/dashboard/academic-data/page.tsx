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
import { db } from '@/lib/firebase/client-config';
import { collection, addDoc, doc, setDoc, getDocs, query, where, Timestamp, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useEffect } from 'react';

export default function AcademicDataPage() {
  const { t } = useTranslation();
  const [recordType, setRecordType] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [batch, setBatch] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Enhanced mock data
  const colleges = [
    { id: 'eng', name: t('academicData.colleges.eng'), programDuration: 4 },
    { id: 'med', name: t('academicData.colleges.med'), programDuration: 6 },
    { id: 'sci', name: t('academicData.colleges.sci'), programDuration: 4 },
    { id: 'bus', name: t('academicData.colleges.bus'), programDuration: 4 }
  ];

  const departments = {
    eng: [
      { id: 'cs', name: t('academicData.departments.cs'), collegeId: 'eng' },
      { id: 'ce', name: t('academicData.departments.ce'), collegeId: 'eng' },
      { id: 'ee', name: t('academicData.departments.ee'), collegeId: 'eng' }
    ],
    med: [
      { id: 'surgery', name: t('academicData.departments.surgery'), collegeId: 'med' },
      { id: 'medicine', name: t('academicData.departments.medicine'), collegeId: 'med' },
      { id: 'pediatrics', name: t('academicData.departments.pediatrics'), collegeId: 'med' }
    ],
    sci: [
      { id: 'physics', name: t('academicData.departments.physics'), collegeId: 'sci' },
      { id: 'chemistry', name: t('academicData.departments.chemistry'), collegeId: 'sci' },
      { id: 'biology', name: t('academicData.departments.biology'), collegeId: 'sci' }
    ],
    bus: [
      { id: 'finance', name: t('academicData.departments.finance'), collegeId: 'bus' },
      { id: 'marketing', name: t('academicData.departments.marketing'), collegeId: 'bus' },
      { id: 'hr', name: t('academicData.departments.hr'), collegeId: 'bus' }
    ]
  };

  const specializations = {
    cs: [
      { id: 'ai', name: t('academicData.specializations.ai'), departmentId: 'cs', duration: 4 },
      { id: 'se', name: t('academicData.specializations.se'), departmentId: 'cs', duration: 4 },
      { id: 'ds', name: t('academicData.specializations.ds'), departmentId: 'cs', duration: 4 }
    ],
    ce: [
      { id: 'structural', name: t('academicData.specializations.structural'), departmentId: 'ce', duration: 4 },
      { id: 'transport', name: t('academicData.specializations.transport'), departmentId: 'ce', duration: 4 }
    ],
    surgery: [
      { id: 'general', name: t('academicData.specializations.generalSurgery'), departmentId: 'surgery', duration: 6 },
      { id: 'cardio', name: t('academicData.specializations.cardioSurgery'), departmentId: 'surgery', duration: 7 }
    ]
  };

  const batches = {
    students: [
      { id: '2020', name: '2020', startYear: 2020, expectedGraduation: 2024 },
      { id: '2021', name: '2021', startYear: 2021, expectedGraduation: 2025 },
      { id: '2022', name: '2022', startYear: 2022, expectedGraduation: 2026 },
      { id: '2023', name: '2023', startYear: 2023, expectedGraduation: 2027 },
      { id: '2024', name: '2024', startYear: 2024, expectedGraduation: 2028 }
    ],
    doctors: [
      { id: '2018', name: '2018', startYear: 2018, expectedGraduation: 2024 },
      { id: '2019', name: '2019', startYear: 2019, expectedGraduation: 2025 },
      { id: '2020', name: '2020', startYear: 2020, expectedGraduation: 2026 }
    ]
  };

  const [mockPreviewData, setMockPreviewData] = useState<any[]>([]);
  
  const generateMockData = () => {
    const firstNames = ['Ahmed', 'Fatima', 'Mohammed', 'Aisha', 'Khalid', 'Nora', 'Omar', 'Mariam'];
    const lastNames = ['Al Hassan', 'Khalid', 'Mohammed', 'Ali', 'Omar', 'Ahmed', 'Saeed'];
    const statuses = ['valid', 'missing-field', 'duplicate'];
    
    const data = [];
    for (let i = 1; i <= 15; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const college = colleges[Math.floor(Math.random() * colleges.length)];
      
      data.push({
        academicId: `${batch || '2023'}${String(i).padStart(3, '0')}`,
        fullName: `${firstName} ${lastName}`,
        cardId: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        college: college.name,
        specialization: college.id === 'eng' ? t('academicData.specializations.cs') : 
                    college.id === 'med' ? t('academicData.specializations.generalSurgery') : 
                    t('academicData.specializations.ai'),
        batch: batch || '2023',
        validationStatus: status
      });
    }
    return data;
  };

  const [fileColumns, setFileColumns] = useState<string[]>([]);
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'draft' | 'processing' | 'completed' | 'failed'>('draft');
  const [currentImportId, setCurrentImportId] = useState<string>('');
  const [fileData, setFileData] = useState<any[]>([]);
  const [specializationsData, setSpecializationsData] = useState<any[]>([]);
  const [isLoadingSpecializations, setIsLoadingSpecializations] = useState(true);
  const [allProcessedRecords, setAllProcessedRecords] = useState<any[]>([]);

  // Fetch specializations from Firestore
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const specializationsQuery = query(
          collection(db, 'specializations'),
          where('isActive', '==', true)
        );
        const snapshot = await getDocs(specializationsQuery);
        const specializations = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSpecializationsData(specializations);
      } catch (error) {
        console.error('Error fetching specializations:', error);
      } finally {
        setIsLoadingSpecializations(false);
      }
    };

    fetchSpecializations();
  }, []);

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

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Read actual file content to extract column headers
      try {
        const fileContent = await readFileContent(file);
        setFileData(fileContent);
        
        // Extract column names from first row (header)
        if (fileContent.length > 0) {
          const columns = Object.keys(fileContent[0]);
          setFileColumns(columns);
          // Initialize preview with empty mappings (will be updated when user selects mappings)
          setMockPreviewData([]);
        }
      } catch (error) {
        console.error('Error reading file:', error);
        // Fallback to mock data
        const mockColumns = ['Column A', 'Column B', 'Column C', 'Column D', 'Column E', 'Column F', 'Column G', 'Column H', 'Column I', 'Column J'];
        setFileColumns(mockColumns);
        setMockPreviewData(generateMockData());
      }
    }
  };

  const readFileContent = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          
          if (lines.length < 2) {
            reject(new Error('File must have at least 2 rows (header + data)'));
            return;
          }
          
          // Detect delimiter by analyzing the first few lines
          const detectDelimiter = (lines: string[]): string => {
            const sampleLines = lines.slice(0, Math.min(3, lines.length));
            const delimiters = [',', ';', '\t'];
            const delimiterCounts: Record<string, number> = { ',': 0, ';': 0, '\t': 0 };
            
            for (const line of sampleLines) {
              // Count delimiters outside quotes
              let inQuotes = false;
              for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                  inQuotes = !inQuotes;
                } else if (!inQuotes && delimiters.includes(char)) {
                  delimiterCounts[char]++;
                }
              }
            }
            
            // Find the delimiter with the highest count
            let maxCount = 0;
            let detectedDelimiter = ','; // Default to comma
            
            for (const [delimiter, count] of Object.entries(delimiterCounts)) {
              if (count > maxCount) {
                maxCount = count;
                detectedDelimiter = delimiter;
              }
            }
            
            return detectedDelimiter;
          };
          
          const delimiter = detectDelimiter(lines);
          
          // Improved CSV parsing to handle quotes, detected delimiter, and Arabic text
          const parseCSVLine = (line: string, delimiter: string): string[] => {
            const result: string[] = [];
            let current = '';
            let inQuotes = false;
            let i = 0;
            
            while (i < line.length) {
              const char = line[i];
              
              if (char === '"') {
                if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
                  // Escaped quote
                  current += '"';
                  i += 2;
                } else {
                  // Toggle quote mode
                  inQuotes = !inQuotes;
                  i++;
                }
              } else if (char === delimiter && !inQuotes) {
                // Field separator
                result.push(current.trim());
                current = '';
                i++;
              } else {
                // Regular character
                current += char;
                i++;
              }
            }
            
            // Add the last field
            result.push(current.trim());
            return result;
          };
          
          // Parse headers
          const headers = parseCSVLine(lines[0], delimiter);
          const data = [];
          
          // Parse data rows
          for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i], delimiter);
            const row: any = {};
            
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });
            
            data.push(row);
          }
          
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file, 'UTF-8'); // Explicitly set encoding for Arabic text
    });
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileColumns([]);
    setMockPreviewData([]);
    setColumnMappings({});
  };

  const handleCollegeChange = (value: string) => {
    setCollege(value);
    setDepartment('');
    setSpecialization('');
  };

  const handleDepartmentChange = (value: string) => {
    setDepartment(value);
    setSpecialization('');
  };

  const handleColumnMapping = (field: string, column: string) => {
    setColumnMappings(prev => ({ ...prev, [field]: column }));
    // Update preview data when mapping changes
    if (fileData.length > 0) {
      updatePreviewData({ ...columnMappings, [field]: column });
    }
  };

  const updatePreviewData = (mappings: Record<string, string>) => {
    // Process all file data for statistics
    const allRecords = fileData.map((row, index) => {
      const record: any = {
        id: index + 1,
        academicId: row[mappings.academicId] || '',
        fullName: row[mappings.fullName] || '',
        cardId: row[mappings.cardId] || '',
        college: colleges.find(c => c.id === college)?.name || '',
        specialization: specializationsData.find(s => s.id === specialization)?.name || '',
        batch: batch || '2023'
      };

      // Validate required fields
      if (!record.academicId || !record.cardId || !record.fullName) {
        record.validationStatus = 'missing-field';
      } else {
        record.validationStatus = 'valid';
      }

      return record;
    });

    // Store all processed records for statistics
    setAllProcessedRecords(allRecords);
    
    // Show only first 15 for preview display
    const previewRecords = allRecords.slice(0, 15);
    setMockPreviewData(previewRecords);
  };

  const getFilteredDepartments = () => {
    return departments[college as keyof typeof departments] || [];
  };

  const getFilteredSpecializations = () => {
    const filtered = specializationsData.filter(spec => {
      return spec.collegeId === college && (!department || spec.departmentId === department);
    });
    return filtered;
  };

  const getSpecializationData = () => {
    return specializationsData.find(spec => spec.id === specialization);
  };

  const getProgramDuration = () => {
    if (!specialization) return '4';
    const spec = getSpecializationData();
    return spec?.durationYears?.toString() || '4';
  };

  const getStartAcademicYear = () => {
    if (!batch || !specialization) return '2024/2025';
    const spec = getSpecializationData();
    const firstBatchStartYear = spec?.firstBatchStartYear || 2022;
    const batchNumber = parseInt(batch);
    const startYear = firstBatchStartYear + (batchNumber - 1);
    return `${startYear}/${startYear + 1}`;
  };

  const getExpectedGraduation = () => {
    if (!batch || !specialization) return '2030/2031';
    const spec = getSpecializationData();
    const firstBatchStartYear = spec?.firstBatchStartYear || 2022;
    const batchNumber = parseInt(batch);
    const duration = spec?.durationYears || 4;
    const startYear = firstBatchStartYear + (batchNumber - 1);
    const graduationYear = startYear + duration;
    return `${graduationYear}/${graduationYear + 1}`;
  };

  const getFilteredBatches = () => {
    return batches[recordType as keyof typeof batches] || [];
  };

  const processFileData = () => {
    // Use the already processed all records for statistics
    return allProcessedRecords;
  };

  const handleImportRecords = async () => {
    if (!selectedFile || !recordType || !college || !batch) {
      alert(t('academicData.importSummary.missingRequiredFields'));
      return;
    }

    // Check required column mappings
    const requiredMappings = ['academicId', 'cardId', 'fullName'];
    const missingMappings = requiredMappings.filter(field => !columnMappings[field]);
    
    if (missingMappings.length > 0) {
      alert(t('academicData.importSummary.missingColumnMappings'));
      return;
    }

    setIsImporting(true);
    setImportStatus('processing');

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      // Create import batch record
      const specData = getSpecializationData();
      const collegeData = colleges.find(c => c.id === college);
      
      const importData = {
        fileName: selectedFile.name,
        recordType,
        college: collegeData?.name || '',
        specializationId: specialization,
        specializationName: specData?.name || '',
        batchNumber: batch,
        totalRows: fileData.length,
        validRows: 0,
        missingRows: 0,
        duplicateRows: 0,
        status: 'processing',
        uploadedByUid: currentUser?.uid || null,
        uploadedAt: Timestamp.now(),
        errorMessage: null
      };

      const importDoc = await addDoc(collection(db, 'academic_imports'), importData);
      setCurrentImportId(importDoc.id);

      // Process and validate records
      const processedRecords = await processFileData();
      
      // Check for duplicates
      const { validRecords, duplicates, missingFields } = await checkDuplicates(processedRecords);

      // Update import record with results
      await setDoc(doc(db, 'academic_imports', importDoc.id), {
        validRows: validRecords.length,
        duplicateRows: duplicates.length,
        missingRows: missingFields.length,
        status: 'completed',
        uploadedAt: Timestamp.now()
      }, { merge: true });

      // Save valid records to academic_records
      for (const record of validRecords) {
        await addDoc(collection(db, 'academic_records'), {
          recordType,
          academicId: record.academicId,
          cardIdHash: record.cardId, // TODO: Replace with proper hashing implementation
          fullName: record.fullName,
          college: collegeData?.name || '',
          specializationId: specialization,
          specializationName: specData?.name || '',
          batchNumber: batch,
          startAcademicYear: getStartAcademicYear(),
          expectedGraduationAcademicYear: getExpectedGraduation(),
          programDurationYears: parseInt(getProgramDuration()),
          sourceImportId: importDoc.id,
          claimedByUid: null,
          isActive: true,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }

      // Update preview data with processed results
      setMockPreviewData([...validRecords, ...duplicates, ...missingFields].slice(0, 15));
      setImportStatus('completed');
      
      alert(t('academicData.importSummary.importSuccess', { 
        valid: validRecords.length, 
        total: processedRecords.length 
      }));

    } catch (error) {
      console.error('Import error:', error);
      setImportStatus('failed');
      
      // Update import record with error
      if (currentImportId) {
        await setDoc(doc(db, 'academic_imports', currentImportId), {
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
          uploadedAt: Timestamp.now()
        }, { merge: true });
      }
      
      alert(t('academicData.importSummary.importError'));
    } finally {
      setIsImporting(false);
    }
  };

  const checkDuplicates = async (records: any[]) => {
    const validRecords = [];
    const duplicates = [];
    const missingFields = [];
    
    // Get existing academic IDs from Firestore
    const existingRecordsQuery = query(
      collection(db, 'academic_records'),
      where('recordType', '==', recordType),
      where('academicId', 'in', records.map(r => r.academicId).filter(Boolean))
    );
    
    const existingRecordsSnapshot = await getDocs(existingRecordsQuery);
    const existingIds = new Set(existingRecordsSnapshot.docs.map(doc => doc.data().academicId));
    
    for (const record of records) {
      if (record.validationStatus === 'missing-field') {
        missingFields.push(record);
      } else if (existingIds.has(record.academicId)) {
        record.validationStatus = 'duplicate';
        duplicates.push(record);
      } else {
        validRecords.push(record);
      }
    }
    
    return { validRecords, duplicates, missingFields };
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
              <Select value={college} onValueChange={handleCollegeChange}>
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
                onValueChange={handleDepartmentChange}
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
              <Input value={getProgramDuration() + ' ' + t('academicData.importSettings.years')} disabled />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('academicData.importSettings.expectedGraduation')}</label>
              <Input value={getExpectedGraduation()} disabled />
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
              <Select value={columnMappings.academicId || ''} onValueChange={(value) => handleColumnMapping('academicId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('academicData.columnMapping.selectColumn')} />
                </SelectTrigger>
                <SelectContent>
                  {fileColumns.map((col, index) => (
                    <SelectItem key={col} value={col}>
                      {col}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('academicData.columnMapping.cardId')} *</label>
              <Select value={columnMappings.cardId || ''} onValueChange={(value) => handleColumnMapping('cardId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('academicData.columnMapping.selectColumn')} />
                </SelectTrigger>
                <SelectContent>
                  {fileColumns.map((col, index) => (
                    <SelectItem key={col} value={col}>
                      {col}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('academicData.columnMapping.fullName')} *</label>
              <Select value={columnMappings.fullName || ''} onValueChange={(value) => handleColumnMapping('fullName', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('academicData.columnMapping.selectColumn')} />
                </SelectTrigger>
                <SelectContent>
                  {fileColumns.map((col, index) => (
                    <SelectItem key={col} value={col}>
                      {col}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('academicData.columnMapping.level')}</label>
              <Select value={columnMappings.level || ''} onValueChange={(value) => handleColumnMapping('level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('academicData.columnMapping.selectColumn')} />
                </SelectTrigger>
                <SelectContent>
                  {fileColumns.map((col, index) => (
                    <SelectItem key={col} value={col}>
                      {col}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('academicData.columnMapping.semester')}</label>
              <Select value={columnMappings.semester || ''} onValueChange={(value) => handleColumnMapping('semester', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('academicData.columnMapping.selectColumn')} />
                </SelectTrigger>
                <SelectContent>
                  {fileColumns.map((col, index) => (
                    <SelectItem key={col} value={col}>
                      {col}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('academicData.columnMapping.group')}</label>
              <Select value={columnMappings.group || ''} onValueChange={(value) => handleColumnMapping('group', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('academicData.columnMapping.selectColumn')} />
                </SelectTrigger>
                <SelectContent>
                  {fileColumns.map((col, index) => (
                    <SelectItem key={col} value={col}>
                      {col}
                    </SelectItem>
                  ))}
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
          {allProcessedRecords.length > 0 && (
            <div className="mb-4 p-3 bg-muted/30 border border-muted/200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Showing {mockPreviewData.length} of {allProcessedRecords.length} parsed rows
                </span>
                {allProcessedRecords.length > 15 && (
                  <Button variant="ghost" size="sm" className="text-xs">
                    Show more
                  </Button>
                )}
              </div>
            </div>
          )}
          
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
              <div className="text-2xl font-bold text-foreground">{mockPreviewData.length}</div>
              <p className="text-sm text-muted-foreground">{t('academicData.importSummary.totalRows')}</p>
            </div>
            <div className="text-center p-4 bg-card border-border rounded-lg">
              <div className="text-2xl font-bold text-green-400">
                {mockPreviewData.filter(item => item.validationStatus === 'valid').length}
              </div>
              <p className="text-sm text-muted-foreground">{t('academicData.importSummary.validRecords')}</p>
            </div>
            <div className="text-center p-4 bg-card border-border rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">
                {mockPreviewData.filter(item => item.validationStatus === 'missing-field').length}
              </div>
              <p className="text-sm text-muted-foreground">{t('academicData.importSummary.missingFields')}</p>
            </div>
            <div className="text-center p-4 bg-card border-border rounded-lg">
              <div className="text-2xl font-bold text-red-400">
                {mockPreviewData.filter(item => item.validationStatus === 'duplicate').length}
              </div>
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
            <Button 
              className="gap-2" 
              onClick={handleImportRecords}
              disabled={isImporting || !selectedFile || !recordType || !college || !batch}
            >
              {t('dir') === 'rtl' ? (
                <>
                  {isImporting ? t('academicData.importSummary.importing') : t('academicData.importSummary.importRecords')}
                  {isImporting ? (
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </>
              ) : (
                <>
                  {isImporting ? (
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {isImporting ? t('academicData.importSummary.importing') : t('academicData.importSummary.importRecords')}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
