import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Activity, PlusCircle, Stethoscope } from 'lucide-react';
import axios from 'axios';
import StatsCard from '../ui/StatsCard';
import RecentClients from '../widgets/RecentClients';
import ProgramsList from '../widgets/ProgramsList';

const API_URL = 'http://localhost:3000/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalPrograms: 0,
    totalEnrollments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [clientsRes, programsRes, enrollmentsRes] = await Promise.all([
          axios.get(`${API_URL}/clients`),
          axios.get(`${API_URL}/programs`),
          axios.get(`${API_URL}/enrollments`)
        ]);

        setStats({
          totalClients: clientsRes.data.length,
          totalPrograms: programsRes.data.length,
          totalEnrollments: enrollmentsRes.data.length
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to the HealthTrack Information System</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Clients" 
          value={stats.totalClients} 
          icon={<Users className="h-8 w-8 text-blue-500" />}
          description="Total registered clients"
          linkTo="/clients"
        />
        
        <StatsCard 
          title="Health Programs" 
          value={stats.totalPrograms} 
          icon={<Activity className="h-8 w-8 text-emerald-500" />}
          description="Active health programs"
          linkTo="/programs"
        />
        
        <StatsCard 
          title="Active Enrollments" 
          value={stats.totalEnrollments} 
          icon={<Stethoscope className="h-8 w-8 text-purple-500" />}
          description="Client program enrollments"
          linkTo="/clients"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Clients</h2>
            <Link 
              to="/clients" 
              className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
            >
              View all
            </Link>
          </div>
          <RecentClients />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Health Programs</h2>
            <Link 
              to="/programs" 
              className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
            >
              View all
            </Link>
          </div>
          <ProgramsList />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/clients/new"
          className="flex items-center justify-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg transition duration-200 hover:shadow-md group"
        >
          <div className="text-center">
            <Users className="h-12 w-12 mx-auto text-blue-500 group-hover:scale-110 transition-transform duration-200" />
            <h3 className="mt-4 text-lg font-medium text-gray-800">Register New Client</h3>
            <p className="mt-1 text-sm text-gray-600">Add a new client to the system</p>
          </div>
        </Link>
        
        <Link
          to="/programs/new"
          className="flex items-center justify-center p-6 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg transition duration-200 hover:shadow-md group"
        >
          <div className="text-center">
            <PlusCircle className="h-12 w-12 mx-auto text-emerald-500 group-hover:scale-110 transition-transform duration-200" />
            <h3 className="mt-4 text-lg font-medium text-gray-800">Create Health Program</h3>
            <p className="mt-1 text-sm text-gray-600">Add a new health program</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;