import { createBrowserRouter, RouteObject } from 'react-router'
import HomePage from 'src/pages/HomePage'
import React from 'react'
import NotFoundPage from 'src/pages/extra/NotFoundPage.tsx'

// NOTE: https://reactrouter.com/start/data/routing
// TODO: lazy loading 적용해야 할까? > 필요 없을거 같음

const MODULES = import.meta.glob('src/pages/url/**/*.tsx', {
    eager: true,
}) as Record<string, { default: React.FC }>

/** `url/note/NotePage.tsx` → `note` (경로당 폴더 1단 + *Page 컴포넌트), `:aid/detail` 등은 유지 */
function filePathToRoutePath(relativePath: string): string {
    const withParams = relativePath.replace(/\[(.*?)]/g, ':$1')
    const segments = withParams.split('/').filter(Boolean)
    const last = segments[segments.length - 1]

    let routePath: string
    if (segments.length >= 2 && last.endsWith('Page')) {
        const parent = segments[segments.length - 2]
        const baseName = last.slice(0, -'Page'.length)
        const parentKey = parent.startsWith(':')
            ? parent.slice(1)
            : parent
        if (
            !parent.startsWith(':') &&
            baseName.toLowerCase() === parentKey.toLowerCase()
        ) {
            routePath = segments.slice(0, -1).join('/')
        } else {
            routePath = [
                ...segments.slice(0, -1),
                last.replace(/Page$/, ''),
            ].join('/')
        }
    } else {
        routePath = withParams.replace(/Page$/, '')
    }

    return routePath.toLowerCase()
}

const generateRoutes = (
    modules: Record<string, { default: React.FC }>,
): RouteObject[] => {
    return Object.entries(modules).map(([path, module]) => {
        const relativePath = path
            .replace(/.*src\/pages\/url\//, '')
            .replace(/\.tsx$/, '')
        const routePath = filePathToRoutePath(relativePath)

        const Component = module.default

        return {
            path: `/${routePath}`,
            element: <Component />,
        }
    })
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
