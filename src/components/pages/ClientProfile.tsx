import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Clock, 
  Phone, 
  MapPin, 
  Activity, 
  Download
} from 'lucide-react';
import axios from 'axios';
import { formatDate } from '../../utils/dateUtils';

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

interface Enrollment {
  id: number;
  client_id: number;
  program_id: number;
  enrolled_at: string;
  status: string;
  program_name: string;
  description: string;
}

interface ClientProfile extends Client {
  enrollments: Enrollment[];
}

const ClientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClientProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/clients/${id}/profile`);
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching client profile:', err);
        setError('Failed to load client profile. Please try again later.');
        setLoading(false);
      }
    };

    if (id) {
      fetchClientProfile();
    }
  }, [id]);

  const downloadProfile = () => {
    if (!profile) return;
    
    // Create a JSON file for download
    const dataStr = JSON.stringify(profile, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `client-${profile.id}-profile.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

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

  if (!profile) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
        <p>Client profile not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center mb-6">
        <Link to={`/clients/${id}`} className="text-gray-500 hover:text-gray-700 mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Client Profile</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-8 text-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-white mr-5">
                <User className="h-12 w-12" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{profile.name}</h2>
                <div className="mt-2 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-white/80">Client ID: {profile.id}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={downloadProfile}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition duration-150"
            >
              <Download className="h-4 w-4" />
              <span>Export Profile</span>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-32 text-gray-500">Age:</div>
                  <div className="font-medium">{profile.age || 'Not specified'}</div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-32 text-gray-500">Gender:</div>
                  <div className="font-medium">{profile.gender || 'Not specified'}</div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-32 text-gray-500">Registered on:</div>
                  <div className="font-medium">{formatDate(profile.created_at)}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 mr-2">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">Phone Number</div>
                    <div className="font-medium">{profile.contact || 'Not provided'}</div>
                  </div>
                </div>
                
                {profile.address && (
                  <div className="flex items-start">
                    <div className="w-8 mr-2">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-gray-500 text-sm">Address</div>
                      <div className="font-medium">{profile.address}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Health Programs
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                {profile.enrollments.length} {profile.enrollments.length === 1 ? 'Program' : 'Programs'}
              </span>
            </h3>
            
            {profile.enrollments.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <Activity className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="mt-2 text-gray-500">This client is not enrolled in any health programs.</p>
                <Link
                  to={`/clients/${id}`}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-150"
                >
                  Enroll in a program
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {profile.enrollments.map((enrollment) => (
                  <div 
                    key={enrollment.id} 
                    className="p-4 rounded-lg border border-gray-200 transition-all duration-200 hover:border-blue-300 hover:shadow-sm"
                  >
                    <div className="flex justify-between">
                      <h4 className="text-lg font-medium text-gray-800">{enrollment.program_name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        enrollment.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : enrollment.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                      </span>
                    </div>
                    
                    {enrollment.description && (
                      <p className="mt-2 text-gray-600">{enrollment.description}</p>
                    )}
                    
                    <div className="mt-3 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Enrolled on {formatDate(enrollment.enrolled_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;