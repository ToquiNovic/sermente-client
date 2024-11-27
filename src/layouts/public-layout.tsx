import { Outlet } from 'react-router-dom'

export const PublicLayout = () => (
  <div
    style={{
      display: 'grid',
      minHeight: '100vh',
      gridTemplateRows: 'auto 1fr auto'
    }}
  >
    <Outlet />
  </div>
)
export default PublicLayout