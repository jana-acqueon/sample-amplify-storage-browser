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
  View,
  ThemeProvider,
} from '@aws-amplify/ui-react';

Amplify.configure(config);

const { StorageBrowser } = createStorageBrowser({
  config: createAmplifyAuthAdapter(),
});

// Custom Auth Header (for login page)
function CustomAuthHeader() {
  return (
    <View textAlign="center" padding="medium">
      <Image
        alt="Acqueon Logo"
        src="https://acqueon.com/wp-content/uploads/2025/04/Acqueon-Logo.svg"
        height="60px"
        className="mx-auto mb-4"
      />
    </View>
  );
}

// Custom theme (brand colors, rounded buttons, etc.)
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
      <div className="min-h-screen bg-gray-100 flex">
        <Authenticator
          hideSignUp={true}
          components={{
            Header: CustomAuthHeader,
          }}
        >
          {({ signOut, user }) => (
            <div className="flex flex-col w-full min-h-screen">
              {/* Professional Header */}
              <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                  {/* Logo + App Name */}
                  <div className="flex items-center gap-3">
                    <img
                      src="https://acqueon.com/wp-content/uploads/2025/04/Acqueon-Logo.svg"
                      alt="Acqueon Logo"
                      className="h-10"
                    />
                    <span className="text-lg font-semibold text-gray-800">
                      File Storage Portal
                    </span>
                  </div>

                  {/* Right: User + Sign Out */}
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-medium">
                      {user?.username}
                    </span>
                    <Button
                      size="small"
                      variation="primary"
                      onClick={signOut}
                    >
                      Sign out
                    </Button>
                  </div>
                </div>
              </header>

              {/* Main Content */}
              <main className="flex-1 max-w-7xl mx-auto w-full p-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <Heading level={4} className="mb-4 text-gray-700">
                    File Storage
                  </Heading>
                  <StorageBrowser />
                </div>
              </main>

              {/* Footer */}
              <footer className="bg-white border-t border-gray-200 text-center text-sm text-gray-500 py-4">
                © {new Date().getFullYear()} Acqueon. All rights reserved.
              </footer>
            </div>
          )}
        </Authenticator>
      </div>
    </ThemeProvider>
  );
}

export default App;
