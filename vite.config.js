import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			src: '/src',
		}
	},

	build: {
		rollupOptions: {
			cache: true,
			external: ['suneditor'],
			output: {
				manualChunks: {
					react: ['react', 'react-dom'],
					reactRouter: ['react-router-dom'],
					axios: ['axios'],
					antd: ['antd'],

				},
			},
		},
	},


})
