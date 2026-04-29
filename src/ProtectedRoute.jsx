import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { Loading } from './components/common/loading'

const ProtectedRoute = ({ children }) => {
    const { data, loading } = useSelector((state) => state.session)

    const hasKey = !!localStorage.getItem("sessionKey")

    if (loading && hasKey) return <Loading />

    if (!data) {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute
