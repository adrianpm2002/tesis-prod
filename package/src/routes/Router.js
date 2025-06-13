import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Loadable from '../layouts/full/shared/loadable/Loadable';


/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')))
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')))
const Icons = Loadable(lazy(() => import('../views/icons/Icons')))
const TypographyPage = Loadable(lazy(() => import('../views/utilities/TypographyPage')))
const Shadow = Loadable(lazy(() => import('../views/utilities/Shadow')))
const ZonaCultivo = Loadable(lazy(() => import('../views/utilities/ZonaCult')));
const MapaCultivo = Loadable(lazy(() => import('../views/utilities/MapaCult')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));
const Sensores = Loadable(lazy(() => import('../views/sample-page/Sensores')))
const TablaMesual = Loadable(lazy(() => import('../views/utilities/TablaMensual')));
const Calendario = Loadable(lazy(() => import('../views/utilities/Calendario')));
const GraficoTendencia = Loadable(lazy(() => import('../views/utilities/GraficoTendencia')));


const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/auth/login" /> },
      { path: '/dashboard', exact: true, element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      { path: '/sample-page', exact: true, element: <ProtectedRoute><SamplePage /></ProtectedRoute> },
      { path: '/sensores', exact: true, element: <ProtectedRoute><Sensores /></ProtectedRoute> },
      { path: '/icons', exact: true, element: <Icons /> },
      { path: '/zonaCultivo', exact: true, element: <ProtectedRoute><ZonaCultivo /></ProtectedRoute> },
      { path: '/mapaCultivo', exact: true, element: <ProtectedRoute><MapaCultivo /></ProtectedRoute> },
      { path: '/tabla', exact: true, element: <ProtectedRoute><TablaMesual /></ProtectedRoute> },
      { path: '/calendario', exact: true, element: <ProtectedRoute><Calendario /></ProtectedRoute> },
      { path: '/graficos', exact: true, element: <ProtectedRoute><GraficoTendencia /></ProtectedRoute> },
      { path: '/ui/typography', exact: true, element: <ProtectedRoute><TypographyPage /></ProtectedRoute> },
      { path: '/ui/shadow', exact: true, element: <Shadow /> },
      { path: '*', element: <Navigate to="/auth/404" /> },

    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: 'register', element: <Register /> },
      { path: 'login', element: <Login /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
      { path: '' }
    ],
  },
];

export default Router;
