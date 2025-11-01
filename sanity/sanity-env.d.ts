/// <reference types="sanity" />

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ImportMetaEnv {
  readonly SANITY_STUDIO_PROJECT_ID: string
  readonly SANITY_STUDIO_DATASET: string
  readonly SANITY_STUDIO_API_VERSION?: string
}
