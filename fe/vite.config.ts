import react from '@vitejs/plugin-react-swc'
import path, { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, Plugin } from 'vite'
import fs, { copyFileSync } from 'fs'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(), fontPreloadPlugin(), copyRobotsTxt()],

    // 포트지정
    server: {
        port: 6075,
    },

    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src'),
        },
    },

    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // React 관련 모듈
                    'vendor-react': [
                        'react',
                        'react-dom',
                        'scheduler',
                        'react/jsx-runtime',
                    ],
                    // Redux 관련 모듈
                    'vendor-redux': [
                        '@reduxjs/toolkit',
                        'react-redux',
                        'redux',
                        'redux-saga',
                    ],
                    // i18n 관련 모듈
                    'vendor-i18n': ['i18next', 'react-i18next'],
                    // 애니메이션 관련 모듈
                    'vendor-motion': ['framer-motion'],
                    // 아이콘 관련 모듈
                    'vendor-icons': ['lucide-react'],
                    // Radix UI 관련 모듈
                    'vendor-radix': [
                        '@radix-ui/react-dialog',
                        '@radix-ui/react-label',
                        '@radix-ui/react-scroll-area',
                        '@radix-ui/react-separator',
                        '@radix-ui/react-slot',
                        '@radix-ui/react-switch',
                        '@radix-ui/react-tabs',
                        '@radix-ui/react-tooltip',
                    ],
                },
            },
        },
    },
})

// 폰트를 자동으로 preload하는 플러그인
function fontPreloadPlugin(): Plugin {
    return {
        name: 'vite-font-preload',
        transformIndexHtml: {
            order: 'pre',
            handler(html) {
                const fontDir = path.resolve(__dirname, 'src/assets/fonts')
                const preloadLinks: string[] = []
                const usedFonts = getUsedFonts(html)

                function walk(dir: string) {
                    const files = fs.readdirSync(dir)
                    for (const file of files) {
                        const fullPath = path.join(dir, file)
                        const stat = fs.statSync(fullPath)
                        if (stat.isDirectory()) {
                            walk(fullPath)
                        } else if (
                            file.endsWith('.woff') ||
                            file.endsWith('.woff2')
                        ) {
                            const publicPath = fullPath
                                .split('assets')[1]
                                .replace(/\\/g, '/')
                            const type = file.endsWith('.woff2')
                                ? 'font/woff2'
                                : 'font/woff'
                            const fontName = file.split('.')[0]
                            if (usedFonts.includes(fontName)) {
                                preloadLinks.push(
                                    `<link rel="preload" href="/assets${publicPath}" as="font" type="${type}" crossorigin>`,
                                )
                            }
                        }
                    }
                }

                walk(fontDir)
                return html.replace(
                    '</head>',
                    preloadLinks.join('\n') + '\n</head>',
                )
            },
        },
    }
}

// HTML에서 사용된 폰트를 추출하는 함수
function getUsedFonts(html: string): string[] {
    const fontRegex = /font-family:\s*['"]?([^;'"]+)['"]?/g
    const usedFonts: string[] = []
    let match
    while ((match = fontRegex.exec(html)) !== null) {
        usedFonts.push(match[1].toLowerCase())
    }
    return usedFonts
}

// 커스텀 플러그인: 빌드 후 robots.txt 복사
function copyRobotsTxt() {
    return {
        name: 'copy-robots-txt',
        closeBundle() {
            copyFileSync(
                resolve(__dirname, 'robots.txt'),
                resolve(__dirname, 'dist/robots.txt'),
            )
        },
    }
}
