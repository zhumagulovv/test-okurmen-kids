import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { Loading } from './components/common/loading'

const ProtectedRoute = ({ children }) => {
    const { data, loading } = useSelector((state) => state.session)

    if (loading) return <Loading />

    if (!data) {
        return <Navigate to="/entry-page" replace />
    }

    return children
}

export default ProtectedRoute
