// GoogleSigninButton.tsx
"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

const SpinnerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

type LoginMethod = "oauth" | "credentials";

export function GoogleSignInButton() {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("oauth");
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingCredentials, setIsLoadingCredentials] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [credentialsError, setCredentialsError] = useState("");

  const handleGoogleSignIn = async () => {
    setIsLoadingGoogle(true);
    try {
      await signIn("google", {
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      console.error("[GOOGLE_SIGNIN_ERROR]", error);
      setCredentialsError("Gagal masuk dengan Google. Silakan coba lagi.");
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleCredentialsSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCredentialsError("");

    if (!email.trim() || !password.trim()) {
      setCredentialsError("Email dan password harus diisi");
      return;
    }

    setIsLoadingCredentials(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password: password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          setCredentialsError("Email atau password salah");
        } else {
          setCredentialsError(
            "Gagal masuk. Silakan periksa email dan password Anda."
          );
        }
      } else if (result?.ok) {
        // Redirect ke halaman utama
        window.location.href = "/";
      }
    } catch (error) {
      console.error("[CREDENTIALS_SIGNIN_ERROR]", error);
      setCredentialsError("Terjadi kesalahan saat login");
    } finally {
      setIsLoadingCredentials(false);
    }
  };

  if (loginMethod === "credentials") {
    return (
      <div className="space-y-4">
        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (credentialsError) setCredentialsError("");
                }}
                className="pl-10"
                placeholder="Masukkan email Anda"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (credentialsError) setCredentialsError("");
                }}
                className="pl-10 pr-10"
                placeholder="Masukkan password Anda"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          {credentialsError && (
            <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span>{credentialsError}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoadingCredentials || !email.trim() || !password.trim()}
          >
            {isLoadingCredentials ? (
              <>
                <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Masuk"
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">ATAU</span>
          </div>
        </div>

        <Button
          onClick={handleGoogleSignIn}
          disabled={isLoadingGoogle}
          className="w-full"
          variant="outline"
        >
          {isLoadingGoogle ? (
            <>
              <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
              <Image
                src="/images/google.png"
                alt="Google"
                width={20}
                height={20}
                className="w-5 h-5"
              />
            </>
          ) : (
            <Image
              src="/images/google.png"
              alt="Google"
              width={20}
              height={20}
              className="w-5 h-5 mr-2"
            />
          )}
          {isLoadingGoogle ? "Memproses..." : "Lanjutkan dengan Google"}
        </Button>

        <div className="text-center">
          <Button
            type="button"
            variant="link"
            onClick={() => setLoginMethod("oauth")}
            className="text-sm text-slate-600 hover:text-slate-800"
          >
            Kembali ke pilihan login lain
          </Button>
        </div>
      </div>
    );
  }

  // Default OAuth view
  return (
    <div className="space-y-4">
      <Button
        onClick={handleGoogleSignIn}
        disabled={isLoadingGoogle}
        className="w-full justify-center items-center flex"
        variant="outline"
      >
        {isLoadingGoogle ? (
          <>
            <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
            <span>Memproses...</span>
          </>
        ) : (
          <>
            <Image
              src="/images/google.png"
              alt="Google"
              width={25}
              height={25}
              className="mr-2"
            />
            <span>Masuk dengan Google</span>
          </>
        )}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">ATAU</span>
        </div>
      </div>

      <Button
        onClick={() => setLoginMethod("credentials")}
        className="w-full"
        variant="default"
      >
        Masuk dengan Email & Password
      </Button>
    </div>
  );
}
