import Link from "next/link";

// app/auth/error/page.tsx
export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1>Authentication Error</h1>
        <p>There was a problem signing you in.</p>
        <Link href="/(auth)/sign-in">Try again</Link>
      </div>
    </div>
  );
}
