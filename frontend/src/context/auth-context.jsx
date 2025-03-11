import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch('http://localhost:5000/api/auth/me', {
                    headers: {
                        'x-auth-token': token
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    };

    const login = async (credentials) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                setUser(data.user);
                toast.success('Logged in successfully');
                navigate('/');
            } else {
                toast.error(data.message || 'Login failed');
            }
        } catch (error) {
            toast.error('Login failed');
            console.error('Login error:', error);
        }
    };

    const logout = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/logout', {
                method: 'POST',
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });
            
            if (response.ok) {
                localStorage.removeItem('token');
                setUser(null);
                toast.success('Logged out successfully');
                navigate('/login');
            }
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Logout failed');
        }
    };

    const register = async (userData) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                setUser(data.user);
                toast.success('Registration successful');
                navigate('/');
            } else {
                toast.error(data.message || 'Registration failed');
            }
        } catch (error) {
            toast.error('Registration failed');
            console.error('Registration error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};