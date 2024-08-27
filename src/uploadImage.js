// src/uploadImage.js

import { storage } from './firebase'; // Adjust the import path if needed
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadImage = async (file) => {
  if (!file) throw new Error('No file selected');

  const storageRef = ref(storage, `images/${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};
