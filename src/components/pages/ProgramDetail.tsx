import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Users, Clock, CalendarDays, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import ClientsList from '../lists/ClientsList';
import ProgramForm from '../forms/ProgramForm';
import ConfirmDialog from '../ui/ConfirmDialog';
import { formatDate } from '../../utils/dateUtils';

const API_URL = 'http://localhost:3000/api';

interface Program {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

const ProgramDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [clientCount, setClientCount] = useState(0);

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        setLoading(true);
        const programRes = await axios.get(`${API_URL}/programs/${id}`);
        const clientsRes = await axios.get(`${API_URL}/programs/${id}/clients`);
        
        setProgram(programRes.data);
        setClientCount(clientsRes.data.length);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching program details:', err);
        setError('Failed to load program details. Please try again later.');
        setLoading(false);
      }
    };

    if (id) {
      fetchProgramDetails();
    }
  }, [id]);

  const handleUpdateProgram = async (formData: { name: string; description: string }) => {
    try {
      const response = await axios.put(`${API_URL}/programs/${id}`, formData);
      setProgram(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating program:', err);
      alert('Failed to update program. Please try again.');
    }
  };

  const handleDeleteProgram = async () => {
    try {
      await axios.delete(`${API_URL}/programs/${id}`);
      navigate('/programs');
    } catch (err) {
      console.error('Error deleting program:', err);
      alert('Failed to delete program. Please try again.');
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

  if (!program) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
        <p>Program not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center mb-6">
        <Link to="/programs" className="text-gray-500 hover:text-gray-700 mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Program Details</h1>
      </div>

      {isEditing ? (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Program</h2>
          <ProgramForm 
            initialData={program} 
            onSubmit={handleUpdateProgram} 
            onCancel={() => setIsEditing(false)} 
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{program.name}</h2>
              <div className="flex items-center mt-2 text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">Created on {formatDate(program.created_at)}</span>
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
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800">Description</h3>
            <p className="mt-2 text-gray-600">
              {program.description || 'No description provided.'}
            </p>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-800">Program Enrollment</h3>
            </div>
            <p className="mt-1 text-gray-600">
              {clientCount === 0 
                ? 'No clients are currently enrolled in this program.'
                : `${clientCount} client${clientCount === 1 ? ' is' : 's are'} currently enrolled in this program.`
              }
            </p>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Enrolled Clients</h3>
        <ClientsList programId={Number(id)} />
      </div>

      {showDeleteDialog && (
        <ConfirmDialog
          title="Delete Program"
          message={`Are you sure you want to delete the program "${program.name}"? This action cannot be undone.`}
          confirmText="Delete"
          confirmType="danger"
          onConfirm={handleDeleteProgram}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </div>
  );
};

export default ProgramDetail;