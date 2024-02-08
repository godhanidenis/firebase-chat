/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FormInputField } from "./core/CustomFormFields";

const AddEditUserModal = () => {
  const [loader, setLoader] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    setValue,
    getValues,
    control,
    clearErrors,
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoader(true);

    const payload = data;
    console.log("payload :", payload);

    setLoader(false);
  };

  const onError = (errors: any) => console.log("Errors Occurred !! :", errors);

  return (
    <>
      <div className="tw-flex tw-justify-start tw-w-full md:tw-ps-10 tw-flex-col tw-gap-10">
        <>
          <div className="tw-flex tw-flex-col tw-gap-2">
            <div className="tw-flex tw-items-center tw-gap-5">
              <span className="tw-text-[16px] tw-font-semibold tw-text-[#000000]">
                Name
              </span>
            </div>
            <FormInputField
              type="text"
              name="name"
              control={control}
              placeholder="Enter Name"
              rules={{
                required: "Name is required",
              }}
            />

            {errors?.name && (
              <p className="tw-text-[#FF0000] tw-font-semibold tw-text-[12px]">
                {(errors as any)?.name?.message}
              </p>
            )}
          </div>

          <div className="tw-flex tw-flex-col tw-gap-2">
            <div className="tw-flex tw-items-center tw-gap-5">
              <span className="tw-text-[16px] tw-font-semibold tw-text-[#000000]">
                Phone
              </span>
            </div>
            <FormInputField
              type="text"
              name="phone"
              control={control}
              placeholder="Enter Phone Number"
              rules={{
                required: "Phone Number is required",
              }}
            />

            {errors?.phone && (
              <p className="tw-text-[#FF0000] tw-font-semibold tw-text-[12px]">
                {(errors as any)?.phone?.message}
              </p>
            )}
          </div>
        </>
      </div>
    </>
  );
};

export default AddEditUserModal;
