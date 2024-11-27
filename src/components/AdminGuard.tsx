import { isAdmin } from '@/lib/utils'
import { RootState  } from '../redux/store.ts'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export const AdminGuard = () => {
  const user = useSelector((state: RootState ) => state.user)

  return isAdmin(user) ? <Outlet /> : <Navigate to="/dashboard" />
}

export default AdminGuard