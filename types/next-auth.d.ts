// types/next-auth.d.ts
import "next-auth"

declare module "next-auth" {
  interface User {
    jwt?: string
    id: string
  }

  interface Session {
    jwt?: string
    user: {
      id: string
      name?: string | null
      email?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    jwt?: string
    user?: {
      id: string
      name?: string | null
      email?: string | null
    }
  }
}