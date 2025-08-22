"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getSchools } from "@/api/school";
import { Settings, LogOut } from "lucide-react";
import { SchoolsSection } from "@/components/SchoolsSection";
import { ProfileCard } from "@/components/common/ProfileCard";
import { WelcomeBanner } from "@/components/common/WelcomeBanner";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data, loading } = useAuth();
  const [schools, setSchools] = useState<any[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadSchools() {
      try {
        const result = await getSchools();
        setSchools(result.schools);
      } catch (error) {
        console.error("API getSchools error:", error);
      } finally {
        setLoadingSchools(false);
      }
    }
    loadSchools();
  }, []);

  const handleAddSchool = () => {
    console.log("Add school clicked");
  };

  const logout = async () => {
    localStorage.removeItem("user"); // clear session
    router.push("/"); // ✅ navigate back
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="text-slate-700 font-medium">
            Loading dashboard...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-sm text-slate-500">
                  Manage your educational institutions
                </p>
              </div>
            </div>

            {/* Profile section */}
            <div className="flex items-center space-x-3">
              <button
                onClick={logout}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 py-8 max-w-7xl mx-auto">
        <WelcomeBanner userName={data?.user.name || "User"} />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            {data?.user && <ProfileCard user={data.user} />}
          </div>

          <div className="lg:col-span-2">
            <SchoolsSection
              schools={schools}
              loadingSchools={loadingSchools}
              onAddSchool={handleAddSchool}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
