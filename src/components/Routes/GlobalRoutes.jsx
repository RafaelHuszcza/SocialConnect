/* eslint-disable */
import { Outlet, Navigate } from 'react-router-dom';

import { useAuth } from '../../context/authContext'

export const GlobalRoutes = () => {
  const { isLogged } = useAuth()

  return (

      isLogged()? <Outlet/>: <Navigate to={"/login"} />
      

  )
}


