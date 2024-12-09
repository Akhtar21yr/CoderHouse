import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Navigation from './components/shared/Navigation/Navigation';
import Authenticate from './pages/Authenticate/Authenticate';
import Activate from './pages/Activate/Activate';
import Rooms from './pages/Rooms/Rooms';
import { useSelector } from 'react-redux';
import useLoadingWithRefresh from './hooks/useLoadingWithRefresh';
import Loader from './components/shared/Loader/Loader';
import Room from './pages/Room/Room';

function App() {
    const {loading}=useLoadingWithRefresh()
    
    
    
    return (
        loading ? <Loader message='Loading... Please Wait !' /> :
            (<BrowserRouter>
                <Navigation />
                <Routes>
                    <Route path="/" element={<GuestRoute><Home /></GuestRoute>} />
                    <Route path="/authenticate" element={<GuestRoute><Authenticate /></GuestRoute>} />
                    <Route path="/activate" element={<SemiProtectedRoute><Activate /></SemiProtectedRoute>} />
                    <Route path="/rooms" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
                    <Route path='/room/:id' element={<ProtectedRoute><Room/></ProtectedRoute>} />
                </Routes>
            </BrowserRouter>)
    );
}

const GuestRoute = ({ children }) => {
    const { isAuth } = useSelector((state) => state.authSlice);
    return isAuth ? (
        <Navigate to="/rooms" />
    ) : (
        children
    );
};

const SemiProtectedRoute = ({ children }) => {
    const { user, isAuth } = useSelector((state) => state.authSlice);
    if (!isAuth) {
        return <Navigate to="/" />;
    }
    if (isAuth && !user.activated) {
        return children;
    }
    return <Navigate to="/rooms" />;
};

const ProtectedRoute = ({ children }) => {
    const { user, isAuth } = useSelector((state) => state.authSlice);
    console.log({user,isAuth})
    if (!isAuth) {
        return <Navigate to="/" />;
    }
    if (isAuth && !user.activated) {
        return <Navigate to="/activate" />;
    }
    return children;
};

export default App;
