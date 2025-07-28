export const URL_BACK = import.meta.env.VITE_VERCEL_API_URL;

export const ADMIN_ROLE = import.meta.env.VITE_VERCEL_ROLE_ADMIN;
export const SPECIALIST_ROLE = import.meta.env.VITE_VERCEL_ROLE_SPECIALIST;
export const SURVEYED = import.meta.env.VITE_VERCEL_ROLE_SURVEYED;

export const DashboardAccess = [ADMIN_ROLE, SPECIALIST_ROLE, SURVEYED];
