import { v4 as uuidv4 } from "uuid";
import { s3Client } from "./spaces";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export default async function upload(image: Buffer, folder: string) {
  const uuid = uuidv4();
  let bucketParams = {
    Bucket: "arcanines",
    Key: `maine/${folder}/${uuid}.png`,
    Body: image,
    ACL: "public-read",
  };
  await s3Client.send(new PutObjectCommand(bucketParams));

  return uuid;
}
