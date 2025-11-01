import {createClient} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
}

const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
if (!dataset) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET')
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-11-01',
  useCdn: true,
  perspective: 'published',
})

export const client = sanityClient
