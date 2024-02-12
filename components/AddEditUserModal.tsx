/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FormInputField, FormSelectField } from "./core/CustomFormFields";
import { Alert, Box, Button, Modal, Snackbar } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

const AddEditUserModal = ({ open, handleCloseModal }: { open: boolean; handleCloseModal: () => void }) => {
  const [loader, setLoader] = useState(false);

  const [openMessage, setOpenMessage] = useState(false);

  const handleOpenMessage = () => setOpenMessage(true);
  const handleCloseMessage = () => setOpenMessage(false);

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
      type: "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoader(true);

    const payload = data;
    const userID = uuidv4();
    console.log("payload userID:", payload, userID);

    await setDoc(doc(db, "users", userID), data);

    setLoader(false);
    handleCloseModal();
    handleOpenMessage();
  };

  const onError = (errors: any) => console.log("Errors Occurred !! :", errors);

  return (
    <>
      <Modal open={open} onClose={handleCloseModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <div className="px-3 py-3 bg-black">
            <h1 className="text-white text-[20px]">User</h1>
          </div>
          <div className="flex px-3 py-3 flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[16px] font-semibold text-[#000000]">Name</span>
              <FormInputField
                type="text"
                name="name"
                control={control}
                placeholder="Enter Name"
                rules={{
                  required: "Name is required",
                }}
              />

              {errors?.name && <p className="text-[#FF0000] font-semibold text-[12px]">{(errors as any)?.name?.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[16px] font-semibold text-[#000000]">Phone</span>
              <FormInputField
                type="text"
                name="phone"
                control={control}
                placeholder="Enter Phone Number"
                rules={{
                  required: "Phone Number is required",
                }}
              />

              {errors?.phone && <p className="text-[#FF0000] font-semibold text-[12px]">{(errors as any)?.phone?.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[16px] font-semibold text-[#000000]">Type</span>

              <FormSelectField
                name="type"
                control={control}
                options={[
                  { value: "business", label: "Business" },
                  { value: "user", label: "User" },
                ]}
                placeholder="Select Type"
                rules={{
                  required: "Type is required",
                }}
              />

              {errors?.type && <p className="text-[#FF0000] font-semibold text-[12px]">{(errors as any)?.type?.message}</p>}
            </div>

            <div className="flex justify-end">
              <LoadingButton
                loading={loader}
                loadingPosition="start"
                startIcon={<SaveIcon sx={{ color: "white" }} />}
                variant="outlined"
                onClick={handleSubmit(onSubmit)}
                className="bg-black text-white hover:bg-black disabled:text-white"
              >
                Save
              </LoadingButton>
            </div>
          </div>
        </Box>
      </Modal>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={openMessage} autoHideDuration={2000} onClose={handleCloseMessage}>
        <Alert onClose={handleCloseMessage} severity="success" variant="filled" sx={{ width: "100%" }}>
          User Created Successfully!!
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddEditUserModal;
