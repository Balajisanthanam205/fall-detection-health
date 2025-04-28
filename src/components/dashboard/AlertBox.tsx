import { EmergencyAlert } from '../../context/DataContext';
import { AlertTriangle, MapPin, Zap, Phone } from 'lucide-react';

interface AlertBoxProps {
  alert: EmergencyAlert;
  patientName: string;
  onRespond: () => void;
}

const AlertBox: React.FC<AlertBoxProps> = ({ alert, patientName, onRespond }) => {
  const getAlertTypeInfo = () => {
    switch (alert.type) {
      case 'fall':
        return {
          title: 'Fall Detected',
          icon: <AlertTriangle className="h-6 w-6 text-accent-500" />,
          description: 'Patient has experienced a fall and may need immediate assistance.',
        };
      case 'heartRate':
        return {
          title: 'Abnormal Heart Rate',
          icon: <Zap className="h-6 w-6 text-accent-500" />,
          description: `Heart rate is ${alert.vitals.heartRate} bpm, which is outside the normal range.`,
        };
      case 'bloodOxygen':
        return {
          title: 'Low Blood Oxygen',
          icon: <AlertTriangle className="h-6 w-6 text-accent-500" />,
          description: `Blood oxygen level is ${alert.vitals.bloodOxygen}%, which is below the normal range.`,
        };
      case 'bloodGlucose':
        return {
          title: 'Abnormal Blood Glucose',
          icon: <AlertTriangle className="h-6 w-6 text-accent-500" />,
          description: `Blood glucose level is ${alert.vitals.bloodGlucose} mg/dL, which is outside the normal range.`,
        };
      case 'temperature':
        return {
          title: 'Abnormal Temperature',
          icon: <AlertTriangle className="h-6 w-6 text-accent-500" />,
          description: `Body temperature is ${alert.vitals.temperature}°C, which is outside the normal range.`,
        };
      default:
        return {
          title: 'Emergency Alert',
          icon: <AlertTriangle className="h-6 w-6 text-accent-500" />,
          description: 'An emergency situation has been detected.',
        };
    }
  };

  const alertInfo = getAlertTypeInfo();

  return (
    <div className="bg-accent-50 dark:bg-slate-800 border-l-4 border-accent-500 rounded-md overflow-hidden shadow-md animate-pulse-fast">
      <div className="p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {alertInfo.icon}
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-accent-800 dark:text-accent-300">
              {alertInfo.title}
            </h3>
            <div className="mt-2 text-sm text-accent-700 dark:text-accent-200">
              <p>{alertInfo.description}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <div className="font-medium mr-2">Patient:</div>
              <div>{patientName}</div>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <div className="font-medium mr-2">Time:</div>
              <div>{new Date(alert.timestamp).toLocaleString()}</div>
            </div>
            
            <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
              <MapPin className="h-5 w-5 mr-1 flex-shrink-0 text-gray-500 dark:text-gray-400" />
              <div>
                <span className="font-medium">Location: </span>
                <span>Lat: {alert.location.lat.toFixed(6)}, Lng: {alert.location.lng.toFixed(6)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
          <button
            type="button"
            onClick={onRespond}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
          >
            Respond Now
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600"
          >
            <Phone className="h-4 w-4 mr-2" />
            Call Emergency
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertBox;