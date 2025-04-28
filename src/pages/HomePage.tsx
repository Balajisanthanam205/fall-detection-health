import { useNavigate } from 'react-router-dom';
import { Heart, Activity, AlertCircle, Map, Shield, Users } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight">
          MediGuard Health Monitoring
        </h1>
        <p className="mt-5 max-w-3xl mx-auto text-xl text-gray-500 dark:text-gray-400">
          Advanced wearable technology for real-time health monitoring and emergency response
        </p>
      </div>
      
      <div className="bg-white dark:bg-slate-800 overflow-hidden shadow rounded-lg mb-10">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <img
                src="https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg" 
                alt="Elderly person wearing health monitoring device"
                className="rounded-lg shadow-md w-full h-auto object-cover"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Smart Wearable Health Monitoring
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Our advanced wearable system continuously monitors vital health parameters of elderly individuals, 
                providing real-time data and immediate alerts in case of emergencies. The system is designed to 
                detect falls, monitor vital signs, and send precise location information to emergency responders.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate('/vitals')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  View Dashboard
                </button>
                <button
                  onClick={() => navigate('/hospital')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-slate-600 text-sm font-medium rounded-md text-gray-700 dark:text-white bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Hospital View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Key Features
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: <Heart className="h-8 w-8 text-primary-500" />,
            title: 'Real-Time Vital Monitoring',
            description: 'Continuous tracking of heart rate, blood oxygen, glucose levels, and body temperature.',
          },
          {
            icon: <AlertCircle className="h-8 w-8 text-accent-500" />,
            title: 'Fall Detection',
            description: 'Advanced sensors detect falls and automatically trigger emergency alerts.',
          },
          {
            icon: <Map className="h-8 w-8 text-secondary-500" />,
            title: 'GPS Location Tracking',
            description: 'Precise location tracking to help emergency responders locate patients quickly.',
          },
          {
            icon: <Activity className="h-8 w-8 text-primary-500" />,
            title: 'Health Analytics',
            description: 'Review historical data to detect patterns and prevent future emergencies.',
          },
          {
            icon: <Shield className="h-8 w-8 text-secondary-500" />,
            title: 'Secure Data Handling',
            description: 'End-to-end encryption ensures patient data is always protected.',
          },
          {
            icon: <Users className="h-8 w-8 text-primary-500" />,
            title: 'Multi-User Access',
            description: 'Authorized healthcare providers and family members can monitor patient status.',
          },
        ].map((feature, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 dark:bg-primary-900 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-primary-100 dark:bg-primary-900 rounded-lg shadow-inner overflow-hidden mb-12">
        <div className="px-4 py-10 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-200 mb-4">
            Keeping Loved Ones Safe
          </h2>
          <p className="max-w-2xl mx-auto text-primary-600 dark:text-primary-300 mb-6">
            Our smart wearable system gives peace of mind to family members and caregivers, 
            knowing that help is just moments away in case of an emergency.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate('/vitals')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Start Monitoring
            </button>
            <button
              className="inline-flex items-center px-6 py-3 border border-primary-500 text-base font-medium rounded-md text-primary-700 dark:text-primary-200 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;