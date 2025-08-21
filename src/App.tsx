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
import { storageFolders } from '../amplify/storageFolders';

Amplify.configure(config);

const { StorageBrowser } = createStorageBrowser({
  config: createAmplifyAuthAdapter(),
  getFolders: async () => {
    const session = await fetchAuthSession();
    const identityId = session.identityId ?? "unknown"; // fallback if undefined

    return storageFolders.folders.map((folder) => {
      let path = folder.path;
      if (path.includes("{entity_id}")) {
        path = path.replace("{entity_id}", identityId);
      }

      // Friendly label for UI
      let label = path;
      if (path.startsWith("private/")) label = "My Private Files";
      else if (path.startsWith("public/")) label = "Public";
      else if (path.startsWith("protected/")) label = "Protected";

      return { path, label };
    });
  },
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
