import { createBrowserRouter, RouteObject } from 'react-router'
import HomePage from 'src/pages/HomePage'
import React from 'react'
import NotFoundPage from 'src/pages/extra/NotFoundPage.tsx'

// NOTE: https://reactrouter.com/start/data/routing
// TODO: lazy loading 적용해야 할까? > 필요 없을거 같음

const MODULES = import.meta.glob('src/pages/url/**/*.tsx', {
    eager: true,
}) as Record<string, { default: React.FC }>

const generateRoutes = (
    modules: Record<string, { default: React.FC }>,
): RouteObject[] => {
    const routes: RouteObject[] = []

    Object.entries(modules).forEach(([path, module]) => {
        // 파일 경로에서 'src/pages/url/' 이후의 경로를 추출
        const relativePath = path.replace(/.*src\/pages\/url\//, '')
        const Component = module.default

        // 파일명(index.tsx, [id].tsx 등)을 제외하고 폴더명만 추출
        const urlPath = relativePath
            .replace(/\/[^/]*\.tsx$/, '') // 마지막 슬래시와 파일명 제거
            .replace(/\[(.*?)]/g, ':$1') // 동적 라우팅 파라미터 처리

        // 동적 라우팅이 아닌 경우를 위해 기본 경로('/')를 처리
        const finalUrlPath = urlPath === '' ? '/' : `/${urlPath}`

        routes.push({
            path: finalUrlPath,
            element: <Component />,
        })
    })

    return routes
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
    },

    ...generateRoutes(MODULES),

    {
        path: '*',
        element: <NotFoundPage />,
    },
])

export default router
