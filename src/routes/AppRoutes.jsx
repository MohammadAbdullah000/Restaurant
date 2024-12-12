import React from 'react'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import Home from '../pages/Home/Home'
import LoginSignup from '../pages/LoginSignup/LoginSignup'
import AboutUs from '../components/AboutUs/AboutUs'
import ContactUs from '../components/ContactUs/ContactUs'
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword'
const router = createBrowserRouter([
  {
    path:'/',
    element:<Home/>,
    // errorElement:<ErrorPage/>,
    children:[

      {
        path:'/about-us',
        element:<AboutUs/>
      },
      {
        path:'/contact-us',
        element:<ContactUs/>
      },

    ]

  },
  {
//    Dont want to show header
path:'/login',
element:<LoginSignup/>
  },
  {
    path:'/forgotpassword',
    element:<ForgotPassword/>
  }
 
 
 
])

const AppRoutes = () => {
    return <RouterProvider router={router}></RouterProvider>
  }
  
  export default AppRoutes