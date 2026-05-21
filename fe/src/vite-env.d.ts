/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_HOST: string
    readonly VITE_USE_MOCK: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare module "*.webp" {
    const src: string
    export default src
}
