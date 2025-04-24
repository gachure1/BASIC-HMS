import React from 'react';
import { Link } from 'react-router-dom';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  linkTo: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, description, linkTo }) => {
  return (
    <Link 
      to={linkTo}
      className="bg-white rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg border border-gray-100 hover:border-blue-200"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-4">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value.toLocaleString()}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-500">{description}</p>
    </Link>
  );
};

export default StatsCard;