import { useLocation } from 'react-router-dom'

export default function NotFound() {
  const location = useLocation()
  return (
    <div>
      <h1 className="title">404</h1>
      Page "{location.pathname}" not found
    </div>
  )
}
