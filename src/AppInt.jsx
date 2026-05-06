import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { validateSession } from './features/auth/sessionSlice'

const AppInt = () => {
    const dispatch = useDispatch()
    const { data, loading } = useSelector((state) => state.session)
    const hasValidated = useRef(false)

    useEffect(() => {
        if (hasValidated.current || loading || data) return

        const key = localStorage.getItem('sessionKey')

        if (key) {
            hasValidated.current = true
            dispatch(validateSession(key))
        }
    }, [dispatch, loading, data])

    return null
}

export default AppInt
