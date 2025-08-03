/* eslint-disable @typescript-eslint/no-unused-vars */
// app/register/page.tsx
"use client";
import React, { useState, FormEvent, useEffect } from "react";
import Image from "next/image"; // Pastikan Image diimpor jika dipakai
import { SessionProvider, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "@/components/Navbar";
import {
  faSpinner,
  faCheckCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";

const CountdownBar = ({
  duration,
  onComplete,
}: {
  duration: number;
  onComplete: () => void;
}) => {
  const [progress, setProgress] = useState(100);
  useEffect(() => {
    if (duration <= 0) {
      onComplete();
      return;
    }
    const intervalTime = 50; // Update tiap 50ms
    const totalSteps = (duration * 1000) / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newProgress = 100 - (currentStep / totalSteps) * 100;
      setProgress(newProgress);
      if (newProgress <= 0) {
        clearInterval(interval);
        onComplete();
      }
    }, intervalTime);
    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3 mb-1 overflow-hidden">
      <div
        className="bg-teal-500 h-1.5 rounded-full transition-all duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default function RegisterPage() {
  const [step, setStep] = useState<
    "emailInput" | "emailConfirm" | "codeVerify" | "setPassword" | "success"
  >("emailInput");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Error general per step
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[] | undefined>
  >({});

  const router = useRouter();

  const validateEmailFormat = (emailToValidate: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToValidate);

  // STEP 1: User input email
  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});
    if (!validateEmailFormat(email)) {
      setValidationErrors({ email: ["Format email tidak valid."] });
      return;
    }
    setIsLoading(true);
    // Panggil API untuk kirim kode verifikasi
    try {
      const res = await fetch("/api/auth/send-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirim kode verifikasi.");
      }
      toast.success(data.message || "Kode verifikasi dikirim!");
      setStep("codeVerify"); // Langsung ke step verifikasi kode
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setError(error);
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: (Dihilangkan, konfirmasi implisit saat kirim kode)

  // STEP 3: User input kode verifikasi
  const handleCodeVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});
    if (verificationCode.length !== 6 || !/^\d{6}$/.test(verificationCode)) {
      setValidationErrors({ code: ["Kode verifikasi harus 6 digit angka."] });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal memverifikasi kode.");
      }
      toast.success(data.message || "Kode berhasil diverifikasi!");
      setStep("setPassword");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan.";
      setError(errorMessage);
      toast.error(errorMessage || "Kode salah atau kedaluwarsa.");
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 4: User input password
  const handleSetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});
    if (password.length < 8) {
      setValidationErrors({ password: ["Password minimal 8 karakter."] });
      return;
    }
    if (password !== confirmPassword) {
      setValidationErrors({
        confirmPassword: ["Konfirmasi password tidak cocok."],
      });
      return;
    }
    setIsLoading(true);
    try {
      // Panggil API register yang sekarang menerima email dan password
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // Kirim email dan password baru
      });
      const data = await res.json();
      if (!res.ok) {
        // Tangani jika backend mengembalikan detail error Zod
        if (res.status === 400 && data.details) {
          setValidationErrors(data.details);
        }
        throw new Error(data.error || "Gagal menyelesaikan pendaftaran.");
      }
      toast.success(data.message || "Pendaftaran berhasil!");
      setStep("success");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan.";
      setError(errorMessage);
      toast.error(errorMessage || "Gagal mendaftar.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signIn("google", {
        callbackUrl: "/",
        redirect: false,
      });

      if (result?.error) {
        toast.error("Gagal masuk dengan Google.");
      } else if (result?.url) {
        // Redirect ke URL yang diberikan NextAuth
        window.location.href = result.url;
      }
    } catch (error) {
      toast.error("Gagal masuk dengan Google.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case "emailInput":
        return (
          <>
            <h2 className="text-xl font-semibold text-center text-gray-800">
              Daftar Akun Baru
            </h2>
            <p className="text-center text-gray-500 text-sm mb-6">
              Sudah punya akun?{" "}
              <Link
                href="/sign-in"
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Masuk di sini
              </Link>
            </p>
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 mb-4 p-2.5 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <Image
                src="/images/google.png"
                alt="Google"
                width={20}
                height={20}
              />{" "}
              {/* Sesuaikan ukuran ikon */}
              <span className="text-sm font-medium text-gray-700">
                Daftar dengan Google
              </span>
            </button>
            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-200" />
              <span className="mx-2 text-gray-400 text-xs">
                ATAU DAFTAR DENGAN EMAIL
              </span>
              <hr className="flex-grow border-gray-200" />
            </div>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="email-register" className="sr-only">
                  Email
                </label>
                <input
                  type="email"
                  id="email-register"
                  placeholder="Masukkan alamat email Anda"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationErrors.email)
                      setValidationErrors((prev) => ({
                        ...prev,
                        email: undefined,
                      }));
                  }}
                  required
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 sm:text-sm ${
                    validationErrors.email
                      ? "border-red-500 ring-red-500"
                      : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                  }`}
                />
                {validationErrors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {validationErrors.email.join(", ")}
                  </p>
                )}
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <button
                type="submit"
                className="w-full p-3 rounded-lg text-white bg-teal-500 hover:bg-teal-600 font-semibold transition-colors flex items-center justify-center disabled:opacity-70"
                disabled={isLoading || !validateEmailFormat(email)}
              >
                {isLoading ? (
                  <>
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin mr-2"
                    />{" "}
                    Memproses...
                  </>
                ) : (
                  "Lanjutkan"
                )}
              </button>
            </form>
          </>
        );
      case "codeVerify":
        return (
          <>
            <h2 className="text-xl font-semibold text-center text-gray-800">
              Masukkan Kode Verifikasi
            </h2>
            <p className="text-center text-gray-500 text-sm mb-6">
              Kode 6 digit telah dikirim ke{" "}
              <span className="font-medium">{email}</span>. Periksa kotak masuk
              atau folder spam Anda.
            </p>
            <form onSubmit={handleCodeVerify} className="space-y-4">
              <div>
                <label htmlFor="verificationCode" className="sr-only">
                  Kode Verifikasi
                </label>
                <input
                  type="text"
                  id="verificationCode"
                  placeholder="Masukkan 6 digit kode"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(
                      e.target.value.replace(/\D/g, "").slice(0, 6)
                    );
                    if (validationErrors.code)
                      setValidationErrors((prev) => ({
                        ...prev,
                        code: undefined,
                      }));
                  }}
                  required
                  maxLength={6}
                  className={`w-full p-3 text-center tracking-[0.5em] border rounded-md focus:outline-none focus:ring-2 sm:text-sm ${
                    validationErrors.code
                      ? "border-red-500 ring-red-500"
                      : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                  }`}
                />
                {validationErrors.code && (
                  <p className="text-xs text-red-500 mt-1 text-center">
                    {validationErrors.code.join(", ")}
                  </p>
                )}
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  className="text-xs text-gray-500 hover:text-teal-600"
                  onClick={() => {
                    setStep("emailInput");
                    setError(null);
                    setVerificationCode("");
                  }}
                >
                  Ubah Email
                </button>
                <button
                  type="button"
                  className="text-xs text-teal-600 hover:underline disabled:opacity-50"
                  onClick={() =>
                    handleEmailSubmit({
                      preventDefault: () => {},
                    } as React.FormEvent<HTMLFormElement>)
                  }
                  disabled={isLoading}
                >
                  Kirim Ulang Kode?
                </button>
              </div>
              <button
                type="submit"
                className="w-full p-3 rounded-lg text-white bg-teal-500 hover:bg-teal-600 font-semibold transition-colors flex items-center justify-center disabled:opacity-70"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? (
                  <>
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin mr-2"
                    />{" "}
                    Memverifikasi...
                  </>
                ) : (
                  "Verifikasi Kode"
                )}
              </button>
            </form>
          </>
        );
      case "setPassword":
        return (
          <>
            <h2 className="text-xl font-semibold text-center text-gray-800">
              Buat Password Baru
            </h2>
            <p className="text-center text-gray-500 text-sm mb-6">
              Email Anda (<span className="font-medium">{email}</span>) telah
              diverifikasi. Silakan buat password baru.
            </p>
            <form onSubmit={handleSetPassword} className="space-y-4">
              <div>
                <label htmlFor="password-register" className="sr-only">
                  Password Baru
                </label>
                <input
                  type="password"
                  id="password-register"
                  placeholder="Masukkan password baru (min. 8 karakter)"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password)
                      setValidationErrors((prev) => ({
                        ...prev,
                        password: undefined,
                      }));
                  }}
                  required
                  minLength={8}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 sm:text-sm ${
                    validationErrors.password
                      ? "border-red-500 ring-red-500"
                      : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                  }`}
                />
                {validationErrors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {validationErrors.password.join(", ")}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="confirmPassword-register" className="sr-only">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  id="confirmPassword-register"
                  placeholder="Konfirmasi password baru Anda"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (validationErrors.confirmPassword)
                      setValidationErrors((prev) => ({
                        ...prev,
                        confirmPassword: undefined,
                      }));
                  }}
                  required
                  minLength={8}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 sm:text-sm ${
                    validationErrors.confirmPassword
                      ? "border-red-500 ring-red-500"
                      : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                  }`}
                />
                {validationErrors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {validationErrors.confirmPassword.join(", ")}
                  </p>
                )}
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <button
                type="submit"
                className="w-full p-3 rounded-lg text-white bg-teal-500 hover:bg-teal-600 font-semibold transition-colors flex items-center justify-center disabled:opacity-70"
                disabled={
                  isLoading ||
                  password.length < 8 ||
                  password !== confirmPassword
                }
              >
                {isLoading ? (
                  <>
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin mr-2"
                    />{" "}
                    Menyimpan...
                  </>
                ) : (
                  "Selesaikan Pendaftaran"
                )}
              </button>
            </form>
          </>
        );
      case "success":
        return (
          <div className="text-center">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-5xl text-green-500 mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              Pendaftaran Berhasil!
            </h2>
            <p className="text-gray-600 text-sm my-2">
              Akun Anda telah berhasil dibuat.
            </p>
            <p className="text-xs text-gray-500">
              Anda akan dialihkan ke halaman login dalam beberapa detik...
            </p>
            <CountdownBar
              duration={5}
              onComplete={() => {
                router.push("/sign-in");
              }}
            />
            <button
              onClick={() => router.push("/sign-in")}
              className="mt-4 text-teal-600 hover:text-teal-700 text-sm font-medium underline"
            >
              Atau klik di sini untuk masuk sekarang
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gray-100 px-4">
      <SessionProvider>
        <Navbar />
      </SessionProvider>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        {renderStep()}
        {step !== "success" && ( // Hanya tampilkan jika bukan di step sukses
          <p className="text-xs text-gray-500 text-center mt-6 pt-4 border-t border-gray-200">
            Dengan mendaftar, saya menyetujui{" "}
            <Link href="/terms" className="text-teal-600 hover:underline">
              Syarat & Ketentuan
            </Link>{" "}
            serta{" "}
            <Link href="/privacy" className="text-teal-600 hover:underline">
              Kebijakan Privasi
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
