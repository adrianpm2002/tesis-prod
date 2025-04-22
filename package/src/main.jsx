// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import './index.css'

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ZonaProvider } from './context/ZonaContext'
import { SensorProvider } from './context/SensorContext';
import { UserProvider } from './context/userContext';
import { DataSensorProvider } from './context/dataSensorContext';
import { ActivitiesProvider } from './context/ActivitiesContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Suspense>
    <ZonaProvider>
      <UserProvider>
        <SensorProvider>
          <BrowserRouter>
            <ActivitiesProvider>
              <DataSensorProvider>

                <App />

              </DataSensorProvider>
            </ActivitiesProvider>
          </BrowserRouter>,
        </SensorProvider>,
      </UserProvider>
    </ZonaProvider>,
  </Suspense>,
)

