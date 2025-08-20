import BigCalendar from "@/components/BigCalender";

const TeacherSchedulePage = () => {
  return (
    <div className="p-4">
      <div className="bg-white p-6 rounded-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">My Schedule</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-lamaSky rounded-full"></div>
              <span className="text-sm text-gray-500">Classes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-lamaYellow rounded-full"></div>
              <span className="text-sm text-gray-500">Meetings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-lamaPurple rounded-full"></div>
              <span className="text-sm text-gray-500">Events</span>
            </div>
          </div>
        </div>
        <BigCalendar />
      </div>
    </div>
  );
};

export default TeacherSchedulePage;
