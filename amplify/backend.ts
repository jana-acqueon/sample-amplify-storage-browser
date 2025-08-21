import { defineBackend } from "@aws-amplify/backend";
import { Effect, Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { auth } from "./auth/resource";
import storageConfig from "./storageFolders.json";

const backend = defineBackend({
  auth
});

// Import existing bucket (replace ARN & region with yours)
const customBucketStack = backend.createStack("custom-bucket-stack1");
const customBucket = Bucket.fromBucketAttributes(customBucketStack, "MyCustomBucket1", {
  bucketArn: "arn:aws:s3:::ps-amplify-bucket",
  region: "us-east-1"
});

// Build IAM policies dynamically
const authPolicy = new Policy(customBucketStack, "customBucketAuthPolicy", {
  statements: storageConfig.folders.flatMap(folder => {
    const statements: PolicyStatement[] = [];

    // For each role in access rules
    Object.entries(folder.access).forEach(([role, actions]) => {
      // Only generating IAM policies for authenticated users in this example
      if (role === "authenticated") {
        statements.push(
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: actions.map(a => {
              if (a === "get") return "s3:GetObject";
              if (a === "list") return "s3:ListBucket";
              if (a === "write") return "s3:PutObject";
              if (a === "delete") return "s3:DeleteObject";
              return "";
            }),
            resources: [`${customBucket.bucketArn}/${folder.path}`],
          })
        );
      }
    });

    return statements;
  })
});

// Attach IAM policy to authenticated role
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(authPolicy);

// Export storage config so frontend can read it
backend.addOutput({
  storage: {
    aws_region: customBucket.env.region,
    bucket_name: customBucket.bucketName,
    buckets: [
      {
        aws_region: customBucket.env.region,
        bucket_name: customBucket.bucketName,
        name: customBucket.bucketName,
        paths: storageConfig.folders.reduce((acc, folder) => {
          acc[folder.path] = folder.access;
          return acc;
        }, {} as Record<string, any>)
      }
    ]
  }
});
