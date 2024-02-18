import { initializeApp } from 'firebase/app';
import { getStorage, ref } from 'firebase/storage';
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'facebook-3e6aa.firebaseapp.com',
  projectId: 'facebook-3e6aa',
  storageBucket: 'facebook-3e6aa.appspot.com',
  messagingSenderId: '407387398030',
  appId: '1:407387398030:web:bff4867007e940dee50edf',
  measurementId: 'G-408RJYH7W3',
};
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const storageRef: any = (location) => ref(storage, location);
