import { Line } from 'react-chartjs-2';
import { VitalData } from '../../context/DataContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface VitalsChartProps {
  historicalData: VitalData[];
  vitalType: 'heartRate' | 'bloodOxygen' | 'bloodGlucose' | 'temperature';
  title: string;
  thresholds?: {
    low?: number;
    high?: number;
  };
}

const VitalsChart: React.FC<VitalsChartProps> = ({
  historicalData,
  vitalType,
  title,
  thresholds,
}) => {
  // Sort data by timestamp
  const sortedData = [...historicalData].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  // Extract data for the specific vital type
  const labels = sortedData.map(item => 
    new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  
  const dataPoints = sortedData.map(item => item[vitalType]);
  
  // Define chart data
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data: dataPoints,
        borderColor: getLineColor(vitalType),
        backgroundColor: `${getLineColor(vitalType)}33`, // Add transparency
        tension: 0.3,
        fill: true,
      },
    ],
  };
  
  // If thresholds are provided, add threshold lines
  if (thresholds) {
    if (thresholds.low !== undefined) {
      chartData.datasets.push({
        label: 'Lower Threshold',
        data: Array(labels.length).fill(thresholds.low),
        borderColor: '#EF4444',
        borderDash: [5, 5],
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false,
      });
    }
    
    if (thresholds.high !== undefined) {
      chartData.datasets.push({
        label: 'Upper Threshold',
        data: Array(labels.length).fill(thresholds.high),
        borderColor: '#EF4444',
        borderDash: [5, 5],
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false,
      });
    }
  }
  
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      legend: {
        labels: {
          usePointStyle: true,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: false,
        min: getYAxisMin(vitalType, Math.min(...dataPoints), thresholds?.low),
        max: getYAxisMax(vitalType, Math.max(...dataPoints), thresholds?.high),
      },
    },
  };
  
  return (
    <div className="h-64 md:h-72 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{title}</h3>
      <div className="h-[calc(100%-30px)]">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

// Helper functions
function getLineColor(vitalType: string): string {
  switch (vitalType) {
    case 'heartRate':
      return '#EF4444'; // Red
    case 'bloodOxygen':
      return '#0EA5E9'; // Sky blue
    case 'bloodGlucose':
      return '#10B981'; // Emerald
    case 'temperature':
      return '#F59E0B'; // Amber
    default:
      return '#6366F1'; // Indigo
  }
}

function getYAxisMin(vitalType: string, minValue: number, threshold?: number): number {
  const buffer = 0.1 * minValue; // 10% buffer
  let min: number;
  
  switch (vitalType) {
    case 'heartRate':
      min = Math.min(40, minValue - buffer);
      break;
    case 'bloodOxygen':
      min = Math.min(85, minValue - buffer);
      break;
    case 'bloodGlucose':
      min = Math.min(60, minValue - buffer);
      break;
    case 'temperature':
      min = Math.min(35, minValue - buffer);
      break;
    default:
      min = minValue - buffer;
  }
  
  // If threshold is provided and lower than calculated min, use it
  if (threshold !== undefined && threshold < min) {
    min = threshold - (0.1 * threshold);
  }
  
  return min;
}

function getYAxisMax(vitalType: string, maxValue: number, threshold?: number): number {
  const buffer = 0.1 * maxValue; // 10% buffer
  let max: number;
  
  switch (vitalType) {
    case 'heartRate':
      max = Math.max(120, maxValue + buffer);
      break;
    case 'bloodOxygen':
      max = 100; // Oxygen saturation max is 100%
      break;
    case 'bloodGlucose':
      max = Math.max(140, maxValue + buffer);
      break;
    case 'temperature':
      max = Math.max(39, maxValue + buffer);
      break;
    default:
      max = maxValue + buffer;
  }
  
  // If threshold is provided and higher than calculated max, use it
  if (threshold !== undefined && threshold > max) {
    max = threshold + (0.1 * threshold);
  }
  
  return max;
}

export default VitalsChart;