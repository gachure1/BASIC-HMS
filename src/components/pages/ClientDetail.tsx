import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, UserCircle, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import axios from 'axios';
import ClientForm from '../forms/ClientForm';
import ConfirmDialog from '../ui/ConfirmDialog';
import EnrollmentsList from '../lists/EnrollmentsList';
import EnrollmentForm from '../forms/EnrollmentForm';
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

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEnrollForm, setShowEnrollForm] = useState(false);

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/clients/${id}`);
        setClient(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching client details:', err);
        setError('Failed to load client details. Please try again later.');
        setLoading(false);
      }
    };

    if (id) {
      fetchClientDetails();
    }
  }, [id]);

  const handleUpdateClient = async (clientData: any) => {
    try {
      const response = await axios.put(`${API_URL}/clients/${id}`, clientData);
      setClient(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating client:', err);
      alert('Failed to update client. Please try again.');
    }
  };

  const handleDeleteClient = async () => {
    try {
      await axios.delete(`${API_URL}/clients/${id}`);
      navigate('/clients');
    } catch (err) {
      console.error('Error deleting client:', err);
      alert('Failed to delete client. Please try again.');
    }
  };

  const handleEnrollClient = async (programId: number) => {
    try {
      await axios.post(`${API_URL}/enrollments`, {
        clientId: Number(id),
        programId
      });
      setShowEnrollForm(false);
      // Refresh enrollments list
      // This will be handled by the EnrollmentsList component's refresh mechanism
    } catch (err) {
      console.error('Error enrolling client:', err);
      alert('Failed to enroll client. Client may already be enrolled in this program.');
    }
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

  if (!client) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
        <p>Client not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center mb-6">
        <Link to="/clients" className="text-gray-500 hover:text-gray-700 mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Client Details</h1>
      </div>

      {isEditing ? (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Client</h2>
          <ClientForm 
            initialData={client} 
            onSubmit={handleUpdateClient} 
            onCancel={() => setIsEditing(false)} 
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-4">
                <UserCircle className="h-10 w-10" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{client.name}</h2>
                <div className="flex items-center mt-1 text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">Client since {formatDate(client.created_at)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition duration-150"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center space-x-1 px-3 py-2 bg-red-50 hover:bg-red-100 rounded-md text-red-600 transition duration-150"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Client Details</h3>
              <div className="mt-3 space-y-4">
                <div className="flex items-center">
                  <span className="text-gray-500 w-24">Age:</span>
                  <span className="font-medium">{client.age || 'Not specified'}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 w-24">Gender:</span>
                  <span className="font-medium">{client.gender || 'Not specified'}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Contact Information</h3>
              <div className="mt-3 space-y-4">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <span className="text-gray-500 block text-sm">Phone</span>
                    <span className="font-medium">{client.contact || 'Not provided'}</span>
                  </div>
                </div>
                {client.address && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <span className="text-gray-500 block text-sm">Address</span>
                      <span className="font-medium">{client.address}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex">
            <Link 
              to={`/clients/${client.id}/profile`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-150"
            >
              View full profile
            </Link>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Program Enrollments</h3>
          <button
            onClick={() => setShowEnrollForm(!showEnrollForm)}
            className="flex items-center space-x-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-600 transition duration-150"
          >
            <span>Enroll in Program</span>
          </button>
        </div>
        
        {showEnrollForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <EnrollmentForm 
              clientId={Number(id)} 
              onSubmit={handleEnrollClient} 
              onCancel={() => setShowEnrollForm(false)} 
            />
          </div>
        )}
        
        <EnrollmentsList clientId={Number(id)} />
      </div>

      {showDeleteDialog && (
        <ConfirmDialog
          title="Delete Client"
          message={`Are you sure you want to delete the client "${client.name}"? This action cannot be undone.`}
          confirmText="Delete"
          confirmType="danger"
          onConfirm={handleDeleteClient}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </div>
  );
};

export default ClientDetail;