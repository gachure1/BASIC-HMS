import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, CalendarDays, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { formatDate } from '../../utils/dateUtils';

const API_URL = 'http://localhost:3000/api';

interface Client {
  id: number;
  name: string;
  age: number;
  gender: string;
  contact: string;
  created_at: string;
}

const RecentClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecentClients = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/clients`);
        // Sort by creation date (newest first) and take top 5
        const sortedClients = response.data
          .sort((a: Client, b: Client) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          .slice(0, 5);
        setClients(sortedClients);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recent clients:', err);
        setError('Failed to load recent clients');
        setLoading(false);
      }
    };

    fetchRecentClients();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="h-10 w-10 text-gray-400 mx-auto" />
        <p className="mt-2 text-gray-500">No clients registered yet</p>
        <Link
          to="/clients/new"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Register a client
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {clients.map((client) => (
          <li key={client.id} className="py-4 hover:bg-gray-50 transition duration-150">
            <Link to={`/clients/${client.id}`} className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User className="h-5 w-5" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{client.name}</p>
                <div className="flex items-center space-x-1">
                  <CalendarDays className="h-3 w-3 text-gray-400" />
                  <p className="text-xs text-gray-500">
                    {formatDate(client.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 text-gray-400">
                <ArrowRight className="h-5 w-5" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentClients;