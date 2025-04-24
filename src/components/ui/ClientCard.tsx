import React from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, ChevronRight } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

interface Client {
  id: number;
  name: string;
  age: number;
  gender: string;
  contact: string;
  address: string;
  created_at: string;
}

interface ClientCardProps {
  client: Client;
  onRefresh: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-5">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-800 truncate">{client.name}</h3>
            
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
              {client.gender && (
                <span>{client.gender}</span>
              )}
              
              {client.age && (
                <span>{client.age} years</span>
              )}
            </div>
            
            {client.contact && (
              <p className="mt-2 text-sm text-gray-600 truncate">{client.contact}</p>
            )}
            
            <div className="mt-3 flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Registered on {formatDate(client.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200">
        <div className="grid grid-cols-2 divide-x divide-gray-200">
          <Link 
            to={`/clients/${client.id}`}
            className="px-3 py-2 text-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-150"
          >
            View details
          </Link>
          <Link 
            to={`/clients/${client.id}/profile`}
            className="px-3 py-2 text-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-150 group inline-flex items-center justify-center"
          >
            <span>View profile</span>
            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-150" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;