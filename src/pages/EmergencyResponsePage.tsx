import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import VitalsCard from '../components/dashboard/VitalsCard';
import MapView from '../components/dashboard/MapView';
import LiveChat from '../components/dashboard/LiveChat';
import { Clock, CheckCircle, XCircle, Phone, CalendarClock, MapPin, AlertTriangle } from 'lucide-react';

const EmergencyResponsePage = () => {
  const { id: patientId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { vitalsData, getPatientById, emergencies, resolveEmergency } = useData();
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  
  const patient = patientId ? getPatientById(patientId) : undefined;
  const vitals = patientId ? vitalsData[patientId] : undefined;
  
  // Get the relevant emergency
  const relevantEmergency = patientId 
    ? emergencies
        .filter(e => e.patientId === patientId && e.status === 'active')
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
    : undefined;
  
  // Countdown timer for response time
  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown]);
  
  // Format countdown time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle emergency resolution
  const handleResolveEmergency = () => {
    if (relevantEmergency) {
      resolveEmergency(relevantEmergency.id);
    }
    navigate('/hospital');
  };
  
  if (!patient || !vitals) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-accent-50 dark:bg-accent-900/30 p-4 rounded-lg border-l-4 border-accent-500 mb-6">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 text-accent-500 mr-2" />
          <h1 className="text-xl font-bold text-accent-800 dark:text-accent-200">
            Emergency Response: {patient.name}
          </h1>
          <div className="ml-auto flex items-center">
            <Clock className="h-5 w-5 text-accent-500 mr-1" />
            <span className={`font-mono ${countdown < 60 ? 'text-accent-600 dark:text-accent-300' : 'text-gray-600 dark:text-gray-300'}`}>
              {formatTime(countdown)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 space-y-6">
          {/* Patient Info Card */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Patient Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-slate-700">
                  <svg className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
                  <p className="text-md font-semibold text-gray-900 dark:text-white">{patient.name}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-slate-700">
                  <CalendarClock className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Age</p>
                  <p className="text-md font-semibold text-gray-900 dark:text-white">{patient.age} years old</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-slate-700">
                  <MapPin className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                  <p className="text-md font-semibold text-gray-900 dark:text-white">{patient.address}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-slate-700">
                  <Phone className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Emergency Contact</p>
                  <p className="text-md font-semibold text-gray-900 dark:text-white">{patient.emergencyContact}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Vital Signs */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Current Vital Signs</h2>
            
            <div className="space-y-4">
              <VitalsCard
                title="Heart Rate"
                value={vitals.heartRate}
                unit="bpm"
                icon="heart"
                isAlert={vitals.heartRate > 100 || vitals.heartRate < 60}
                lastUpdated={new Date(vitals.timestamp)}
                thresholds={{ low: 60, high: 100 }}
              />
              
              <VitalsCard
                title="Blood Oxygen"
                value={vitals.bloodOxygen}
                unit="%"
                icon="oxygen"
                isAlert={vitals.bloodOxygen < 90}
                lastUpdated={new Date(vitals.timestamp)}
                thresholds={{ low: 90 }}
              />
              
              <VitalsCard
                title="Blood Glucose"
                value={vitals.bloodGlucose}
                unit="mg/dL"
                icon="glucose"
                isAlert={vitals.bloodGlucose > 130 || vitals.bloodGlucose < 70}
                lastUpdated={new Date(vitals.timestamp)}
                thresholds={{ low: 70, high: 130 }}
              />
              
              <VitalsCard
                title="Body Temperature"
                value={vitals.temperature}
                unit="°C"
                icon="temperature"
                isAlert={vitals.temperature > 38 || vitals.temperature < 36}
                lastUpdated={new Date(vitals.timestamp)}
                thresholds={{ low: 36, high: 38 }}
              />
              
              <VitalsCard
                title="Fall Detection"
                value={vitals.fallDetected}
                icon="fall"
                isAlert={vitals.fallDetected}
                lastUpdated={new Date(vitals.timestamp)}
              />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          {/* Emergency Details */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Emergency Details</h2>
            
            <div className="space-y-4">
              <div className="bg-accent-50 dark:bg-accent-900/20 p-4 rounded-lg">
                <h3 className="font-medium text-accent-800 dark:text-accent-200 mb-2">
                  Emergency Type: {relevantEmergency ? (
                    relevantEmergency.type === 'fall' 
                      ? 'Fall Detected' 
                      : `Abnormal ${relevantEmergency.type.charAt(0).toUpperCase() + relevantEmergency.type.slice(1)}`
                  ) : 'Unknown'}
                </h3>
                <p className="text-sm text-accent-700 dark:text-accent-300">
                  {relevantEmergency ? new Date(relevantEmergency.timestamp).toLocaleString() : 'Time unknown'}
                </p>
              </div>
              
              <div className="h-64">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Patient Location</h3>
                <MapView 
                  patientLocation={vitals.location} 
                  showRoute={true} 
                />
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Response Actions</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleResolveEmergency}
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Resolve Emergency
                </button>
                
                <button
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Call Emergency Services
                </button>
              </div>
            </div>
          </div>
          
          {/* Live Chat */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Live Communication</h2>
            
            <div className="h-96">
              <LiveChat patientName={patient.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResponsePage;