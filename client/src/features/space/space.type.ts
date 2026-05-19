/**
 * Space form data for creation
 */
export interface CreateSpaceFormData {
  name: string
  description: string
}

/**
 * Space object returned from backend
 */
export interface Space {
  id: number
  name: string
  description: string | null
  owner_id: number
  created_at: string
  updated_at: string
}

/**
 * API response for creating a space
 */
export interface CreateSpaceApiResponse {
  space: Space
  message: string
}

/**
 * Redux space state shape
 */
export interface SpaceState {
  // Spaces list
  spaces: Space[]

  // Current space being viewed
  currentSpace: Space | null

  // UI states
  loading: boolean
  error: string | null

  // Modal states
  isCreateModalOpen: boolean
}
