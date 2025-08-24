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

// Custom Auth Header (branded login page)
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
          80: '#1E40AF', // main brand blue
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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-600 flex items-center justify-center">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
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
                    <img
                      src="https://acqueon.com/wp-content/uploads/2025/04/Acqueon-Logo.svg"
                      alt="Acqueon Logo"
                      className="h-10"
                    />
                    <h1 className="text-xl font-semibold text-gray-800">
                      Client Storage Portal
                    </h1>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                      {`Hello, ${user?.username}`}
                    </span>
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
                  © {new Date().getFullYear()} Acqueon. All rights reserved.
                </footer>
              </div>
            )}
          </Authenticator>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
