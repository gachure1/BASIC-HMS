import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Users, ChevronRight } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

interface Program {
  id: number;
  name: string;
  description: string;
}

interface ProgramWithClients extends Program {
  clientCount: number;
}

const ProgramsList = () => {
  const [programs, setPrograms] = useState<ProgramWithClients[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgramsWithClientCount = async () => {
      try {
        setLoading(true);
        const programsRes = await axios.get(`${API_URL}/programs`);
        
        // Get client counts for each program (in parallel)
        const programsWithCounts = await Promise.all(
          programsRes.data.map(async (program: Program) => {
            try {
              const clientsRes = await axios.get(`${API_URL}/programs/${program.id}/clients`);
              return {
                ...program,
                clientCount: clientsRes.data.length
              };
            } catch (err) {
              console.error(`Error fetching clients for program ${program.id}:`, err);
              return {
                ...program,
                clientCount: 0
              };
            }
          })
        );
        
        setPrograms(programsWithCounts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError('Failed to load programs');
        setLoading(false);
      }
    };

    fetchProgramsWithClientCount();
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

  if (programs.length === 0) {
    return (
      <div className="text-center py-8">
        <Activity className="h-10 w-10 text-gray-400 mx-auto" />
        <p className="mt-2 text-gray-500">No programs created yet</p>
        <Link
          to="/programs/new"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Create a program
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {programs.map((program) => (
          <li key={program.id} className="py-4 hover:bg-gray-50 transition duration-150">
            <Link to={`/programs/${program.id}`} className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Activity className="h-5 w-5" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{program.name}</p>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3 text-gray-400" />
                  <p className="text-xs text-gray-500">
                    {program.clientCount} {program.clientCount === 1 ? 'client' : 'clients'} enrolled
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 text-gray-400">
                <ChevronRight className="h-5 w-5" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgramsList;