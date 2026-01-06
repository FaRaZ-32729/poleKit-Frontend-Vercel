import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { OrganizationProvider } from './contextApi/OrganizationContext.jsx'
import { VenueProvider } from './contextApi/VenueContext.jsx'
import { AuthProvider } from './contextApi/AuthContext.jsx'
import { UserProvider } from './contextApi/UserContext.jsx'
import { StatusProvider } from './contextApi/StatusContext.jsx'
import { DeviceProvider } from './contextApi/DeviceContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <StatusProvider>
            <OrganizationProvider>
              <VenueProvider>
                <DeviceProvider>
                  <App />
                </DeviceProvider>
              </VenueProvider>
            </OrganizationProvider>
          </StatusProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
