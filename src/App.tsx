import {
  createAmplifyAuthAdapter,
  createStorageBrowser,
} from '@aws-amplify/ui-react-storage/browser';
import '@aws-amplify/ui-react-storage/styles.css';
import './App.css';

import config from '../amplify_outputs.json';
import { Amplify } from 'aws-amplify';
import { Authenticator, Button } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';

Amplify.configure(config);

async function getResolvedFolders() {
  const session = await fetchAuthSession();
  const identityId = session.identityId; // <- Cognito Identity ID

  return [
    { path: 'public/', label: 'Public' },
    { path: `private/${identityId}/`, label: 'My Private Files' }, // 👈 replaces {entity_id}
    { path: 'admin/', label: 'Admin Area' },
  ];
}

const { StorageBrowser } = createStorageBrowser({
  config: createAmplifyAuthAdapter(),
  getFolders: getResolvedFolders, // 👈 forces resolved folders
});

function App() {
  return (
    <Authenticator hideSignUp={true}>
      {({ signOut, user }) => (
        <>
          <div className="header">
            <h1>{`Hello ${user?.signInDetails?.loginId || user?.username}`}</h1>
            <Button onClick={signOut}>Sign out</Button>
          </div>
          <StorageBrowser />
        </>
      )}
    </Authenticator>
  );
}

export default App;
