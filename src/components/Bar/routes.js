import React from 'react';
import {
  FaSignInAlt,
  FaUserCog,
  FaHome,
  FaRegPaperPlane,
  FaRegEdit,
  FaChartPie,
  FaCogs
} from 'react-icons/fa';

const routes = [
  {
    route: '/auth',
    icon: <FaSignInAlt />,
    text: 'Profile'
  },
  {
    route: '/admin',
    icon: <FaUserCog />,
    text: 'Admin'
  },
  {
    route: '/service',
    icon: <FaHome />,
    text: 'Accounting'
  },
  {
    route: '/legacy',
    icon: <FaRegPaperPlane />,
    text: 'Legacy'
  },
  {
    route: '/order',
    icon: <FaRegEdit />,
    text: 'Invoices'
  },
  {
    route: '/reports',
    icon: <FaChartPie />,
    text: 'Reports'
  },
  {
    route: '/settings',
    icon: <FaCogs />,
    text: 'Settings'
  }
];

export default routes;
