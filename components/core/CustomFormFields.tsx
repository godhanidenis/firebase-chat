import React from "react";
import {
  TextField,
  FormControlLabel,
  MenuItem,
  Autocomplete,
  OutlinedInput,
  IconButton,
  InputAdornment,
  Select,
  Checkbox,
  FormControl,
  Chip,
} from "@mui/material";
import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "./index.css";
import CloseIcon from "@mui/icons-material/Close";

// TextField Component
export const FormInputField = ({
  name,
  label,
  control,
  price,
  discount,
  options,
  disabled,
  showPassword,
  setShowPassword,
  passwordMatched,
  multiline,
  open_time,
  close_time,
  forOpenTime,
  forCloseTime,
  className,
  icon,
  showIcon,
  rules,
  ...props
}: any) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <OutlinedInput
          fullWidth
          {...field}
          {...props}
          variant="outlined"
          multiline={multiline}
          disabled={disabled}
          style={{ fontSize: "15px" }}
          sx={{
            "&:hover fieldset": {
              borderColor: disabled ? "#868585 !important" : "#ffa500 !important",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#ffa500 !important",
            },
            "&.Mui-error fieldset": {
              borderColor: "red !important",
            },
          }}
          className={`${disabled ? "!tw-text-[#868585] !tw-border-[#868585] !tw-bg-[#E7E8EA]" : ""} ${
            !multiline ? "!tw-h-[38px]" : "!tw-h-auto"
          } ${className}`}
          endAdornment={
            showIcon ? (
              <InputAdornment position="end">
                {passwordMatched ? (
                  <IconButton edge="end">
                    <CheckCircleIcon fontSize="large" className="!tw-text-[#00A451]" />
                  </IconButton>
                ) : icon ? (
                  <IconButton edge="end">{icon}</IconButton>
                ) : (
                  <IconButton onClick={() => setShowPassword(!showPassword)} onMouseDown={() => setShowPassword(!showPassword)} edge="end">
                    {!showPassword ? <VisibilityOffIcon fontSize="large" /> : <VisibilityIcon fontSize="large" />}
                  </IconButton>
                )}
              </InputAdornment>
            ) : null
          }
        />
      )}
    />
  );
};

// Checkbox Component
export const FormCheckboxField = ({ name, control, label }: any) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label={label} />}
  />
);

// Select Component
export const FormSelectField = ({ name, control, options, rules, ...props }: any) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => {
        // console.log("field :", field);
        return (
          <Select
            {...field}
            {...props}
            fullWidth
            style={{ fontSize: "15px" }}
            className="!tw-h-[38px]"
            sx={{
              "&:hover fieldset": {
                borderColor: "#ffa500 !important",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#ffa500 !important",
              },
              "&.Mui-error fieldset": {
                borderColor: "red !important",
              },
            }}
          >
            {options.map((option: any) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        );
      }}
    />
  );
};

export const FormDatePickerField = ({ name, control, ...props }: any) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        console.log("FormDatePickerField field", field);
        return (
          <DatePicker
            {...field}
            {...props}
            selected={field.value}
            onChange={(date: any) => field.onChange(date)}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            showPopperArrow={false}
            maxDate={new Date()}
          />
        );
      }}
    />
  );
};

export const FormAutocompleteField = ({ control, name, options = [], multiple, onChangeValue = () => {}, ...props }: any) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
        <Autocomplete
          multiple={multiple}
          options={options}
          getOptionLabel={(option) => option.label || ""}
          value={
            multiple
              ? value.map((selectedValue: any) => options.find((option: any) => option.value === selectedValue) || null)
              : options.find((option: any) => option.value === value) || null
          }
          onChange={(event, newValue: any) => {
            const selectedValues = multiple ? (newValue ? newValue.map((item: any) => item.value) : []) : newValue ? [newValue.value] : [];

            onChange(selectedValues);
            onChangeValue(selectedValues);
          }}
          onBlur={onBlur} // Notify React Hook Form on field blur to trigger validation
          renderTags={(value: any, getTagProps: any) =>
            value.map((option: any, index: number) => (
              // eslint-disable-next-line react/jsx-key
              <Chip
                deleteIcon={<CloseIcon className="!tw-text-[#fff] !tw-text-[16px]" />}
                label={option.label}
                {...getTagProps({ index })}
                sx={{
                  borderRadius: "8px",
                  background: "#ffa500",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "14px",
                  fontWeight: 500,
                  lineHeight: "150%",
                  "&:hover": {
                    background: "#ffa500",
                  },
                }}
              />
            ))
          }
          sx={{
            "&:hover fieldset": {
              borderColor: "#ffa500 !important",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#ffa500 !important",
            },
            "&.Mui-error fieldset": {
              borderColor: "red !important",
            },
          }}
          renderInput={(params) => {
            console.log("Inner params :", params);
            return (
              <FormControl variant="outlined" fullWidth>
                <OutlinedInput
                  id={params.id}
                  notched
                  placeholder={"Choose an option"}
                  {...params.InputProps}
                  inputRef={params.InputProps.ref}
                  endAdornment={params.InputProps.endAdornment}
                  inputProps={{
                    ...params.inputProps,
                  }}
                  style={{ fontSize: "15px" }}
                  sx={{
                    "&:hover fieldset": {
                      borderColor: "#ffa500 !important",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ffa500 !important",
                    },
                    "&.Mui-error fieldset": {
                      borderColor: "red !important",
                    },
                  }}
                />
              </FormControl>
            );
          }}
        />
      )}
      {...props}
    />
  );
};
