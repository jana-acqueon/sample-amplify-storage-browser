import { defineBackend } from "@aws-amplify/backend";
import { Effect, Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { auth } from "./auth/resource";
import rawConfig from "./storageFolders.json";

// ------------------
// 🔹 Define Strong Types
// ------------------
type StorageAction = "get" | "list" | "write" | "delete";
type StorageRole = "guest" | "authenticated" | "entity:identity";

interface StorageFolder {
  path: string;
  access: Partial<Record<StorageRole, StorageAction[]>>;
}

interface StorageConfig {
  folders: StorageFolder[];
}

// ------------------
// 🔹 Load Config Safely
// ------------------
const storageConfig = rawConfig as StorageConfig;

// ------------------
// 🔹 Action Mapper
// ------------------
const s3ActionMap: Record<StorageAction, string[]> = {
  get: ["s3:GetObject"],
  list: ["s3:ListBucket"], // handled separately for bucket-level
  write: ["s3:PutObject"],
  delete: ["s3:DeleteObject"],
};

// ------------------
// 🔹 Backend Setup
// ------------------
const backend = defineBackend({
  auth,
});

// Import existing bucket (replace ARN/region with yours)
const customBucketStack = backend.createStack("custom-bucket-stack1");
const customBucket = Bucket.fromBucketAttributes(customBucketStack, "MyCustomBucket1", {
  bucketArn: "arn:aws:s3:::ps-amplify-bucket",
  region: "us-east-1",
});

// ------------------
// 🔹 Generate IAM Policies from Config
// ------------------
const statements: PolicyStatement[] = [];

storageConfig.folders.forEach(folder => {
  Object.entries(folder.access).forEach(([role, actions]) => {
    if (!actions) return;

    // 1️⃣ Handle all object-level actions (except list)
    const objectActions = actions.flatMap((a: StorageAction) =>
      a === "list" ? [] : s3ActionMap[a]
    );

    if (objectActions.length > 0) {
      statements.push(
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: objectActions,
          resources: [`${customBucket.bucketArn}/${folder.path}`],
        })
      );
    }

    // 2️⃣ Handle "list" separately (bucket-level)
    if (actions.includes("list")) {
      statements.push(
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ["s3:ListBucket"],
          resources: [customBucket.bucketArn],
          conditions: {
            StringLike: {
              "s3:prefix": [folder.path],
            },
          },
        })
      );
    }
  });
});

// ------------------
// 🔹 Attach Policies per Role
// ------------------

// Authenticated users
const authPolicy = new Policy(customBucketStack, "customBucketAuthPolicy", {
  statements: statements.filter((stmt, i) =>
    // crude filter: just for demonstration, you could separate per-role more cleanly
    storageConfig.folders.some(f => f.access.authenticated)
  ),
});
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(authPolicy);

// Guest users (optional: if guest is used in JSON)
const guestPolicy = new Policy(customBucketStack, "customBucketGuestPolicy", {
  statements: statements.filter((stmt, i) =>
    storageConfig.folders.some(f => f.access.guest)
  ),
});
backend.auth.resources.unauthenticatedUserIamRole?.attachInlinePolicy(guestPolicy);

// ------------------
// 🔹 Amplify Outputs (for UI to consume)
// ------------------
backend.addOutput({
  storage: {
    aws_region: customBucket.env.region,
    bucket_name: customBucket.bucketName,
    buckets: [
      {
        aws_region: customBucket.env.region,
        bucket_name: customBucket.bucketName,
        name: customBucket.bucketName,
        paths: Object.fromEntries(
          storageConfig.folders.map(f => [f.path, f.access])
        ),
      },
    ],
  },
});
