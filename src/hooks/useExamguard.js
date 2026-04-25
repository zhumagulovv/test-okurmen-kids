import { useEffect, useRef, useCallback } from 'react'

/**
 * Locks browser back/forward buttons during the exam.
 * Uses History API pushState loop to neutralize popstate events.
 *
 * @param {boolean} isActive  - Enable/disable the guard
 * @param {function} onIntercepted - Optional callback when back/forward is blocked
 */
export function useExamGuard({ isActive = true, onIntercepted } = {}) {
    const isLocked = useRef(isActive)

    // Keep ref in sync so the popstate handler never has a stale value
    useEffect(() => {
        isLocked.current = isActive
    }, [isActive])

    // ── History API trap ──────────────────────────────────────────────────────
    useEffect(() => {
        if (!isActive) return

        const pushTrap = () => {
            // Always inject a new entry so the browser has somewhere to "go back" to,
            // but we immediately intercept that popstate and re-inject.
            window.history.pushState({ exam: true }, '', window.location.href)
        }

        pushTrap() // seed the first entry

        const onPopState = (event) => {
            if (!isLocked.current) return
            pushTrap() // neutralize — user stays on same page
            onIntercepted?.({ type: 'popstate', state: event.state })
        }

        window.addEventListener('popstate', onPopState)
        return () => window.removeEventListener('popstate', onPopState)
    }, [isActive, onIntercepted])

    // ── beforeunload — prevent tab close / refresh ────────────────────────────
    useEffect(() => {
        if (!isActive) return

        const onBeforeUnload = (e) => {
            e.preventDefault()
            e.returnValue = '' // modern browsers show a generic confirm dialog
        }

        window.addEventListener('beforeunload', onBeforeUnload)
        return () => window.removeEventListener('beforeunload', onBeforeUnload)
    }, [isActive])

    // Call this when the exam ends to release all locks before navigating away
    const releaseGuard = useCallback(() => {
        isLocked.current = false
    }, [])

    return { releaseGuard }
}