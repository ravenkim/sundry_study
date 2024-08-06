import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],

    server: {
        port: 8619
    },

    //절대경로 지정
    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src'),
        },
    },
})
