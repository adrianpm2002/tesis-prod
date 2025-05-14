

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

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

          <ActivitiesProvider>
            <DataSensorProvider>

              <App />

            </DataSensorProvider>
          </ActivitiesProvider>

        </SensorProvider>,
      </UserProvider>
    </ZonaProvider>,
  </Suspense>,
)

