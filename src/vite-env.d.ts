/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AZURE_API_URL: string
  readonly VITE_AZURE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}