import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import PatientCard from '../components/common/PatientCard';
import MapView from '../components/dashboard/MapView';
import { AlertCircle, AlertTriangle, Calendar, Clock } from 'lucide-react';

const HospitalDashboard = () => {
  const { patients, vitalsData, emergencies, getPatientById } = useData();
  const navigate = useNavigate();
  const [activeEmergencies, setActiveEmergencies] = useState(emergencies.filter(e => e.status === 'active'));
  
  // Update emergencies when they change
  useEffect(() => {
    setActiveEmergencies(emergencies.filter(e => e.status === 'active'));
  }, [emergencies]);
  
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hospital Response Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Monitor patient emergencies and coordinate response
        </p>
      </div>
      
      {/* Emergency Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 flex items-center">
          <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900">
            <Calendar className="h-6 w-6 text-primary-600 dark:text-primary-300" />
          </div>
          <div className="ml-4">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Today's Date</h2>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 flex items-center">
          <div className="p-3 rounded-full bg-secondary-100 dark:bg-secondary-900">
            <Clock className="h-6 w-6 text-secondary-600 dark:text-secondary-300" />
          </div>
          <div className="ml-4">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Time</h2>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 flex items-center">
          <div className={`p-3 rounded-full ${
            activeEmergencies.length > 0 
              ? 'bg-accent-100 dark:bg-accent-900' 
              : 'bg-green-100 dark:bg-green-900'
          }`}>
            {activeEmergencies.length > 0 ? (
              <AlertTriangle className="h-6 w-6 text-accent-600 dark:text-accent-300" />
            ) : (
              <AlertCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
            )}
          </div>
          <div className="ml-4">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Emergencies</h2>
            <p className={`text-lg font-semibold ${
              activeEmergencies.length > 0
                ? 'text-accent-600 dark:text-accent-300'
                : 'text-green-600 dark:text-green-300'
            }`}>
              {activeEmergencies.length}
            </p>
          </div>
        </div>
      </div>
      
      {/* Active Emergencies Section */}
      <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Active Emergencies</h2>
        
        {activeEmergencies.length > 0 ? (
          <div className="space-y-6">
            {activeEmergencies.map((emergency) => {
              const patient = getPatientById(emergency.patientId);
              if (!patient) return null;
              
              return (
                <div key={emergency.id} className="border border-accent-300 dark:border-accent-800 rounded-lg overflow-hidden bg-accent-50 dark:bg-slate-800">
                  <div className="p-4 bg-accent-100 dark:bg-accent-900 border-b border-accent-300 dark:border-accent-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-accent-600 dark:text-accent-300" />
                        <h3 className="text-md font-medium text-accent-800 dark:text-accent-200">
                          {emergency.type === 'fall' 
                            ? 'Fall Detected' 
                            : `Abnormal ${emergency.type.charAt(0).toUpperCase() + emergency.type.slice(1)}`}
                        </h3>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-accent-200 dark:bg-accent-800 text-accent-800 dark:text-accent-300">
                        {new Date(emergency.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1">
                        <PatientCard patient={patient} showVitals={true} />
                      </div>
                      
                      <div className="md:col-span-2 flex flex-col space-y-4">
                        <div className="bg-white dark:bg-slate-700 p-4 rounded-lg shadow-inner">
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Emergency Details</h4>
                          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                            <div className="sm:col-span-1">
                              <dt className="text-xs text-gray-500 dark:text-gray-400">Heart Rate</dt>
                              <dd className="text-sm font-medium text-gray-900 dark:text-white">
                                {emergency.vitals.heartRate} bpm
                              </dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className="text-xs text-gray-500 dark:text-gray-400">Blood Oxygen</dt>
                              <dd className="text-sm font-medium text-gray-900 dark:text-white">
                                {emergency.vitals.bloodOxygen}%
                              </dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className="text-xs text-gray-500 dark:text-gray-400">Temperature</dt>
                              <dd className="text-sm font-medium text-gray-900 dark:text-white">
                                {emergency.vitals.temperature}°C
                              </dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className="text-xs text-gray-500 dark:text-gray-400">Blood Glucose</dt>
                              <dd className="text-sm font-medium text-gray-900 dark:text-white">
                                {emergency.vitals.bloodGlucose} mg/dL
                              </dd>
                            </div>
                          </dl>
                        </div>
                        
                        <div className="flex-1 min-h-[200px]">
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Patient Location & Route</h4>
                          <MapView 
                            patientLocation={emergency.location} 
                            showRoute={true}
                          />
                        </div>
                        
                        <div className="flex space-x-4">
                          <button
                            onClick={() => navigate(`/emergency/${emergency.patientId}`)}
                            className="flex-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                          >
                            Respond Now
                          </button>
                          <button
                            className="flex-1 inline-flex justify-center rounded-md border border-gray-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-700 text-base font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                          >
                            Dispatch Team
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
            <p className="text-green-800 dark:text-green-200">
              No active emergencies at this time.
            </p>
          </div>
        )}
      </div>
      
      {/* Monitored Patients */}
      <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">All Monitored Patients</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <div key={patient.id} className="relative">
              {vitalsData[patient.id]?.fallDetected && (
                <div className="absolute -top-2 -right-2 z-10">
                  <span className="flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-accent-500"></span>
                  </span>
                </div>
              )}
              <PatientCard patient={patient} showVitals={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;