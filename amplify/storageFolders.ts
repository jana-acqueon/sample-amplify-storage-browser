// Define allowed file permissions
export type FilePerm = "get" | "list" | "write" | "delete";

// Define folder access mapping
export interface FolderAccess {
  guest?: FilePerm[];
  authenticated?: FilePerm[];
  "groups:admin"?: FilePerm[];
  "entity:identity"?: FilePerm[];
}

// Define folder structure
export interface StorageFolder {
  path: string;
  access: FolderAccess;
}

export const storageFolders = {
  folders: [
    {
      path: "public/*",
      access: {
        guest: ["read", "write", "delete"],
        authenticated: ["read", "write", "delete"],
      },
    },
    {
      path: "protected/{entity_id}/*",
      access: {
        authenticated: ["read", "list"],
        "entity:identity": ["read", "list", "write", "delete"],
      },
    },
    {
      path: "private/{entity_id}/*",
      access: {
        "entity:identity": ["read", "list", "write", "delete"],
      },
    },
  ],
};