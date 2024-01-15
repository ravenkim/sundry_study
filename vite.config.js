import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],

	//경로 확인
	resolve: {
		alias: {
			src: '/src',
		}
	},

	build: {
		rollupOptions: {
			cache: true, // 캐시 설정
			manifest: true, /*manifest: 이 옵션을 true로 설정하면, Vite는 빌드 시 manifest.json 파일을 생성합니다. 이 파일은 빌드된 자원(assets)의 목록과 해시된 파일 이름을 포함하고 있어서, 서버 사이드에서 적절한 파일 경로를 참조할 수 있게 도와줍니다.*/
			output: {

				//큰 라이브러리를 쪼개서 만들어준다
				manualChunks: {
					antd: ['antd'],
					react: ['react', 'react-dom'],
					reactRouter: ['react-router-dom'],
					axios: ['axios'],


				},
			},
		},
	},


})
