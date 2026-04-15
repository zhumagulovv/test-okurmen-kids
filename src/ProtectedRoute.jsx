import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    const { data, loading } = useSelector((state) => state.session)

    if (loading) return <div>Loading</div>

    if (!data) {
        return <Navigate to="/entry-page" replace />
    }

    return children
}

export default ProtectedRoute
