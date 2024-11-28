import { RootState } from '../redux/store.ts'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export const AdminGuard = () => {
  const user = useSelector((state: RootState) => state.user)

  const isLoggedIn = !!user?.accessToken 

  return isLoggedIn ? <Outlet /> : <Navigate to="/" />
}

export default AdminGuard
