import React from 'react';
import {
  FaSignInAlt,
  FaUserCog,
  FaHome,
  FaRegPaperPlane,
  FaRegEdit,
  FaChartPie,
  FaCogs,
  FaCalculator
} from 'react-icons/fa';

const routes = [
  {
    route: '/',
    exact: true,
    icon: <FaHome />,
    text: 'Home'
  },
  {
    route: '/service',
    icon: <FaCalculator />,
    text: 'Accounting'
  },
  {
    route: '/order',
    icon: <FaRegEdit />,
    text: 'Invoices'
  },
  {
    route: '/reports',
    icon: <FaChartPie />,
    userRule: 'ADMIN',
    text: 'Reports'
  },
  {
    route: '/admin',
    icon: <FaUserCog />,
    userRule: 'ADMIN',
    text: 'Admin'
  },
  {
    route: '/legacy',
    icon: <FaRegPaperPlane />,
    userRule: 'ADMIN',
    text: 'Legacy'
  },
  {
    route: '/settings',
    icon: <FaCogs />,
    text: 'Settings'
  },
  {
    route: '/auth',
    icon: <FaSignInAlt />,
    text: 'Profile'
  }
];

export default routes;
