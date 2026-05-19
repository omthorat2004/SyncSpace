/**
 * Content type enum
 */
export type ContentType = 'note' | 'link' | 'code'

/**
 * Form data for creating content
 */
export interface CreateContentFormData {
    title: string
    type: ContentType
    content: string
    url?: string
}

/**
 * Content object returned from backend
 */
export interface Content {
    id: number
    space_id: number
    title: string
    type: ContentType
    content: string
    url: string | null
    created_at: string
}

/**
 * API response for creating content
 */
export interface CreateContentApiResponse {
    content: Content
    message: string
}

/**
 * API response for getting contents
 */
export interface GetContentsApiResponse {
    contents: Content[]
    count: number
    space_id: number
}

/**
 * Redux content state shape
 */
export interface ContentState {
    // Contents list for current space
    contents: Content[]

    // Current content being viewed/edited
    currentContent: Content | null

    // UI states
    loading: boolean
    error: string | null

    // Modal states
    isCreateModalOpen: boolean
    isEditModalOpen: boolean

    // Filter state
    selectedType: ContentType | 'all'

    // Current space ID
    currentSpaceId: number | null
}
