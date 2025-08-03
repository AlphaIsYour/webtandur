// src/types/next-auth.d.ts

import { Role } from "@prisma/client"; // Impor enum Role dari Prisma
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

// Perluas tipe User dari next-auth
declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role: Role; // Gunakan tipe Role dari Prisma
  }

  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"]; // Gabungkan dengan tipe user default
  }
}

// Perluas tipe JWT (JSON Web Token)
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: Role;
  }
}
