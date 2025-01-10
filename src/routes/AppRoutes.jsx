import React from 'react'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import Home from '../pages/Home/Home'
import LoginSignup from '../pages/LoginSignup/LoginSignup'
import AboutUs from '../components/AboutUs/AboutUs'
import ContactUs from '../components/ContactUs/ContactUs'
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword'
import Dashboard from '../pages/Dashboard/Dashboard'
import Inventory from '../components/Inventory/Inventory'
import Sidebar from '../layouts/Sidebar/Sidebar'
import Menu from '../components/Menu/Menu'
import Dish from '../components/Dish/Dish'
import Order from '../components/Order/Order'
import Category from '../components/Category/Category'
import Designation from '../components/Designation/Designation'
import Employee from '../components/Employee/Employee'
import Expense from '../components/Expense/Expense'
import ShowTotalExpenses from '../components/ShowTotalExpenses/ShowTotalExpenses'
import ShowDishesSell from '../components/ShowDishesSell/ShowDishesSell'
import History from '../History/History'
import Income from '../components/Income/Income'
import ShowEmployeeDetail from '../components/ShowEmployeeDetail/ShowEmployeeDetail'
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
  },
  {
    path: "/dashboard",
    element: <Sidebar />, // Sidebar as the layout for admin pages
    children: [
      {
        index: true, // Default route under /dashboard
        element: <Dashboard />,
      },
      {
        path: "inventory", // Correctly nested route for /dashboard/inventory
        element: <Inventory />,
      },
      {
        path: "menu", // Correctly nested route for /dashboard/inventory
        element: <Menu />,
      },
      {
        path: "category", // Correctly nested route for /dashboard/inventory
        element: <Category />,
      },
      {
        path: "dish", // Correctly nested route for /dashboard/inventory
        element: <Dish/>,
      },
      {
        path: "order", // Correctly nested route for /dashboard/inventory
        element: <Order/>,
      },
      {
        path: "designation", // Correctly nested route for /dashboard/inventory
        element: <Designation/>,
      },
      {
        path: "employee", // Correctly nested route for /dashboard/inventory
        element: <Employee/>,
      },
      {
        path: "expense", // Correctly nested route for /dashboard/inventory
        element: <Expense/>,
      },
      {
        path: "expenses", // Correctly nested route for /dashboard/inventory
        element: <ShowTotalExpenses/>,
      },
      {
        path: "dishes", // Correctly nested route for /dashboard/inventory
        element: <ShowDishesSell/>,
      },
      {
        path: "history", // Correctly nested route for /dashboard/inventory
        element: <History/>,
      },
      {
        path: "sale", // Correctly nested route for /dashboard/inventory
        element: <Income/>,
      },
      {
        path: "show_employee_detail", // Correctly nested route for /dashboard/inventory
        element: <ShowEmployeeDetail/>,
      },
    ],
  },
  
 
 
 
])

const AppRoutes = () => {
    return <RouterProvider router={router}></RouterProvider>
  }
  
  export default AppRoutes