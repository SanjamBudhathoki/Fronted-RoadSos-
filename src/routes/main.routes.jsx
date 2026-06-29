import React from 'react'
import Home from '../pages/Home';
import ProviderDashboard from '../pages/ProviderDashbord';
import UserProfile from '../pages/UserProfile';
import LiveTrackingMaps from '../components/LiveTrackingMaps';
import UserDashboard from '../pages/UserDashbord';
import ProjectRoute from '../components/ProjectRoute';

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
    element: <ProjectRoute allowedRole="user"><UserDashboard /></ProjectRoute>,
    
  },{
    path: "/provider/dashbord",
    element:<ProjectRoute allowedRole="provider"><ProviderDashboard /></ProjectRoute>,
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
