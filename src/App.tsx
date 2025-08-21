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
import { storageFolders, StorageFolder } from '../amplify/storageFolders';

Amplify.configure(config);

// Resolve folders dynamically by replacing {entity_id} with actual Cognito Identity ID
async function getResolvedFolders(): Promise<{ path: string; label: string }[]> {
  const session = await fetchAuthSession();
  const identityId = session.identityId;

  return storageFolders.map((folder: StorageFolder) => {
    const resolvedPath = folder.path.replace('{entity_id}', identityId || 'unknown');
    const label = resolvedPath.includes('public')
      ? 'Public'
      : resolvedPath.includes('private')
        ? 'My Private Files'
        : resolvedPath.includes('protected')
          ? 'Protected'
          : resolvedPath;

    return { path: resolvedPath, label };
  });
}

const { StorageBrowser } = createStorageBrowser({
  config: createAmplifyAuthAdapter(),
  getFolders: getResolvedFolders, // dynamically resolves folders
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
