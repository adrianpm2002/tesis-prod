import {
  IconAperture, IconCopy, IconLayoutDashboard, IconLogin, IconMoodHappy, IconTypography, IconUserPlus
} from '@tabler/icons-react';

import { uniqueId } from 'lodash';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Inicio',
  },

  {
    id: uniqueId(),
    title: 'Panel de Control',
    icon: IconLayoutDashboard,
    href: '/dashboard',
  },
  {
    navlabel: true,
    subheader: 'Cultivos',
  },
  {
    id: uniqueId(),
    title: 'Zona de Cultivos',
    icon: IconTypography,
    href: '/zonaCultivo',
  },

  {
    id: uniqueId(),
    title: 'Mapa de Cultivos',
    icon: IconTypography,
    href: '/mapaCultivo',
  },

  


  {
    id: uniqueId(),
    title: 'Historial',
    icon: IconCopy,
    href: '/ui/shadow',
  },
  {
    navlabel: true,
    subheader: 'Configuración',
  },
  {
    id: uniqueId(),
    title: 'Sensores',
    icon: IconAperture,
    href: '/sample-page',
  },

  {
    id: uniqueId(),
    title: 'Alertas',
    icon: IconAperture,
    href: '/sample-page',
  },
  {
    id: uniqueId(),
    title: 'Usuarios',
    icon: IconTypography,
    href: '/ui/typography',
  },



  {
    navlabel: true,
    subheader: 'Auth',
  },
  {
    id: uniqueId(),
    title: 'Login',
    icon: IconLogin,
    href: '/auth/login',
  },
  {
    id: uniqueId(),
    title: 'Register',
    icon: IconUserPlus,
    href: '/auth/register',
  },
  {
    navlabel: true,
    subheader: 'Extra',
  },
  {
    id: uniqueId(),
    title: 'Icons',
    icon: IconMoodHappy,
    href: '/icons',
  },
  {
    id: uniqueId(),
    title: 'Sample Page',
    icon: IconAperture,
    href: '/sample-page',
  },
];

export default Menuitems;
