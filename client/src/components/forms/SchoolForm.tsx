"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";

const schema = z.object({
  schoolId: z.string().min(1, { message: "School ID is required!" }),
  name: z.string().min(3, { message: "School name must be at least 3 characters long!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  principal: z.string().min(1, { message: "Principal name is required!" }),
  logo: z.instanceof(File, { message: "Logo is required!" }),
});

type Inputs = z.infer<typeof schema>;

const SchoolForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new school" : "Update school"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="School ID"
          name="schoolId"
          defaultValue={data?.schoolId}
          register={register}
          error={errors.schoolId}
        />
        <InputField
          label="School Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors.email}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        <InputField
          label="Principal"
          name="principal"
          defaultValue={data?.principal}
          register={register}
          error={errors.principal}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="logo"
          >
            <Image src="/upload.png" alt="" width={28} height={28} />
            <span>Upload Logo</span>
          </label>
          <input type="file" id="logo" {...register("logo")} className="hidden" />
          {errors.logo?.message && (
            <p className="text-xs text-red-400">{errors.logo.message.toString()}</p>
          )}
        </div>
      </div>

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default SchoolForm;
