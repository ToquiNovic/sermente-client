// import { User } from '@/models'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// export const isAdmin = (user: User) => {
//   return user.role === 'ADMIN'
// }