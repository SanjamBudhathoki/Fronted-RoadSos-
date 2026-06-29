import React from 'react'
import Home from '../pages/Home';
import ProviderDashboard from '../pages/ProviderDashbord';
import UserProfile from '../pages/UserProfile';
import LiveTrackingMaps from '../components/LiveTrackingMaps';
import UserDashboard from '../pages/UserDashbord';

const mainRoutes =  [
  {
        path: "/",
    element: <Home />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/user/dashbord",
    element: <UserDashboard />,
  },{
    path: "/provider/dashbord",
    element: <ProviderDashboard />,
  },
  {
    path: "/user/profile",
    element: <UserProfile />,
  },
{  
  path:"/map",
  element:<LiveTrackingMaps/>
},

];


export default mainRoutes;
