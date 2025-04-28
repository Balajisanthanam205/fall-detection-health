import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300">
              About
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300">
              Privacy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300">
              Terms
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300">
              Support
            </a>
          </div>
          
          <div className="mt-8 md:mt-0 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">© 2025 MediGuard. All rights reserved.</span>
            <Heart className="ml-2 h-4 w-4 text-primary-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;