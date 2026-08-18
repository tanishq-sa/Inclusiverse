/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RAZORPAY_KEY_ID: string;
  readonly VITE_RAZORPAY_KEY_SECRET: string;
  // Add more VITE_ env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'react-dom/client';

interface Window {
  Razorpay: any;
}
