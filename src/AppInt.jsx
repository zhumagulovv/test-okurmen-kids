import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { validateSession } from './features/auth/sessionSlice'

let validationStarted = false

const AppInt = () => {
    const dispatch = useDispatch()
    const { data, loading } = useSelector((state) => state.session)

    useEffect(() => {
        if (validationStarted || loading || data) return

        const key = localStorage.getItem('sessionKey')

        if (key) {
            validationStarted = true
            dispatch(validateSession(key))
        }
    }, [dispatch, loading, data])

    return null
}

export default AppInt
