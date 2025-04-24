import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Activity, Search, Users } from 'lucide-react';
import axios from 'axios';
import ProgramCard from '../ui/ProgramCard';
import ProgramForm from '../forms/ProgramForm';

const API_URL = 'http://localhost:3000/api';

interface Program {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

const ProgramsList = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/programs`);
      setPrograms(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError('Failed to load health programs. Please try again later.');
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (program.description && program.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleProgramSubmit = async (formData: { name: string; description: string }) => {
    try {
      await axios.post(`${API_URL}/programs`, formData);
      fetchPrograms();
      setShowForm(false);
    } catch (err) {
      console.error('Error creating program:', err);
      alert('Failed to create program. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Health Programs</h1>
          <p className="text-gray-600 mt-1">Manage and view all health programs</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-150 ease-in-out"
        >
          <PlusCircle size={20} />
          <span>New Program</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-500 animate-fadeIn">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Health Program</h2>
          <ProgramForm onSubmit={handleProgramSubmit} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search programs..."
            value={searchTerm}
            onChange={handleSearch}
            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            <p>{error}</p>
          </div>
        )}

        {filteredPrograms.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-xl font-medium text-gray-700">No Programs Found</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm ? 'No programs match your search criteria.' : 'Get started by creating a new health program.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle className="mr-2 h-5 w-5" aria-hidden="true" />
                Create Program
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPrograms.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onRefresh={fetchPrograms}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramsList;