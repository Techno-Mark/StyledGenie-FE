"use client";

// Next Imports
import Link from "next/link";

// MUI Imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

// Third-party Imports
import { object, minLength, string, Input, email } from "valibot";
import CircularProgress from "@mui/material/CircularProgress";
import type { CircularProgressProps } from "@mui/material/CircularProgress";

// Component Imports
import DirectionalIcon from "@components/DirectionalIcon";
import Logo from "@components/layout/shared/Logo";
import CustomTextField from "@core/components/mui/TextField";

// Styled Component Imports
import AuthIllustrationWrapper from "../libs/AuthIllustrationWrapper";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useState } from "react";
import { styled } from "@mui/material";
import { useRouter } from "next/navigation";
import { forgetPassword } from "@/services/endpoint/forgetPassword";
import { unauthorizedPost } from "@/services/apiService";
import { toast } from "react-toastify";

type ErrorType = {
  message: string[];
};

type FormData = Input<typeof schema>;

const schema = object({
  email: string([
    minLength(1, "This field is required"),
    email("Email is invalid"),
  ]),
});

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



const ForgotPassword = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorState, setErrorState] = useState<ErrorType | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      // Use unauthorizedPost since it does not require a session token
      const result = await unauthorizedPost(forgetPassword.send, {
        email: data.email,
      });
      if (result?.ResponseStatus === "success") {
        toast.success(result?.Message);
        router.push("/login");
      } else {
        toast.error(result?.Message);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center min-bs-[100dvh] p-6">
        <AuthIllustrationWrapper>
          <Card className="flex flex-col sm:is-[450px]">
            <CardContent className="sm:!p-12">
              <Link href={"/"} className="flex justify-center mbe-6">
                <Logo />
              </Link>
              <div className="flex flex-col gap-1 mbe-6">
                <Typography variant="h4">Forgot Password 🔒</Typography>
                <Typography>
                  Enter your email and we&#39;ll send you instructions to reset
                  your password
                </Typography>
              </div>
              <form
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      autoFocus
                      fullWidth
                      label="Email"
                      placeholder="Enter your email"
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        errorState !== null && setErrorState(null);
                      }}
                    />
                  )}
                />
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading}
                >
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
                    "Send Reset Link"
                  )}
                </Button>
                <Typography
                  className="flex justify-center items-center"
                  color="primary"
                >
                  <Link href={"/login"} className="flex items-center gap-1.5">
                    <DirectionalIcon
                      ltrIconClass="tabler-chevron-left"
                      rtlIconClass="tabler-chevron-right"
                      className="text-xl"
                    />
                    <span>Back to login</span>
                  </Link>
                </Typography>
              </form>
            </CardContent>
          </Card>
        </AuthIllustrationWrapper>
      </div>
    </>
  );
};

export default ForgotPassword;
