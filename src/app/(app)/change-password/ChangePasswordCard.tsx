"use client";

// React Imports
import { useState } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

// React Hook Form & Yup Imports
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Component Imports
import CustomTextField from "@core/components/mui/TextField";
import { toast } from "react-toastify";
import { post } from "@/services/apiService";
import { changePassword } from "@/services/endpoint/changePassword";
import { CircularProgress, CircularProgressProps, styled } from "@mui/material";

type ChangePasswordCardProps = {
  userId: number;
};

const CircularProgressDeterminate = styled(
  CircularProgress
)<CircularProgressProps>({
  color: "var(--mui-palette-customColors-trackBg)",
});

const CircularProgressIndeterminate = styled(
  CircularProgress
)<CircularProgressProps>(({ theme }) => ({
  left: 0,
  position: "absolute",
  animationDuration: "440ms",
  color: theme.palette.mode === "light" ? "#ffffff" : "#30d41a",
}));

// Validation Schema using yup
const schema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "New password must be at least 8 characters long")
    .test(
      "not-same-as-current",
      "New password cannot be the same as the current password",
      function (value) {
        const { currentPassword } = this.parent; // Access currentPassword from the parent form
        return value !== currentPassword || !value; // Ensure new password is different from current password, or empty
      }
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), ""], "Passwords must match")
    .required("Confirm new password is required"),

});

const ChangePasswordCard = ({ userId }: ChangePasswordCardProps) => {
  const [loading, setLoading] = useState(false);
  const [isCurrentPasswordShown, setIsCurrentPasswordShown] = useState(false);
  const [isNewPasswordShown, setIsNewPasswordShown] = useState(false);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);

  const handleClickShowCurrentPassword = () => {
    setIsCurrentPasswordShown(!isCurrentPasswordShown);
  };

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Submit handler
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const result = await post(changePassword.save, {
        userId: userId,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      if (result?.ResponseStatus === "success") {
        toast.success(result?.Message);
        reset();
      } else {
        toast.error(result?.Message);
      }
    } catch (error: any) {
      //   setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Change Password" />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Current Password"
                type={isCurrentPasswordShown ? "text" : "password"}
                placeholder="············"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={handleClickShowCurrentPassword}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <i
                          className={
                            isCurrentPasswordShown
                              ? "tabler-eye-off"
                              : "tabler-eye"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={!!errors.currentPassword}
                helperText={errors.currentPassword?.message}
                {...register("currentPassword")}
              />
            </Grid>
          </Grid>
          <Grid container className="mbs-0" spacing={6}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="New Password"
                type={isNewPasswordShown ? "text" : "password"}
                placeholder="············"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() =>
                          setIsNewPasswordShown(!isNewPasswordShown)
                        }
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <i
                          className={
                            isNewPasswordShown ? "tabler-eye-off" : "tabler-eye"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
                {...register("newPassword")} // Register field
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Confirm New Password"
                type={isConfirmPasswordShown ? "text" : "password"}
                placeholder="············"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() =>
                          setIsConfirmPasswordShown(!isConfirmPasswordShown)
                        }
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <i
                          className={
                            isConfirmPasswordShown
                              ? "tabler-eye-off"
                              : "tabler-eye"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...register("confirmPassword")} // Register field
              />
            </Grid>

            <Grid item xs={12} className="flex gap-4">
              <Button variant="contained" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className=" relative mr-2 my-auto">
                      <div className="flex justify-center items-center">
                        <CircularProgressDeterminate
                          variant="determinate"
                          size={20}
                          thickness={4}
                          value={100}
                        />
                        <CircularProgressIndeterminate
                          variant="indeterminate"
                          disableShrink
                          size={20}
                          thickness={6}
                        />
                      </div>
                    </div>{" "}
                    Please wait
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                variant="tonal"
                type="reset"
                color="secondary"
                onClick={() => reset()}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordCard;
