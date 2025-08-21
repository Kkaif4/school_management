"use client";

import useAuth from "@/hooks/useAuth";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormRegister, FieldError } from "react-hook-form";
import { z } from "zod";
import React from "react";

// The Zod schema is now updated to match the Mongoose Student schema.
const studentFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  dateOfBirth: z.coerce.date({
    required_error: "Date of birth is required",
    invalid_type_error: "Invalid date format",
  }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
  }),
  rollNumber: z.string().min(1, { message: "Roll number is required" }),
  // In a real app, these would be populated from an API call
  school: z.string().min(1, { message: "School is required" }),
  class: z.string().min(1, { message: "Class is required" }),
  guardianName: z.string().optional(),
  guardianContact: z.string().optional(),
  address: z.string().min(1, { message: "Address is required" }),
  isActive: z.boolean().default(true),
});

// Infer the TypeScript type from the Zod schema
type StudentFormInputs = z.infer<typeof studentFormSchema>;

// Define the props for the InputField component for type safety
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: keyof StudentFormInputs;
    register: UseFormRegister<StudentFormInputs>;
    error?: FieldError;
}

// Assuming InputField is a reusable component like this:
const InputField: React.FC<InputFieldProps> = ({ label, name, register, error, type = "text", ...props }) => (
  <div className="flex flex-col gap-2 w-full sm:w-[48%]">
    <label htmlFor={name} className="text-sm font-medium text-gray-600">
      {label}
    </label>
    <input
      id={name}
      type={type}
      className="ring-1 ring-gray-300 p-2.5 rounded-lg text-sm focus:ring-blue-500 focus:outline-none transition duration-200"
      {...register(name)}
      {...props}
    />
    {error && (
      <p className="text-xs text-red-500 mt-1">{error.message?.toString()}</p>
    )}
  </div>
);

// Mock data for dropdowns - in a real app, this would come from props or a data fetch
const mockSchools = [
  { id: "60d5f1b3b5a6e3a0b4e8e1a1", name: "Greenwood High" },
  { id: "60d5f1b3b5a6e3a0b4e8e1a2", name: "Oakridge International" },
];

const mockClasses = [
  { id: "60d5f1b3b5a6e3a0b4e8e1b1", name: "Grade 10A" },
  { id: "60d5f1b3b5a6e3a0b4e8e1b2", name: "Grade 10B" },
];

