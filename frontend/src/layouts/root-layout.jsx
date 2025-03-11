import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import { Button } from '../components/ui/button';

const RootLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <nav className="flex gap-6">
            <Link to="/" className="font-medium">Dashboard</Link>
            <Link to="/skills" className="font-medium">Skills</Link>
            <Link to="/profile" className="font-medium">Profile</Link>
          </nav>
          <div className="flex items-center gap-4">
            <span>{user?.name}</span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;