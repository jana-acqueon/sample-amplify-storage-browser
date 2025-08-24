import {
  createAmplifyAuthAdapter,
  createStorageBrowser,
} from '@aws-amplify/ui-react-storage/browser';
import '@aws-amplify/ui-react-storage/styles.css';
import './App.css';

import config from '../amplify_outputs.json';
import { Amplify } from 'aws-amplify';
import {
  Authenticator,
  Button,
  Heading,
  ThemeProvider,
} from '@aws-amplify/ui-react';

import logoPng from './assets/logo.png';

// Background videos
import neonVideo from './assets/NeonBlueLogoAnimation.mp4';
import orangeVideo from './assets/OrangeLogoAnimation.mp4';
import royalVideo from './assets/RoyalBlueLogoAnimation.mp4';

Amplify.configure(config);

const { StorageBrowser } = createStorageBrowser({
  config: createAmplifyAuthAdapter(),
});

// Optional custom theme
const customTheme = {
  name: 'custom-theme',
  tokens: {
    colors: {
      brand: {
        primary: { value: '#2563eb' }, // Tailwind blue-600
      },
    },
  },
};

function App() {
  return (
    <ThemeProvider theme={customTheme} colorMode="light">
      <Authenticator hideSignUp={true}>
        {({ signOut, user }) =>
          !user ? (
            // -------- Login Page --------
            <div className="relative min-h-screen w-full overflow-hidden">
              {/* Background Video */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
              >
                <source src={neonVideo} type="video/mp4" />
                <source src={orangeVideo} type="video/mp4" />
                <source src={royalVideo} type="video/mp4" />
              </video>

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/50"></div>

              {/* Login widget */}
              <div className="relative z-10 flex items-center justify-end min-h-screen px-12">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                  {/* Authenticator automatically renders login form here */}
                  <Authenticator />
                </div>
              </div>
            </div>
          ) : (
            // -------- Storage Browser Page --------
            <div className="min-h-screen flex flex-col bg-gray-50">
              {/* Header */}
              <header className="bg-white shadow-md flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <img src={logoPng} alt="Logo" className="h-10" />
                  <h1 className="text-xl font-semibold text-gray-800">
                    Client Storage Portal
                  </h1>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">{`Hello, ${user?.username}`}</span>
                  <Button size="small" variation="primary" onClick={signOut}>
                    Sign out
                  </Button>
                </div>
              </header>

              {/* Main Content */}
              <main className="flex-1 flex p-6">
                <div className="w-full bg-white rounded-2xl shadow-md p-6">
                  <Heading level={4} className="mb-4 text-gray-700">
                    File Storage
                  </Heading>
                  <StorageBrowser />
                </div>
              </main>

              {/* Footer */}
              <footer className="bg-gray-100 text-center text-sm text-gray-500 py-4">
                © {new Date().getFullYear()} Your Company. All rights reserved.
              </footer>
            </div>
          )
        }
      </Authenticator>
    </ThemeProvider>
  );
}

export default App;