const StudentForm = ({
  type,
  data,
  closeModal, // Add a prop to handle closing the modal
}: {
  type: "create" | "update";
  data?: Partial<StudentFormInputs>;
  closeModal: () => void; // Define the type for the closeModal function
}) => {
      const { token } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormInputs>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      ...data,
      dateOfBirth: data?.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : undefined,
    } as any,
  });

  const onSubmit = handleSubmit(async (formData) => {

  try {
    const response = await fetch("http://localhost:4000/student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ✅ if you use JWT auth, pass token here
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
  ...formData,
  dateOfBirth: new Date(formData.dateOfBirth),  // 👈 ensures correct format
}),
    });

    if (!response.ok) {
      throw new Error("Failed to create student");
    }

    const result = await response.json();
    console.log("Student created:", result);

    // ✅ Close modal after success
    closeModal();
  } catch (error) {
    console.error("Error creating student:", error);
    alert("Failed to create student");
  }
});


  return (
    // The overflow container remains the same
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-4xl max-h-[80vh] overflow-y-auto">
      <form className="flex flex-col gap-8" onSubmit={onSubmit} noValidate>
        {/* FIX: Removed 'sticky' classes from the h1 element to allow it to scroll */}
        <h1 className="text-2xl font-bold text-gray-800 border-b pb-4 bg-white">
          {type === "create" ? "Register New Student" : "Update Student Information"}
        </h1>

        {/* Personal Information Section */}
        <div className="flex flex-col gap-6 px-1">
            <h2 className="text-lg font-semibold text-gray-700">Personal Details</h2>
            <div className="flex justify-between flex-wrap gap-y-6 gap-x-4">
                <InputField
                    label="Full Name"
                    name="name"
                    register={register}
                    error={errors.name}
                    placeholder="e.g., Jane Doe"
                />
                <InputField
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    register={register}
                    error={errors.dateOfBirth}
                />
                <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                    <label htmlFor="gender" className="text-sm font-medium text-gray-600">Gender</label>
                    <select
                        id="gender"
                        className="ring-1 ring-gray-300 p-2.5 rounded-lg text-sm focus:ring-blue-500 focus:outline-none transition duration-200 bg-white"
                        {...register("gender")}
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender.message}</p>}
                </div>
                 <InputField
                    label="Address"
                    name="address"
                    register={register}
                    error={errors.address}
                    placeholder="123 Main St, Anytown"
                />
            </div>
        </div>

        {/* Academic Information Section */}
        <div className="flex flex-col gap-6 px-1">
            <h2 className="text-lg font-semibold text-gray-700">Academic Information</h2>
            <div className="flex justify-between flex-wrap gap-y-6 gap-x-4">
                <InputField
                    label="Roll Number"
                    name="rollNumber"
                    register={register}
                    error={errors.rollNumber}
                    placeholder="e.g., A-101"
                />
                <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                    <label htmlFor="school" className="text-sm font-medium text-gray-600">School</label>
                    <select
                        id="school"
                        className="ring-1 ring-gray-300 p-2.5 rounded-lg text-sm focus:ring-blue-500 focus:outline-none transition duration-200 bg-white"
                        {...register("school")}
                    >
                        <option value="">Select School</option>
                        {mockSchools.map(school => (
                            <option key={school.id} value={school.id}>{school.name}</option>
                        ))}
                    </select>
                    {errors.school && <p className="text-xs text-red-500 mt-1">{errors.school.message}</p>}
                </div>
                <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                    <label htmlFor="class" className="text-sm font-medium text-gray-600">Class</label>
                    <select
                        id="class"
                        className="ring-1 ring-gray-300 p-2.5 rounded-lg text-sm focus:ring-blue-500 focus:outline-none transition duration-200 bg-white"
                        {...register("class")}
                    >
                        <option value="">Select Class</option>
                        {mockClasses.map(cls => (
                            <option key={cls.id} value={cls.id}>{cls.name}</option>
                        ))}
                    </select>
                    {errors.class && <p className="text-xs text-red-500 mt-1">{errors.class.message}</p>}
                </div>
            </div>
        </div>

        {/* Guardian Information Section */}
        <div className="flex flex-col gap-6 px-1">
            <h2 className="text-lg font-semibold text-gray-700">Guardian Details</h2>
            <div className="flex justify-between flex-wrap gap-y-6 gap-x-4">
                <InputField
                    label="Guardian Name (Optional)"
                    name="guardianName"
                    register={register}
                    error={errors.guardianName}
                    placeholder="e.g., John Smith"
                />
                <InputField
                    label="Guardian Contact (Optional)"
                    name="guardianContact"
                    register={register}
                    error={errors.guardianContact}
                    placeholder="e.g., 555-123-4567"
                />
            </div>
        </div>
        
        {/* Status and Submit */}
        {/* FIX: Removed 'sticky' classes from the button container to allow it to scroll */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t bg-white">
          <div className="flex items-center gap-3 w-full mb-4 sm:mb-0">
              <input
                  id="isActive"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  {...register("isActive")}
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Student is Active
              </label>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            <button
              type="button" // Important: type="button" to prevent form submission
              onClick={closeModal}
              className="bg-gray-200 text-gray-800 font-semibold py-2.5 px-6 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 disabled:bg-gray-400"
            >
              {isSubmitting ? "Submitting..." : (type === "create" ? "Create Student" : "Update Student")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
