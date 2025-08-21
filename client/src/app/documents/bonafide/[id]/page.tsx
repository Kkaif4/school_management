"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useAuth from "@/hooks/useAuth"; // ✅ import hook for token

type Student = {
  _id: string;
  name: string;
  rollNumber: string;
  dateOfBirth: string;
  gender: string;
  guardianName: string;
  guardianContact: string;
  address: string;
};

const BonafidePage = () => {
  const { id } = useParams(); // ✅ get student id from URL
  const { token } = useAuth(); // ✅ get JWT token
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`http://localhost:4000/student/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ send token
          },
        });

        if (!res.ok) throw new Error("Failed to fetch student");

        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error("❌ Error fetching student:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id && token) fetchStudent();
  }, [id, token]);

  if (loading) return <p className="p-4 text-center">Loading...</p>;
  if (!student) return <p className="p-4 text-center">Student not found</p>;

  return (
    <div className="p-10 max-w-3xl mx-auto bg-white shadow-lg rounded-md">
      <h1 className="text-2xl font-bold text-center mb-6">BONAFIDE CERTIFICATE</h1>

      <div className="space-y-4 text-lg">
        <p>
          This is to certify that <strong>{student.name}</strong>, Roll Number{" "}
          <strong>{student.rollNumber}</strong>, is a bonafide student of our
          institution.
        </p>

        <p>
          He/She was born on{" "}
          <strong>{new Date(student.dateOfBirth).toLocaleDateString()}</strong>{" "}
          and resides at <strong>{student.address}</strong>.
        </p>

        <p>
          Parent/Guardian: <strong>{student.guardianName}</strong> (
          {student.guardianContact})
        </p>
      </div>

      <div className="mt-10 flex justify-between">
        <p>Date: {new Date().toLocaleDateString()}</p>
        <p className="font-semibold">Principal’s Signature</p>
      </div>

      {/* Print Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default BonafidePage;
