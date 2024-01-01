import { Navigate } from 'react-router-dom';
import { useAuth } from  './AuthContext'; 

const ProtectedRoute = ({ children }) => {
    const { authToken } = useAuth();

    if (!authToken) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute