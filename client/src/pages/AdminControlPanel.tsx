import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  School,
  Plus,
  Phone,
  Edit,
  Trash2,
  LogOut,
  Building2,
} from 'lucide-react';
import { CreateSchoolModal } from '@/components/admin/CreateSchoolModal';
import { schoolAPI } from '@/lib/api';
import { School as SchoolType } from '@/types/school';
import { WelcomeBanner } from '@/components/WelcomeBanner';
import { useNavigate } from 'react-router-dom';
import { ProfileCard } from './ProfileCard';
import { toast } from '@/components/ui/sonner';

const AdminControlPanel = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [schoolToEdit, setSchoolToEdit] = useState<SchoolType | null>(null);

  const fetchSchools = async () => {
    try {
      setIsLoading(true);
      const response = await schoolAPI.getSchools();
      setSchools(response.data.data);
      toast('Schools fetched successfully');
    } catch (error) {
      toast.error(error.response.data.message || 'Failed to fetch schools');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleEditSchool = (school: SchoolType) => {
    setSchoolToEdit(school);
    setIsCreateModalOpen(true);
  };

  const handleDeleteSchool = async (schoolId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this school? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      await schoolAPI.deleteSchool(schoolId);
      toast('School deleted successfully');
      fetchSchools();
    } catch (error) {
      if (error && error.status === 404) {
        toast.error('School not found');
      } else {
        toast.error('Failed to delete school');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-primary/10">
                <Building2 className="h-6 w-6 text-purple-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold hero-text">
                  Admin Control Panel
                </h1>
                <p className="text-muted-foreground">
                  Manage your educational institutions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <WelcomeBanner userName={user?.name || 'User'}></WelcomeBanner>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
          <div className="md:col-span-4">
            <ProfileCard user={user!} />
          </div>
          <div className="md:col-span-8">
            {/* Schools Management */}
            <Card className="shadow-elegant border-purple-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <School className="h-5 w-5 text-purple-primary" />
                      Organizations
                    </CardTitle>
                    <CardDescription>
                      Manage and monitor all educational institutions in your
                      network
                    </CardDescription>
                  </div>
                  <Button
                    variant="gradient"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add School
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-primary"></div>
                  </div>
                ) : schools.length === 0 ? (
                  <div className="text-center py-12">
                    <School className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No schools found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start by adding your first educational institution
                    </p>
                    <Button
                      variant="gradient"
                      onClick={() => setIsCreateModalOpen(true)}
                      className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Your First School
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>School Name</TableHead>
                          <TableHead>Principal</TableHead>
                          <TableHead>Contact</TableHead>

                          <TableHead>Address</TableHead>
                          <TableHead>Created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {schools.map((school) => (
                          <TableRow key={school._id}>
                            <TableCell
                              className="cursor-pointer hover:bg-purple-50"
                              onClick={() =>
                                navigate(`/dashboard/${school._id}`)
                              }>
                              <div>
                                <div className="font-medium">{school.name}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {school.principalName}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-sm flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {school.contactNumber}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>{school.address}</TableCell>
                            <TableCell>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(school.createdAt)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-purple-primary"
                                  onClick={() => handleEditSchool(school)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  onClick={() =>
                                    handleDeleteSchool(school._id)
                                  }>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <CreateSchoolModal
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          setIsCreateModalOpen(open);
          if (!open) setSchoolToEdit(null);
        }}
        onSchoolCreated={fetchSchools}
        adminId={user?.id}
        schoolToEdit={schoolToEdit || undefined}
        isEditing={!!schoolToEdit}
      />
    </div>
  );
};

export default AdminControlPanel;
