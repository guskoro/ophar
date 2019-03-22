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
import Register from '../views/user/registermanajer.jsx';
import RegisterForm from '../views/user/register.jsx';
import DetailWo from '../views/HAR/detailWO/detailwo.jsx';
import NewWo from '../views/HAR/detailWO/comingWO.jsx';
import UploadWO from '../views/HAR/detailWO/uploadwo.jsx';
import Kinerja from '../views/HAR/kinerja.jsx';
import UploadScada20kv from '../views/HAR/kinerja/uploadscada20kv.jsx';

var ThemeRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'mdi mdi-view-dashboard',
    component: Starter
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
    name: 'Patrols and Controls',
    icon: 'mdi mdi-bullhorn',
    component: P3ak
  },
  {
    path: '/kinerja',
    name: 'Work Performance',
    icon: 'mdi mdi-speedometer',
    component: Kinerja
  },
  {
    path: '/register',
    name: 'Register',
    icon: 'mdi mdi-account-multiple-plus',
    component: Register
  },
  {
    path: '/uploadWO',
    name: 'Upload WO',
    icon: 'mdi mdi-database',
    component: UploadWO
  },
  {
    path: '/uploadScada',
    name: 'Upload Scada',
    icon: 'mdi mdi-database',
    component: UploadScada20kv
  },
  {
    path: '/detailWO/:id',
    name: 'Detail WO',
    icon: 'mdi mdi-database',
    component: DetailWo
  },
  {
    path: '/newWO',
    name: 'New WO',
    icon: 'mdi mdi-database',
    component: NewWo
  },
  {
    path: '/registerform',
    name: 'Register Form',
    icon: 'mdi mdi-database',
    component: RegisterForm
  },
  {
    path: '/allWO',
    name: 'All Workorders',
    icon: 'mdi mdi-database',
    component: AllWO
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
  { path: '/', pathTo: '/dashboard', name: 'Dashboard', redirect: true }
];
export default ThemeRoutes;
