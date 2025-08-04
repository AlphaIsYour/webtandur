// page.tsx
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { GoogleSignInButton } from "./GoogleSigninButton";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect jika sudah login
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/");
    }
  }, [session, status, router]);

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
          <p className="text-slate-600">Memeriksa status login...</p>
        </div>
      </div>
    );
  }

  // Don't render if already authenticated (prevents flash)
  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col mt-20 items-center justify-center bg-slate-50">
      <Navbar />
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <Image
          src="/favicon.png"
          alt="Pattern Pertanian"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      <div className="relative z-10 w-full max-w-xl p-4">
        <Card className="shadow-lg bg-white border-slate-200">
          <CardHeader className="text-center space-y-2">
            <Link href="/" className="inline-block mx-auto">
              <Image
                src="/favicon.png"
                alt="Logo Tandur"
                width={48}
                height={48}
                priority
              />
            </Link>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              Selamat Datang!
            </CardTitle>
            <CardDescription className="text-slate-600">
              Masuk untuk mulai mendukung petani lokal kita.
            </CardDescription>
          </CardHeader>

          <CardContent className="py-6">
            <GoogleSignInButton />
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              <p className="text-slate-600">
                Belum punya akun?{" "}
                <Link
                  href="/sign-up"
                  className="font-semibold text-green-600 hover:text-green-700 hover:underline transition-colors"
                >
                  Daftar Gratis
                </Link>
              </p>
            </div>

            <div className="text-center text-xs text-slate-500">
              <p>
                Dengan masuk, Anda menyetujui
                <br />
                <Link
                  href="/syarat-ketentuan"
                  className="underline hover:text-green-600 transition-colors"
                >
                  Syarat & Ketentuan
                </Link>{" "}
                dan{" "}
                <Link
                  href="/privacy"
                  className="underline hover:text-green-600 transition-colors"
                >
                  Kebijakan Privasi
                </Link>{" "}
                kami.
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
