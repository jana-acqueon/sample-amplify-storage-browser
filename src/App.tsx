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
  Image,
  Text,
  View,
  ThemeProvider,
} from '@aws-amplify/ui-react';

// ✅ Import assets from src/assets/
import logoPng from './assets/Logo.png';
import logoSvg from './assets/logo.svg';
import neonVideo from './assets/NeonBlueLogoAnimation.mp4';
import orangeVideo from './assets/OrangeLogoAnimation.mp4';
import royalVideo from './assets/RoyalBlueLogoAnimation.mp4';

Amplify.configure(config);

const { StorageBrowser } = createStorageBrowser({
  config: createAmplifyAuthAdapter(),
});

// Custom Auth Header (login branding)
function CustomAuthHeader() {
  return (
    <View textAlign="center" padding="medium">
      <Image alt="logo" src={logoSvg} height="60px" className="mx-auto mb-4" />
      <Heading level={3} className="text-gray-800">
        Welcome to Client Storage Portal
      </Heading>
      <Text variation="tertiary" className="text-gray-500">
        Secure access to your files
      </Text>
    </View>
  );
}

// Custom theme (buttons, rounded corners, brand colors)
const customTheme = {
  name: 'custom-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: '#F0F6FF',
          80: '#1E40AF',
          90: '#1D4ED8',
          100: '#1E3A8A',
        },
      },
    },
    components: {
      button: {
        primary: {
          backgroundColor: '{colors.brand.primary.80}',
          _hover: { backgroundColor: '{colors.brand.primary.90}' },
        },
      },
    },
    radii: {
      small: '8px',
      medium: '12px',
    },
  },
};

function App() {
  return (
    <ThemeProvider theme={customTheme} colorMode="light">
      {/* Background Video Layer */}
      <div className="relative min-h-screen w-full overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover" >
          <source src={neonVideo} type="video/mp4" />
          <source src={orangeVideo} type="video/mp4" />
          <source src={royalVideo} type="video/mp4" />
        </video>

        {/* Overlay tint so login card is readable */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Login card aligned right-center */}
        <div className="relative z-10 flex items-center justify-end min-h-screen px-8">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            <Authenticator
              hideSignUp={true}
              components={{
                Header: CustomAuthHeader,
              }}
            >
              {({ signOut, user }) => (
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
              )}
            </Authenticator>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
