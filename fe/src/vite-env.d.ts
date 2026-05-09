/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GEMINI_API_KEY?: string
    /** FastAPI 백엔드 origin (예: http://localhost:8000). 없으면 클라이언트만 Gemini·스텁 사용 */
    readonly VITE_API_HOST?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
