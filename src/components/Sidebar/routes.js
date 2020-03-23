import {
  FaSignOutAlt,
  FaMoneyBill,
  FaUserFriends,
  FaList,
  FaObjectGroup,
  FaTable,
  FaChartPie,
  FaChartLine,
  FaUserTimes,
  FaHome,
  FaPaperPlane
} from 'react-icons/fa';

const authToken = localStorage.getItem('auth_token');
const subRoutes = {
  auth: authToken
    ? [{ route: '/auth/logout', text: 'Logout', icon: FaSignOutAlt }]
    : [{ route: '/auth/login', text: 'Login' }],
  admin: [
    {
      route: '/admin/accounts',
      icon: FaMoneyBill,
      text: 'Accounts'
    },
    {
      route: '/admin/payees',
      icon: FaUserFriends,
      text: 'Payees'
    },
    {
      route: '/admin/categories',
      icon: FaList,
      text: 'Categories'
    },
    {
      route: '/admin/groups',
      icon: FaObjectGroup,
      text: 'Groups'
    }
  ],
  reports: [
    {
      route: '/reports/pivot',
      icon: FaTable,
      text: 'Pivot table'
    },
    {
      route: '/reports/chart',
      icon: FaChartPie,
      text: 'Chart'
    },
    {
      route: '/reports/monthly',
      icon: FaChartLine,
      text: 'Monthly Report'
    }
  ],
  legacy: [
    {
      route: '/legacy/data',
      icon: FaHome,
      text: 'Legacy Transactions'
    },
    {
      route: '/legacy/wizard',
      icon: FaPaperPlane,
      text: 'Data Migration Wizard'
    },
    {
      route: '/legacy/pivot',
      icon: FaTable,
      text: 'Pivot of Legacy Records'
    },
    {
      route: '/legacy/deleted',
      icon: FaUserTimes,
      text: 'Deleted Legacy Records'
    }
  ]
};

export default subRoutes;
