import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        'process.env': {
            NODE_ENV: 'production',
        },
    },
    plugins: [react()],
    build: {
        lib: {
            entry: './src/index.tsx',
            name: 'json-viewer',
            fileName: (format) => `json-viewer.${format}.js`,
        },
        target: 'esnext',
    },
})
