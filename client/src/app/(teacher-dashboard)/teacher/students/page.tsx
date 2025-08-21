"use client";

import { useEffect, useState } from "react";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { role } from "@/lib/data";

// ✅ Match backend DTO like StudentListPage
type Student = {
  id: string; // from _id
  name: string;
  rollNumber: string;
  dateOfBirth: string;
  gender: string;
  guardianName: string;
  guardianContact: string;
  address: string;
  isActive: boolean;
};

const columns = [
  { header: "Info", accessor: "info" },
  { header: "Roll Number", accessor: "rollNumber", className: "hidden md:table-cell" },
  { header: "Guardian", accessor: "guardianName", className: "hidden md:table-cell" },
  { header: "Contact", accessor: "guardianContact", className: "hidden lg:table-cell" },
  { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const TeacherStudentsPage = () => {
  const { token } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("http://localhost:4000/student", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch students");

        const data = await res.json();

        // ✅ map backend → Student type
        const mapped: Student[] = data.map((s: any) => ({
          id: s._id,
          name: s.name,
          rollNumber: s.rollNumber,
          dateOfBirth: s.dateOfBirth,
          gender: s.gender,
          guardianName: s.guardianName,
          guardianContact: s.guardianContact,
          address: s.address,
          isActive: s.isActive,
        }));

        setStudents(mapped);
      } catch (err) {
        console.error("❌ Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStudents();
  }, [token]);

  const renderRow = (item: Student) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src="/avatar.png"
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.gender}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.rollNumber}</td>
      <td className="hidden md:table-cell">{item.guardianName}</td>
      <td className="hidden lg:table-cell">{item.guardianContact}</td>
      <td className="hidden lg:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          {/* Bonafide certificate (open in new tab) */}
          <Link href={`/documents/bonafide/${item.id}`} target="_blank">
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-green-500 text-white">
              📝
            </button>
          </Link>

          {/* Student profile/details */}
          <Link href={`/teacher/students/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>

          {/* Only admin can delete */}
          {role === "admin" && <FormModal table="student" type="delete" id={item.id} />}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">My Students</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {/* Teachers can’t create students → keep admin only */}
            {role === "admin" && <FormModal table="student" type="create" />}
          </div>
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <p className="p-4 text-center text-gray-500">Loading students...</p>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={students} />
      )}

      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default TeacherStudentsPage;
