import type { User, Role } from "@prisma/client"
import "next-auth"

declare module "next-auth" {
  interface Session {
    user: User & {
      id: string
      role: Role
    }
  }
}

