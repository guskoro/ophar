import Fulllayout from '../layouts/fulllayout.jsx';
import Login from '../views/user/login.jsx';

var indexRoutes = [
    { path: '/', name: 'Starter', component: Fulllayout },
    {
        path: '/login',
        name: 'Login',
        icon: 'mdi mdi-database',
        component: Login
      },
];

export default indexRoutes;
