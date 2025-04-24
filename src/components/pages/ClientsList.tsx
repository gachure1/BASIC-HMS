import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Users, Search } from 'lucide-react';
import axios from 'axios';
import ClientCard from '../ui/ClientCard';
import ClientForm from '../forms/ClientForm';

const API_URL = 'http://localhost:3000/api';

interface Client {
  id: number;
  name: string;
  age: number;
  gender: string;
  contact: string;
  address: string;
  created_at: string;
}

const ClientsList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/clients`);
      setClients(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Failed to load clients. Please try again later.');
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      setLoading(true);
      const response = await axios.get(`${API_URL}/clients/search?q=${searchTerm}`);
      setSearchResults(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error searching clients:', err);
      setError('Failed to search clients. Please try again later.');
      setLoading(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!value.trim()) {
      setIsSearching(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClientSubmit = async (clientData: any) => {
    try {
      await axios.post(`${API_URL}/clients`, clientData);
      fetchClients();
      setShowForm(false);
    } catch (err) {
      console.error('Error creating client:', err);
      alert('Failed to create client. Please try again.');
    }
  };

  const displayedClients = isSearching ? searchResults : clients;

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
          <h1 className="text-3xl font-bold text-gray-800">Clients</h1>
          <p className="text-gray-600 mt-1">Manage and view all registered clients</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-150 ease-in-out"
        >
          <UserPlus size={20} />
          <span>Register Client</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-500 animate-fadeIn">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Register New Client</h2>
          <ClientForm onSubmit={handleClientSubmit} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search clients by name or ID..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              onKeyDown={handleSearchKeyDown}
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition duration-150 ease-in-out"
          >
            Search
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            <p>{error}</p>
          </div>
        )}

        {isSearching && searchResults.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-xl font-medium text-gray-700">No Clients Found</h3>
            <p className="mt-1 text-gray-500">
              No clients match your search criteria.
            </p>
            <button
              onClick={() => setIsSearching(false)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Show all clients
            </button>
          </div>
        )}

        {!isSearching && clients.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-xl font-medium text-gray-700">No Clients Registered</h3>
            <p className="mt-1 text-gray-500">
              Get started by registering a new client.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
              Register Client
            </button>
          </div>
        ) : (
          displayedClients.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedClients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onRefresh={fetchClients}
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ClientsList;