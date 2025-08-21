import { defineStorage } from "@aws-amplify/backend";
import { storageFolders } from "../storageFolders";

export const storage = defineStorage({
    name: "myStorageBucket",
    isDefault: true,
    access: (allow) => {
        const rules: Record<string, any[]> = {};

        for (const folder of storageFolders.folders) {
            const actions: any[] = [];

            for (const [role, perms] of Object.entries(folder.access)) {
                if (role === "guest") {
                    actions.push(allow.guest.to(perms as ("read" | "write" | "delete")[]));
                } else if (role === "authenticated") {
                    actions.push(allow.authenticated.to(perms as ("read" | "write" | "delete")[]));
                } else if (role.startsWith("groups:")) {
                    const groupName = role.split(":")[1];
                    actions.push(allow.groups([groupName]).to(perms as ("read" | "write" | "delete")[]));
                } else if (role.startsWith("entity:")) {
                    const entity = role.split(":")[1] as "identity";
                    actions.push(allow.entity(entity).to(perms as ("read" | "write" | "delete")[]));
                }
            }

            rules[folder.path] = actions;
        }

        return rules;
    },
});
