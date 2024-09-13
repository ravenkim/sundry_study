import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), svgr()],

    // 캐시 생성 위치 (없으면 node_modules 안에 생김)
    cacheDir: './.vite',

    //포트 지정
    server: {
        port: 8619,
    },

    //절대경로 지정


    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src'),
        },
    },
})
