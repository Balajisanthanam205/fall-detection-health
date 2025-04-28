import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  address: string;
  emergencyContact: string;
  deviceId: string;
}

export interface VitalData {
  timestamp: Date;
  heartRate: number;
  bloodOxygen: number;
  bloodGlucose: number;
  temperature: number;
  fallDetected: boolean;
  patientId: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface EmergencyAlert {
  id: string;
  patientId: string;
  timestamp: Date;
  status: 'active' | 'resolved';
  type: 'fall' | 'heartRate' | 'bloodOxygen' | 'bloodGlucose' | 'temperature';
  location: {
    lat: number;
    lng: number;
  };
  vitals: VitalData;
}

interface DataContextType {
  patients: Patient[];
  vitalsData: Record<string, VitalData>;
  historicalData: Record<string, VitalData[]>;
  emergencies: EmergencyAlert[];
  addEmergency: (emergency: EmergencyAlert) => void;
  resolveEmergency: (id: string) => void;
  getPatientById: (id: string) => Patient | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock patients
const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'John Doe',
    age: 78,
    gender: 'male',
    address: '123 Oak Street, Springfield',
    emergencyContact: '+1 (555) 123-4567',
    deviceId: 'd1',
  },
  {
    id: 'p2',
    name: 'Jane Smith',
    age: 72,
    gender: 'female',
    address: '456 Maple Avenue, Rivertown',
    emergencyContact: '+1 (555) 987-6543',
    deviceId: 'd2',
  },
  {
    id: 'p3',
    name: 'Robert Johnson',
    age: 85,
    gender: 'male',
    address: '789 Pine Road, Lakeside',
    emergencyContact: '+1 (555) 456-7890',
    deviceId: 'd3',
  },
];

// Function to generate random vital data
const generateRandomVitals = (patientId: string, fallDetected = false): VitalData => {
  // Random location around a central point
  const centerLat = 37.7749;
  const centerLng = -122.4194;
  const lat = centerLat + (Math.random() - 0.5) * 0.02;
  const lng = centerLng + (Math.random() - 0.5) * 0.02;

  return {
    timestamp: new Date(),
    heartRate: Math.floor(Math.random() * 40) + 60, // 60-100 bpm
    bloodOxygen: Math.floor(Math.random() * 10) + 90, // 90-100%
    bloodGlucose: Math.floor(Math.random() * 50) + 70, // 70-120 mg/dL
    temperature: +(Math.random() * 2 + 36).toFixed(1), // 36-38°C
    fallDetected: fallDetected,
    patientId,
    location: {
      lat,
      lng,
    },
  };
};

const generateHistoricalData = (patientId: string, hours = 24): VitalData[] => {
  const data: VitalData[] = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      ...generateRandomVitals(patientId),
      timestamp,
    });
  }
  
  return data;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients] = useState<Patient[]>(MOCK_PATIENTS);
  const [vitalsData, setVitalsData] = useState<Record<string, VitalData>>({});
  const [historicalData, setHistoricalData] = useState<Record<string, VitalData[]>>({});
  const [emergencies, setEmergencies] = useState<EmergencyAlert[]>([]);

  // Initialize historical data
  useEffect(() => {
    const initialHistoricalData: Record<string, VitalData[]> = {};
    patients.forEach(patient => {
      initialHistoricalData[patient.id] = generateHistoricalData(patient.id);
    });
    setHistoricalData(initialHistoricalData);
  }, [patients]);

  // Simulate real-time data updates
  useEffect(() => {
    const updateVitals = () => {
      const newVitalsData: Record<string, VitalData> = {};
      
      patients.forEach(patient => {
        // 5% chance of fall detection for demonstration purposes
        const fallDetected = Math.random() < 0.05;
        const newVitalData = generateRandomVitals(patient.id, fallDetected);
        newVitalsData[patient.id] = newVitalData;
        
        // Add to historical data
        setHistoricalData(prev => ({
          ...prev,
          [patient.id]: [...(prev[patient.id] || []), newVitalData].slice(-24), // Keep last 24 entries
        }));
        
        // Create emergency if fall detected or vitals are outside normal range
        if (
          fallDetected ||
          newVitalData.heartRate > 100 || newVitalData.heartRate < 50 ||
          newVitalData.bloodOxygen < 90 ||
          newVitalData.bloodGlucose > 130 || newVitalData.bloodGlucose < 70 ||
          newVitalData.temperature > 38 || newVitalData.temperature < 36
        ) {
          let type: EmergencyAlert['type'] = 'heartRate';
          
          if (fallDetected) type = 'fall';
          else if (newVitalData.heartRate > 100 || newVitalData.heartRate < 50) type = 'heartRate';
          else if (newVitalData.bloodOxygen < 90) type = 'bloodOxygen';
          else if (newVitalData.bloodGlucose > 130 || newVitalData.bloodGlucose < 70) type = 'bloodGlucose';
          else if (newVitalData.temperature > 38 || newVitalData.temperature < 36) type = 'temperature';
          
          const newEmergency: EmergencyAlert = {
            id: `e${Date.now()}`,
            patientId: patient.id,
            timestamp: new Date(),
            status: 'active',
            type,
            location: newVitalData.location,
            vitals: newVitalData,
          };
          
          setEmergencies(prev => [...prev, newEmergency]);
        }
      });
      
      setVitalsData(newVitalsData);
    };
    
    // Update initial data
    updateVitals();
    
    // Set interval for updates
    const intervalId = setInterval(updateVitals, 15000); // Update every 15 seconds
    
    return () => clearInterval(intervalId);
  }, [patients]);

  const addEmergency = (emergency: EmergencyAlert) => {
    setEmergencies(prev => [...prev, emergency]);
  };

  const resolveEmergency = (id: string) => {
    setEmergencies(prev =>
      prev.map(emergency =>
        emergency.id === id ? { ...emergency, status: 'resolved' } : emergency
      )
    );
  };

  const getPatientById = (id: string) => {
    return patients.find(patient => patient.id === id);
  };

  return (
    <DataContext.Provider
      value={{
        patients,
        vitalsData,
        historicalData,
        emergencies,
        addEmergency,
        resolveEmergency,
        getPatientById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};