// app/school/[id]/page.tsx
"use client";

import { Student } from "@/api/students";
import { Teacher } from "@/api/teachers";
import { getSchoolById, School as SchoolType } from "@/api/school";
import { useSchoolStore } from "@/app/context/store";
import { fetchDashboardData } from "@/services/schoolDashboard.service";
import { useEffect, useState, use } from "react";
import { Menu } from "lucide-react";
import Teachers from "./components/Teachers";
import Students from "./components/Students";
import Sidebar from "@/components/Sidebar";
import HomeContent from "@/components/HomeContent";
import { useRouter } from "next/navigation";

export default function School({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [school, setSchool] = useState<SchoolType | null>(null);
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setSchool: setGlobalSchool } = useSchoolStore();

  useEffect(() => {
    async function fetchData() {
      try {
        const { school: schoolData, error: schoolError } = await getSchoolById(
          id
        );
        if (schoolError) throw new Error(schoolError);
        if (!schoolData) throw new Error("School not found");

        setSchool(schoolData);
        setGlobalSchool(schoolData);

        const dashboardData = await fetchDashboardData(id);
        setStudents(dashboardData.students);
        setTeachers(dashboardData.teachers);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, setGlobalSchool]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
    console.log("Logout clicked");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return school ? (
          <HomeContent
            school={school}
            students={students}
            teachers={teachers}
          />
        ) : null;
      case "students":
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <Students
              schoolId={id}
              students={students}
              loading={loading}
              error={error}
            />
          </div>
        );
      case "teachers":
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <Teachers
              schoolId={id}
              teachers={teachers}
              loading={loading}
              error={error}
            />
          </div>
        );
      default:
        return school ? (
          <HomeContent
            school={school}
            students={students}
            teachers={teachers}
          />
        ) : null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-red-200">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm">
          <div className="text-gray-400 text-xl mb-2">🏫</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            School Not Found
          </h2>
          <p className="text-gray-500">
            The requested school could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <div className="flex-1 lg:ml-0 flex flex-col">
        {/* Top bar - Mobile only */}
        <div className="bg-white shadow-sm border-b border-gray-200 lg:hidden flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {school.name}
            </h1>
            <div className="w-6" />
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto w-full">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
