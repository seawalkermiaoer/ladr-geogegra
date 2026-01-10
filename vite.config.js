import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd(), '')
    return {
        plugins: [react()],
        define: {
            '__APP_USERNAME__': JSON.stringify(env.USERNAME),
            '__APP_PASSWORD__': JSON.stringify(env.PASSWORD),
            'process.env.DASHSCOPE_API_KEY': JSON.stringify(env.DASHSCOPE_API_KEY),
            'process.env.APP_ID': JSON.stringify(env.APP_ID),
            'process.env.NVIDIA_API_KEY': JSON.stringify(env.NVIDIA_API_KEY),
        }
    }
})
