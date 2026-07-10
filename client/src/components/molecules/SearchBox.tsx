import { protectedApi } from '@/services/api.service'
import { useEffect, useRef, useState } from 'react'
import { FiFileText, FiFolder, FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

interface SearchResult {
    result_type: 'space' | 'content'
    id: number
    space_id: number
    title: string
    snippet: string | null
    url: string | null
    content_type: string | null
}

interface SearchBoxProps {
    className?: string
    onNavigate?: () => void
}

const SearchBox = ({ className = '', onNavigate }: SearchBoxProps) => {
    const navigate = useNavigate()
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        const trimmed = query.trim()
        if (trimmed.length < 2) {
            setResults([])
            return
        }

        setLoading(true)
        const timer = window.setTimeout(async () => {
            try {
                const response = await protectedApi.search(trimmed)
                setResults(response.data || [])
                setIsOpen(true)
            } catch {
                setResults([])
            } finally {
                setLoading(false)
            }
        }, 300)

        return () => window.clearTimeout(timer)
    }, [query])

    const handleSelect = (result: SearchResult) => {
        navigate(`/dashboard/spaces/${result.space_id}`)
        setIsOpen(false)
        setQuery('')
        onNavigate?.()
    }

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <div className="flex items-center gap-2 rounded-full px-3 py-2 border border-border">
                <FiSearch size={16} className="text-muted shrink-0" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
                    placeholder="Search spaces and content..."
                    className="bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none w-full"
                />
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 max-w-[90vw] rounded-xl border border-border bg-card shadow-lg z-50 overflow-hidden max-h-80 overflow-y-auto">
                    {loading ? (
                        <p className="px-4 py-3 text-sm text-muted">Searching...</p>
                    ) : results.length > 0 ? (
                        results.map((result) => (
                            <button
                                key={`${result.result_type}-${result.id}`}
                                onClick={() => handleSelect(result)}
                                className="w-full text-left px-4 py-3 hover:bg-surface-container transition-colors border-b border-border last:border-b-0 flex items-start gap-3"
                            >
                                {result.result_type === 'space' ? (
                                    <FiFolder size={16} className="text-muted mt-0.5 shrink-0" />
                                ) : (
                                    <FiFileText size={16} className="text-muted mt-0.5 shrink-0" />
                                )}
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{result.title}</p>
                                    {result.snippet && (
                                        <p className="text-xs text-muted truncate">{result.snippet}</p>
                                    )}
                                </div>
                            </button>
                        ))
                    ) : (
                        <p className="px-4 py-3 text-sm text-muted">No results for "{query}"</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default SearchBox
