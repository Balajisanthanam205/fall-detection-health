import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <AlertCircle className="h-12 w-12 text-accent-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Page Not Found
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;