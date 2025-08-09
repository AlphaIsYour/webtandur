import Sidebar from "@/app/dashboard/components/Sidebar";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

async function getPetaniData() {
  const session = await getServerSession(authOptions);

  const petani = await prisma.user.findUnique({
    where: {
      email: session?.user.email as string,
    },
    select: {
      name: true,
      email: true,
      username: true,
      image: true,
    },
  });

  if (!petani?.username) {
    redirect("/pengaturan");
  }

  if (!petani) {
    redirect("/error-page");
  }

  return {
    name: petani.name ?? "Nama Petani",
    email: petani.email ?? "email@petani.com",
    image: petani.image ?? "/default-avatar.png",
  };
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = await getPetaniData();

  return (
    <div className="flex min-h-screen bg-gray-100 mt-20">
      <Sidebar user={userData} />
      <main className="flex-grow w-full overflow-y-auto">{children}</main>
    </div>
  );
}
