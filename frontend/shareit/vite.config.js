import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'




export default defineConfig({
  base: '/frontend/shareit/', // Adjust this to the correct path where the app is hosted
  build: {
    outDir: 'build', // Ensure build outputs to 'build' folder
  },
});
