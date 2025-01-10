import React from 'react';
import Dashboard from './components/Dashboard';
import AdminButton from './components/AdminButton';
import AdminLogin from './components/AdminLogin';
import { TimelineProvider } from './context/TimelineContext';
import { db } from './lib/database/azure';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [showAdminLogin, setShowAdminLogin] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [dbError, setDbError] = React.useState<string | null>(null);
  const [isConnecting, setIsConnecting] = React.useState(true);

  React.useEffect(() => {
    const initDb = async () => {
      try {
        setIsConnecting(true);
        await db.connect();
        setDbError(null);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to connect to database';
        setDbError(message);
      } finally {
        setIsConnecting(false);
      }
    };

    initDb();
  }, []);

  const handleLogin = () => {
    setIsAdmin(true);
    setShowAdminLogin(false);
  };

  const handleCloseLogin = () => {
    setShowAdminLogin(false);
  };

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600">Connecting to database...</p>
          </div>
        </div>
      </div>
    );
  }

  if (dbError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <h1 className="text-xl font-semibold text-red-600">Database Connection Error</h1>
          </div>
          <p className="text-gray-600 mb-4">{dbError}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <TimelineProvider>
      <Dashboard isAdmin={isAdmin} />
      <AdminButton 
        onClick={() => setShowAdminLogin(true)} 
        className={isAdmin ? 'hidden' : ''} 
      />
      {showAdminLogin && (
        <AdminLogin 
          onLogin={handleLogin} 
          onClose={handleCloseLogin} 
        />
      )}
    </TimelineProvider>
  );
}