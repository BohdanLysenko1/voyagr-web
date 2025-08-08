import { Plane, Route, Globe, MapPin } from 'lucide-react';

interface StatItem {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}

interface ProfileStatsProps {
  stats?: {
    voyages: number;
    miles: number;
    countries: number;
    cities: number;
  };
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  // Default stats - in a real app, this would come from props or API
  const defaultStats = {
    voyages: 42,
    miles: 432000,
    countries: 35,
    cities: 38
  };

  const userData = stats || defaultStats;

  const statItems: StatItem[] = [
    {
      icon: <Plane className="w-6 h-6" />,
      value: userData.voyages.toString(),
      label: 'Voyages',
      color: 'text-blue-600'
    },
    {
      icon: <Route className="w-6 h-6" />,
      value: `${(userData.miles / 1000).toFixed(0)}K`,
      label: 'Miles',
      color: 'text-green-600'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      value: userData.countries.toString(),
      label: 'Countries',
      color: 'text-purple-600'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      value: userData.cities.toString(),
      label: 'Cities',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {statItems.map((stat, index) => (
        <div
          key={index}
          className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors duration-200"
        >
          <div className={`flex justify-center mb-2 ${stat.color}`}>
            {stat.icon}
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-gray-600">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
