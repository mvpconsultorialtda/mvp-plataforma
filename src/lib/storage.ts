import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadFile(
  path: string,
  file: File
): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export function getStoragePath(
  folder: string,
  userId: string,
  fileName: string
): string {
  const ext = fileName.split(".").pop() || "jpg";
  const timestamp = Date.now();
  return `${folder}/${userId}/${timestamp}.${ext}`;
}
