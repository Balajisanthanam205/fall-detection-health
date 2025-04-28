import { User, Phone, CalendarClock } from 'lucide-react';
import { Patient } from '../../context/DataContext';
import { Link } from 'react-router-dom';

interface PatientCardProps {
  patient: Patient;
  showVitals?: boolean;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, showVitals = false }) => {
  return (
    <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Patient Information
        </h3>
        <Link
          to={`/vitals?patient=${patient.id}`}
          className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
        >
          {showVitals ? 'View Details' : 'View Vitals'}
        </Link>
      </div>
      <div className="border-t border-gray-200 dark:border-slate-700 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200 sm:dark:divide-slate-700">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
              <User className="h-4 w-4 mr-1" />
              Name
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
              {patient.name}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
              <CalendarClock className="h-4 w-4 mr-1" />
              Age
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
              {patient.age} years old
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
              <Phone className="h-4 w-4 mr-1" />
              Emergency Contact
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
              {patient.emergencyContact}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default PatientCard;