import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Download, Edit, Trash2, FileText, History } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { TableSkeleton } from '@/components/LoadingSkeleton';

// Mock data for demonstration
const mockStudents = [
  {
    id: 1,
    name: "Alice Johnson",
    grade: "10",
    division: "A",
    rollNumber: "10A001",
    email: "alice.johnson@example.com",
    phone: "+1 234-567-8901",
    status: "Active"
  },
  {
    id: 2,
    name: "Bob Smith",
    grade: "10",
    division: "B",
    rollNumber: "10B002",
    email: "bob.smith@example.com",
    phone: "+1 234-567-8902",
    status: "Active"
  },
  {
    id: 3,
    name: "Charlie Brown",
    grade: "9",
    division: "A",
    rollNumber: "9A003",
    email: "charlie.brown@example.com",
    phone: "+1 234-567-8903",
    status: "Inactive"
  }
];

const Students = () => {
  const [students] = useState(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = !selectedGrade || student.grade === selectedGrade;
    const matchesDivision = !selectedDivision || student.division === selectedDivision;
    
    return matchesSearch && matchesGrade && matchesDivision;
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <Suspense fallback={<div className="w-60"><div className="sidebar-gradient h-full animate-pulse" /></div>}>
          <AppSidebar />
        </Suspense>
        
        <main className="flex-1">
          <Suspense fallback={<TableSkeleton />}>
            <div className="p-6">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold hero-text">Students Management</h1>
                <p className="text-muted-foreground mt-2">
                  Manage student records, grades, and information
                </p>
              </div>

              {/* Actions Bar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search students by name or roll number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-purple-primary/30 focus:border-purple-primary"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Grades</SelectItem>
                      <SelectItem value="9">Grade 9</SelectItem>
                      <SelectItem value="10">Grade 10</SelectItem>
                      <SelectItem value="11">Grade 11</SelectItem>
                      <SelectItem value="12">Grade 12</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedDivision} onValueChange={setSelectedDivision}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Division" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Divisions</SelectItem>
                      <SelectItem value="A">Division A</SelectItem>
                      <SelectItem value="B">Division B</SelectItem>
                      <SelectItem value="C">Division C</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="gradient-outline">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </div>

              {/* Add Student and Import Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Button variant="gradient">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
                <Button variant="gradient-outline">
                  <Download className="h-4 w-4 mr-2" />
                  Import CSV
                </Button>
                <Button variant="secondary">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>

              {/* Students Table */}
              <Card className="shadow-elegant border-purple-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Students List</span>
                    <Badge variant="outline" className="bg-purple-primary/10 text-purple-primary border-purple-primary/30">
                      {filteredStudents.length} students
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    View and manage all student records
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Roll Number</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>Division</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.map((student) => (
                          <TableRow key={student.id} className="hover:bg-purple-primary/5">
                            <TableCell className="font-medium">{student.rollNumber}</TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{student.name}</div>
                                <div className="text-sm text-muted-foreground">{student.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>{student.grade}</TableCell>
                            <TableCell>{student.division}</TableCell>
                            <TableCell className="text-sm">{student.phone}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={student.status === 'Active' ? 'default' : 'secondary'}
                                className={student.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                              >
                                {student.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <FileText className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <History className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Suspense>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Students;