import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import VitalsCard from '../components/dashboard/VitalsCard';
import VitalsChart from '../components/dashboard/VitalsChart';
import AlertBox from '../components/dashboard/AlertBox';
import PatientCard from '../components/common/PatientCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import MapView from '../components/dashboard/MapView';
import LiveChat from '../components/dashboard/LiveChat';

const VitalsDashboard = () => {
  const { patients, vitalsData, historicalData, emergencies, getPatientById } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  
  // Parse patient ID from query parameter if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const patientId = params.get('patient');
    
    if (patientId && patients.some(p => p.id === patientId)) {
      setSelectedPatientId(patientId);
    } else if (patients.length > 0) {
      // Default to first patient if none specified
      setSelectedPatientId(patients[0].id);
    }
  }, [location.search, patients]);
  
  // If no patient is selected or found, return loading
  if (!selectedPatientId || !vitalsData[selectedPatientId]) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  const currentVitals = vitalsData[selectedPatientId];
  const patientHistory = historicalData[selectedPatientId] || [];
  const patient = getPatientById(selectedPatientId)!;
  const activeEmergency = emergencies
    .filter(e => e.status === 'active' && e.patientId === selectedPatientId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  
  const handleRespondToEmergency = () => {
    navigate(`/emergency/${selectedPatientId}`);
  };
  
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Patient Health Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Real-time health monitoring and emergency alerts
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">Select Patient:</div>
            <select
              value={selectedPatientId}
              onChange={(e) => {
                setSelectedPatientId(e.target.value);
                navigate(`/vitals?patient=${e.target.value}`);
              }}
              className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
            >
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Alert Banner - Only show if there's an active emergency */}
      {activeEmergency && (
        <div className="mb-6">
          <AlertBox
            alert={activeEmergency}
            patientName={patient.name}
            onRespond={handleRespondToEmergency}
          />
        </div>
      )}
      
      {/* Patient Information and Vital Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <PatientCard patient={patient} />
          
          <div className="mt-6">
            <button
              onClick={() => setShowChat(!showChat)}
              className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:w-auto sm:text-sm"
            >
              {showChat ? 'Hide Chat' : 'Open Chat'}
            </button>
          </div>
          
          {showChat && (
            <div className="mt-4 h-96">
              <LiveChat
                patientName={patient.name}
                onClose={() => setShowChat(false)}
              />
            </div>
          )}
        </div>
        
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <VitalsCard
              title="Heart Rate"
              value={currentVitals.heartRate}
              unit="bpm"
              icon="heart"
              isAlert={currentVitals.heartRate > 100 || currentVitals.heartRate < 60}
              lastUpdated={new Date(currentVitals.timestamp)}
              thresholds={{ low: 60, high: 100 }}
            />
            
            <VitalsCard
              title="Blood Oxygen"
              value={currentVitals.bloodOxygen}
              unit="%"
              icon="oxygen"
              isAlert={currentVitals.bloodOxygen < 90}
              lastUpdated={new Date(currentVitals.timestamp)}
              thresholds={{ low: 90 }}
            />
            
            <VitalsCard
              title="Blood Glucose"
              value={currentVitals.bloodGlucose}
              unit="mg/dL"
              icon="glucose"
              isAlert={currentVitals.bloodGlucose > 130 || currentVitals.bloodGlucose < 70}
              lastUpdated={new Date(currentVitals.timestamp)}
              thresholds={{ low: 70, high: 130 }}
            />
            
            <VitalsCard
              title="Body Temperature"
              value={currentVitals.temperature}
              unit="°C"
              icon="temperature"
              isAlert={currentVitals.temperature > 38 || currentVitals.temperature < 36}
              lastUpdated={new Date(currentVitals.timestamp)}
              thresholds={{ low: 36, high: 38 }}
            />
          </div>
          
          <div className="mt-6">
            <VitalsCard
              title="Fall Detection"
              value={currentVitals.fallDetected}
              icon="fall"
              isAlert={currentVitals.fallDetected}
              lastUpdated={new Date(currentVitals.timestamp)}
            />
          </div>
        </div>
      </div>
      
      {/* Tabs for Charts and Map */}
      <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 mb-8">
        <Tabs defaultValue="charts">
          <TabsList>
            <TabsTrigger value="charts">Vital History</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>
          
          <TabsContent value="charts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <VitalsChart
                historicalData={patientHistory}
                vitalType="heartRate"
                title="Heart Rate History"
                thresholds={{ low: 60, high: 100 }}
              />
              
              <VitalsChart
                historicalData={patientHistory}
                vitalType="bloodOxygen"
                title="Blood Oxygen History"
                thresholds={{ low: 90 }}
              />
              
              <VitalsChart
                historicalData={patientHistory}
                vitalType="bloodGlucose"
                title="Blood Glucose History"
                thresholds={{ low: 70, high: 130 }}
              />
              
              <VitalsChart
                historicalData={patientHistory}
                vitalType="temperature"
                title="Temperature History"
                thresholds={{ low: 36, high: 38 }}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="location">
            <div className="h-96 mt-6">
              <MapView patientLocation={currentVitals.location} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VitalsDashboard;