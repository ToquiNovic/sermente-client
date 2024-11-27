import { Outlet } from 'react-router-dom'
import { AppSidebar } from '@/components/app/sidebar/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toaster'

export const AdminLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full p-2">
        <SidebarTrigger />
        <div className="flex h-full w-full justify-center p-10">
          <Outlet />
        </div>
        <Toaster />
      </main>
    </SidebarProvider>
  )
}

export default AdminLayout