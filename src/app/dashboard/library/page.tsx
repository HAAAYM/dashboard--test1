'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, Upload, Trash2, MoreHorizontal, FileText, File, Image, Video } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LibraryPage() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('sidebar.library')}</h1>
          <p className="text-muted-foreground">
            {t('dashboard.libraryDescription')}
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Upload className="h-4 w-4 mr-2" />
          {t('common.uploadFile')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('library.stats.totalFiles')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">{t('common.time.fromLastMonth', { value: '+18%' })}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('library.stats.totalDownloads')}</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">{t('common.time.fromLastMonth', { value: '+32%' })}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('library.stats.storageUsed')}</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1 GB</div>
            <p className="text-xs text-muted-foreground">{t('library.descriptions.storagePercentage')}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('library.stats.categories')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">{t('library.descriptions.activeCategories')}</p>
          </CardContent>
        </Card>
      </div>

      {/* File Categories */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('library.stats.documents')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">{t('library.descriptions.totalFiles')}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('library.stats.images')}</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">{t('library.descriptions.images')}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('library.stats.videos')}</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">{t('library.descriptions.videos')}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('library.stats.other')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">{t('library.descriptions.other')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Files Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('common.allFiles')}</CardTitle>
              <CardDescription>
                {t('library.search.placeholder')}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('library.search.placeholder')}
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
                <TableHead>{t('library.table.headers.file')}</TableHead>
                <TableHead>{t('library.table.headers.category')}</TableHead>
                <TableHead>{t('library.table.headers.size')}</TableHead>
                <TableHead>{t('library.table.headers.uploadedBy')}</TableHead>
                <TableHead>{t('library.table.headers.downloads')}</TableHead>
                <TableHead>{t('library.table.headers.uploaded')}</TableHead>
                <TableHead className="text-right">{t('library.table.headers.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <div className="font-medium">Algorithm Textbook PDF</div>
                      <div className="text-sm text-muted-foreground">Comprehensive guide to algorithms and data structures</div>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="outline" className="text-xs">algorithms</Badge>
                        <Badge variant="outline" className="text-xs">textbook</Badge>
                        <Badge variant="outline" className="text-xs">computer-science</Badge>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">CS Resources</Badge>
                </TableCell>
                <TableCell>15 MB</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs">JD</span>
                    </div>
                    <span>Dr. John Doe</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>156</span>
                  </div>
                </TableCell>
                <TableCell>Jan 15, 2024</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <File className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="font-medium">Study Schedule Template</div>
                      <div className="text-sm text-muted-foreground">Weekly study schedule template for students</div>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="outline" className="text-xs">template</Badge>
                        <Badge variant="outline" className="text-xs">schedule</Badge>
                        <Badge variant="outline" className="text-xs">productivity</Badge>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Templates</Badge>
                </TableCell>
                <TableCell>512 KB</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs">JS</span>
                    </div>
                    <span>Jane Smith</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>89</span>
                  </div>
                </TableCell>
                <TableCell>Feb 1, 2024</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <Image className="h-8 w-8 text-purple-600" />
                    <div>
                      <div className="font-medium">Campus Map</div>
                      <div className="text-sm text-muted-foreground">Interactive campus map with building locations</div>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="outline" className="text-xs">map</Badge>
                        <Badge variant="outline" className="text-xs">campus</Badge>
                        <Badge variant="outline" className="text-xs">navigation</Badge>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">General</Badge>
                </TableCell>
                <TableCell>3.2 MB</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs">AJ</span>
                    </div>
                    <span>Alice Johnson</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>234</span>
                  </div>
                </TableCell>
                <TableCell>Feb 10, 2024</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
