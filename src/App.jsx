import { UserProvider } from './Contexts/UserContext.jsx'
import AppRoutes from './routes/AppRoutes'

function App() {

  return (
    <>
       <UserProvider>
    <AppRoutes />
  </UserProvider>
    </>
  )
}

export default App
