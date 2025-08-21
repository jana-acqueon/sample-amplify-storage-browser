export const storageFolders = {
  folders: [
    {
      path: "public/*",
      access: {
        guest: ["get", "list"],
        authenticated: ["get", "list", "write", "delete"],
      },
    },
    {
      path: "protected/{entity_id}/*",
      access: {
        authenticated: ["get", "list"],
        "entity:identity": ["get", "list", "write", "delete"],
      },
    },
    {
      path: "private/{entity_id}/*",
      access: {
        "entity:identity": ["get", "list", "write", "delete"],
      },
    },
  ],
};
