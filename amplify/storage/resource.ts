import { defineStorage } from "@aws-amplify/backend";
import { storageFolders, FilePerm } from "../storageFolders";

export const storage = defineStorage({
    name: "myStorageBucket",
    isDefault: true,
    access: (allow) => {
        const rules: Record<string, any[]> = {};

        for (const folder of storageFolders) {
            const actions: any[] = [];

            for (const [role, perms] of Object.entries(folder.access)) {
                const typedPerms = perms as FilePerm[]; // ✅ cast to proper literal type

                if (role === "guest") {
                    actions.push(allow.guest.to(typedPerms));
                } else if (role === "authenticated") {
                    actions.push(allow.authenticated.to(typedPerms));
                } else if (role.startsWith("groups:")) {
                    const groupName = role.split(":")[1];
                    actions.push(allow.groups([groupName]).to(typedPerms));
                } else if (role.startsWith("entity:")) {
                    const entity = role.split(":")[1] as "identity";
                    actions.push(allow.entity(entity).to(typedPerms));
                }
            }

            rules[folder.path] = actions;
        }

        return rules;
    },
});
