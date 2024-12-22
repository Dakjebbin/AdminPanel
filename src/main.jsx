import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layouts/Layout.jsx';
import AuthContextProvider from './context/auth-context.jsx'
import ForgotPassword from './auth/ForgotPass.jsx';
// import AdminDash from './components/AdminDash.jsx';
// import Login from './auth/Login.jsx';
import Sidebar from './components/Sidebar.jsx';
import UserDetails from './components/UserDetails.jsx';

const router = createBrowserRouter([
{
  path: "/",
  element: <Layout/>,
  children: [
        {
          index:true,
          element: <App/>,
        },{
          path: "forgot-password",
          element: <ForgotPassword />
        },{
          path: "/admin-dashboard",
          element: <Sidebar/>
        },
        {
          path:"/admin-dashboard/user/:Id",
          element: <UserDetails/>
        }
  ]
}
])



createRoot(document.getElementById('root')).render(
  <StrictMode>
     <AuthContextProvider>
    <RouterProvider router={router}/>
    <ToastContainer/>
    </AuthContextProvider>
  </StrictMode>,
)
