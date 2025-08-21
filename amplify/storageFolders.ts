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

// Export folders dynamically
export const storageFolders: StorageFolder[] = [
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
];
