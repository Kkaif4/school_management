import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  UserPlus,
} from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { TableSkeleton } from '@/components/LoadingSkeleton';

// Mock data for demonstration
const mockTeachers = [
  {
    id: 1,
    name: 'Dr. Emily Davis',
    email: 'emily.davis@school.com',
    phone: '+1 234-567-8901',
    subjects: ['Mathematics', 'Physics'],
    classes: ['Grade 10A', 'Grade 11B'],
    status: 'Active',
    joinDate: '2022-08-15',
  },
  {
    id: 2,
    name: 'Mr. John Wilson',
    email: 'john.wilson@school.com',
    phone: '+1 234-567-8902',
    subjects: ['English Literature'],
    classes: ['Grade 9A', 'Grade 10B', 'Grade 11A'],
    status: 'Active',
    joinDate: '2021-06-20',
  },
  {
    id: 3,
    name: 'Ms. Sarah Connor',
    email: 'sarah.connor@school.com',
    phone: '+1 234-567-8903',
    subjects: ['Chemistry', 'Biology'],
    classes: ['Grade 12A', 'Grade 12B'],
    status: 'On Leave',
    joinDate: '2020-03-10',
  },
];

const Teachers = () => {
  const [teachers] = useState(mockTeachers);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subjects.some((subject) =>
        subject.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Only admins should see this page
  if (user?.role !== 'admin') {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-subtle">
          <Suspense
            fallback={
              <div className="w-60">
                <div className="sidebar-gradient h-full animate-pulse" />
              </div>
            }
          >
            <AppSidebar />
          </Suspense>
          <main className="flex-1">
            <Suspense fallback={<TableSkeleton />}>
              <div className="p-6">
                <div className="flex items-center justify-center h-96">
                  <Card className="shadow-elegant border-destructive/20">
                    <CardHeader>
                      <CardTitle className="text-destructive">
                        Access Denied
                      </CardTitle>
                      <CardDescription>
                        You don't have permission to view this page. Only
                        administrators can manage teachers.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </Suspense>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <Suspense
          fallback={
            <div className="w-60">
              <div className="sidebar-gradient h-full animate-pulse" />
            </div>
          }
        >
          <AppSidebar />
        </Suspense>

        <main className="flex-1">
          <Suspense fallback={<TableSkeleton />}>
            <div className="p-6">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold hero-text">
                  Teachers Management
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage teaching staff and their assignments
                </p>
              </div>

              {/* Search and Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search teachers by name, email, or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-purple-primary/30 focus:border-purple-primary"
                  />
                </div>

                <Button variant="gradient">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New Teacher
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="shadow-elegant border-purple-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Teachers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-primary">
                      {teachers.length}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-elegant border-purple-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active Teachers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {teachers.filter((t) => t.status === 'Active').length}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-elegant border-purple-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      On Leave
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {teachers.filter((t) => t.status === 'On Leave').length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Teachers Table */}
              <Card className="shadow-elegant border-purple-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Teaching Staff</span>
                    <Badge
                      variant="outline"
                      className="bg-purple-primary/10 text-purple-primary border-purple-primary/30"
                    >
                      {filteredTeachers.length} teachers
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    View and manage all teaching staff members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Subjects</TableHead>
                          <TableHead>Classes</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Join Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTeachers.map((teacher) => (
                          <TableRow
                            key={teacher.id}
                            className="hover:bg-purple-primary/5"
                          >
                            <TableCell>
                              <div className="font-medium">{teacher.name}</div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="h-3 w-3 text-muted-foreground" />
                                  {teacher.email}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Phone className="h-3 w-3" />
                                  {teacher.phone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {teacher.subjects.map((subject) => (
                                  <Badge
                                    key={subject}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {subject}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {teacher.classes.map((className) => (
                                  <div
                                    key={className}
                                    className="text-sm text-muted-foreground"
                                  >
                                    {className}
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  teacher.status === 'Active'
                                    ? 'default'
                                    : 'secondary'
                                }
                                className={
                                  teacher.status === 'Active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-orange-100 text-orange-800'
                                }
                              >
                                {teacher.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(teacher.joinDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                >
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

export default Teachers;
