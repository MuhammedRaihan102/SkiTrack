import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppRoutes from './routes';
import { AuthProvider } from './context/auth-context';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster richColors />
      </AuthProvider>
    </Router>
  );
};

export default App;
