import { Toaster } from 'sonner';
import Navbar from './navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-blue-950">
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>
      <Toaster 
        theme="dark" 
        className="dark"
        toastOptions={{
          style: {
            background: 'hsl(222 47% 11%)',
            color: 'hsl(214 32% 91%)',
            border: '1px solid hsl(217.2 32.6% 17.5%)',
          },
        }}
      />
    </div>
  );
};

export default Layout;