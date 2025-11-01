function assertValue<T>(value: T | undefined, message: string): T {
  if (!value) {
    throw new Error(message)
  }

  return value
}

export const apiVersion =
  import.meta.env.SANITY_STUDIO_API_VERSION || '2025-11-01'

export const dataset = assertValue(
  import.meta.env.SANITY_STUDIO_DATASET,
  'Missing SANITY_STUDIO_DATASET'
)

export const projectId = assertValue(
  import.meta.env.SANITY_STUDIO_PROJECT_ID,
  'Missing SANITY_STUDIO_PROJECT_ID'
)
