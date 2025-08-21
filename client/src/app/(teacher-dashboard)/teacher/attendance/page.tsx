import AttendanceChart from "@/components/AttendanceChart";
import Image from "next/image";

const TeacherAttendancePage = () => {
  // Mock attendance data - in real app this would come from API
  const classAttendance = [
    { class: "1A", present: 18, absent: 2, total: 20 },
    { class: "2B", present: 19, absent: 3, total: 22 },
    { class: "3C", present: 15, absent: 5, total: 20 },
  ];

  const recentAbsences = [
    { name: "John Doe", class: "1A", date: "2025-01-20", reason: "Sick" },
    { name: "Jane Smith", class: "2B", date: "2025-01-20", reason: "Family emergency" },
    { name: "Mike Johnson", class: "1A", date: "2025-01-19", reason: "Doctor appointment" },
  ];

  return (
    <div className="p-4 flex gap-4 flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Attendance Management</h1>
        <div className="flex items-center gap-4">
          <button className="bg-lamaSky text-white px-4 py-2 rounded-md flex items-center gap-2">
            <Image src="/create.png" alt="" width={16} height={16} />
            Take Attendance
          </button>
        </div>
      </div>

      <div className="flex gap-4 flex-col lg:flex-row">
        {/* LEFT - ATTENDANCE CHART */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white p-6 rounded-md h-[500px]">
            <h2 className="text-lg font-semibold mb-4">Attendance Overview</h2>
            <AttendanceChart />
          </div>
        </div>

        {/* RIGHT - CLASS SUMMARY & RECENT */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          {/* CLASS ATTENDANCE SUMMARY */}
          <div className="bg-white p-6 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Todays Attendance</h3>
            <div className="space-y-3">
              {classAttendance.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium">Class {item.class}</span>
                    <span className="text-sm text-gray-500">
                      {item.present}/{item.total} present
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{
                          width: `${(item.present / item.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {Math.round((item.present / item.total) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT ABSENCES */}
          <div className="bg-white p-6 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Recent Absences</h3>
            <div className="space-y-3">
              {recentAbsences.map((absence, index) => (
                <div key={index} className="border-l-4 border-red-400 pl-4 py-2">
                  <div className="flex flex-col">
                    <span className="font-medium">{absence.name}</span>
                    <span className="text-sm text-gray-500">
                      {absence.class} • {absence.date}
                    </span>
                    <span className="text-sm text-red-600">{absence.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-white p-6 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full bg-lamaSkyLight text-lamaSky py-2 px-4 rounded-md flex items-center gap-2 hover:bg-lamaSky hover:text-white transition-colors">
                <Image src="/view.png" alt="" width={16} height={16} />
                View Attendance Reports
              </button>
              <button className="w-full bg-lamaPurpleLight text-lamaPurple py-2 px-4 rounded-md flex items-center gap-2 hover:bg-lamaPurple hover:text-white transition-colors">
                <Image src="/message.png" alt="" width={16} height={16} />
                Notify Parents
              </button>
              <button className="w-full bg-lamaYellowLight text-lamaYellow py-2 px-4 rounded-md flex items-center gap-2 hover:bg-lamaYellow hover:text-white transition-colors">
                <Image src="/setting.png" alt="" width={16} height={16} />
                Attendance Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendancePage;
