import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { validateSession } from './features/auth/sessionSlice'

const AppInt = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const key = localStorage.getItem('sessionKey')

        if (key) {
            dispatch(validateSession(key))
        }
    }, [dispatch])

    return null
}

export default AppInt
