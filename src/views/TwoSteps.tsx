"use client";

// React Imports
import { useEffect, useState } from "react";

// Next Imports
import { useRouter } from "next/navigation";

// MUI Imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

// Third-party Imports
import { OTPInput } from "input-otp";
import type { SlotProps } from "input-otp";
import classnames from "classnames";

// Component Imports
import Link from "@components/Link";
import Logo from "@components/layout/shared/Logo";

// Styled Component Imports
import AuthIllustrationWrapper from "@/libs/AuthIllustrationWrapper";

// Style Imports
import styles from "@/libs/styles/inputOtp.module.css";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { CircularProgress, CircularProgressProps, styled } from "@mui/material";

// Extend SlotProps to include hasError
type ExtendedSlotProps = SlotProps & {
  hasError?: boolean;
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

const Slot = (props: ExtendedSlotProps) => {
  return (
    <div
      className={classnames(styles.slot, {
        [styles.slotActive]: props.isActive,
        [styles.errorSlot]: props.hasError,
      })}
    >
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  );
};

const FakeCaret = () => {
  return (
    <div className={styles.fakeCaret}>
      <div className="w-px h-5 bg-textPrimary" />
    </div>
  );
};

// Define FormData type with otp field
type FormData = {
  otp: string;
};

const TwoSteps = () => {
  // States
  const [otp, setOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormData>();

  useEffect(() => {
    const tempPhoneNumber = sessionStorage.getItem("tempPhoneNumber");
    if (!tempPhoneNumber) {
      toast.error("No phone number found. Please login again.");
      router.push("/login");
    } else {
      setPhoneNumber(tempPhoneNumber);
    }

    // Start the countdown when the user lands on the page
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) return prevTimer - 1;
        setResendDisabled(false);
        clearInterval(intervalId);
        return 0;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [router]);

  const handleResend = () => {
    setTimer(60);
    setResendDisabled(true);
    // Resend OTP logic goes here (you can call your resend OTP API)
    toast.success("OTP resent successfully");

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) return prevTimer - 1;
        setResendDisabled(false);
        clearInterval(intervalId);
        return 0;
      });
    }, 1000);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!otp || otp.length < 6) {
      setError("otp", {
        type: "manual",
        message: "Please enter a valid 6-digit code",
      });
      return;
    }

    setLoading(true);
    try {
      const phoneNumber = sessionStorage.getItem("tempPhoneNumber");
      if (!phoneNumber) {
        throw new Error("Phone number not found. Please try logging in again.");
      }

      const res = await signIn("credentials", {
        phoneNumber: phoneNumber,
        otp: otp,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
      } else if (res?.ok) {
        sessionStorage.removeItem("tempPhoneNumber");
        toast.success("Login successful");
        router.push("/home");
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      clearErrors("otp");
    }
  };

  const maskPhoneNumber = (phoneNumber: string) => {
    if (phoneNumber.length < 4) return phoneNumber; // If the phone number is too short, return as is
    return `${phoneNumber.slice(0, 2)}** **${phoneNumber.slice(-2)}`;
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center min-bs-[100dvh] p-6">
        <AuthIllustrationWrapper>
          <Card className="flex flex-col sm:is-[450px]">
            <CardContent className="sm:!p-12">
              <div className="cursor-pointer flex justify-center mbe-6">
                <Logo />
              </div>
              <div className="flex flex-col gap-1 mbe-6">
                <Typography variant="h4">Two Step Verification 💬</Typography>
                <Typography>
                  We sent a verification code to your phone number. Enter the
                  code sent to {maskPhoneNumber(phoneNumber)} in the field
                  below.{" "}
                </Typography>
              </div>
              <form
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col gap-2">
                  <Typography>Type your 6 digit security code</Typography>
                  <OTPInput
                    onChange={handleOtpChange}
                    value={otp ?? ""}
                    maxLength={6}
                    containerClassName="flex items-center"
                    render={({ slots }) => (
                      <div className="flex items-center justify-between w-full gap-4">
                        {slots.slice(0, 6).map((slot, idx) => (
                          <Slot key={idx} {...slot} hasError={!!errors.otp} />
                        ))}
                      </div>
                    )}
                  />
                  {errors.otp && (
                    <Typography color="error">{errors.otp.message}</Typography> // Show error message
                  )}
                </div>
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
                    "Verify OTP"
                  )}
                </Button>
                <div className="flex justify-center items-center flex-wrap gap-2">
                  <Typography>Didn&#39;t get the code?</Typography>
                  {resendDisabled ? (
                    <Typography color="textSecondary">
                      Resend in {timer}s
                    </Typography>
                  ) : (
                    <Typography
                      color="primary"
                      component="span"
                      onClick={handleResend}
                      style={{ cursor: "pointer" }}
                    >
                      Resend
                    </Typography>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </AuthIllustrationWrapper>
      </div>
    </>
  );
};

export default TwoSteps;
