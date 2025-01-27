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

ReactDOM.createRoot(document.getElementById('root')).render(
  <Suspense>
    <ZonaProvider>
      <SensorProvider>
        <BrowserRouter>

          <App />

        </BrowserRouter>,
      </SensorProvider>,
    </ZonaProvider>,
  </Suspense>,
)
