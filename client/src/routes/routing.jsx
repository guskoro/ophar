import Starter from '../views/starter/starter.jsx';
// ui components
import Alerts from '../views/ui-components/alert.jsx';
import Badges from '../views/ui-components/badge.jsx';
import Buttons from '../views/ui-components/button.jsx';
import Cards from '../views/ui-components/cards.jsx';
import LayoutComponent from '../views/ui-components/layout.jsx';
import PaginationComponent from '../views/ui-components/pagination.jsx';
import PopoverComponent from '../views/ui-components/popover.jsx';
import TooltipComponent from '../views/ui-components/tooltip.jsx';
// menu har
import Asset from '../views/HAR/asset.jsx';
import Cm from '../views/HAR/cm.jsx';
import Pm from '../views/HAR/pm.jsx';
import P3ak from '../views/HAR/p3ak.jsx';
import AllWO from '../views/HAR/allwo.jsx';
import RegisterM from '../views/user/registermanajer.jsx';
import RegisterA from '../views/user/registeradmin.jsx';
import DetailWo from '../views/HAR/detailWO/detailwo.jsx';

var ThemeRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'ti-loop',
    component: Starter
  },
  {
    path: '/detailWO',
    name: 'Detail WO',
    icon: 'mdi mdi-database',
    component: DetailWo
  },
  {
    path: '/registerM',
    name: 'Register Manajer',
    icon: 'mdi mdi-database',
    component: RegisterM
  },
  {
    path: '/registerA',
    name: 'Register Admin',
    icon: 'mdi mdi-database',
    component: RegisterA
  },
  {
    path: '/allWO',
    name: 'All Workorders',
    icon: 'mdi mdi-database',
    component: AllWO
  },
  {
    path: '/cm',
    name: 'Corrective Maintenance',
    icon: 'mdi mdi-settings',
    component: Cm
  },
  {
    path: '/pm',
    name: 'Preventive Maintance',
    icon: 'mdi mdi-verified',
    component: Pm
  },
  {
    path: '/asset',
    name: 'Asset',
    icon: 'mdi mdi-database',
    component: Asset
  },
  {
    path: '/p3ak',
    name: 'Patrol and Control',
    icon: 'mdi mdi-bullhorn',
    component: P3ak
  },
  {
    path: '/alert',
    name: 'Alerts',
    icon: 'mdi mdi-comment-processing-outline',
    component: Alerts
  },
  {
    path: '/badge',
    name: 'Badges',
    icon: 'mdi mdi-arrange-send-backward',
    component: Badges
  },
  {
    path: '/button',
    name: 'Buttons',
    icon: 'mdi mdi-toggle-switch',
    component: Buttons
  },
  {
    path: '/card',
    name: 'Cards',
    icon: 'mdi mdi-credit-card-multiple',
    component: Cards
  },
  {
    path: '/grid',
    name: 'Grid',
    icon: 'mdi mdi-apps',
    component: LayoutComponent
  },
  {
    path: '/pagination',
    name: 'Pagination',
    icon: 'mdi mdi-priority-high',
    component: PaginationComponent
  },
  {
    path: '/popover',
    name: 'Popover',
    icon: 'mdi mdi-pencil-circle',
    component: PopoverComponent
  },
  {
    path: '/ui-components/tooltip',
    name: 'Toltips',
    icon: 'mdi mdi-image-filter-vintage',
    component: TooltipComponent
  },
  { path: '/', pathTo: '/dashboard', name: 'Dashboard', redirect: true },
];
export default ThemeRoutes;
