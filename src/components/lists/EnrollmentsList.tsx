import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Calendar, AlertCircle } from 'lucide-react';
import axios from 'axios';
import ConfirmDialog from '../ui/ConfirmDialog';
import { formatDate } from '../../utils/dateUtils';

const API_URL = 'http://localhost:3000/api';

interface Enrollment {
  id: number;
  client_id: number;
  program_id: number;
  program_name: string;
  enrolled_at: string;
  status: string;
  description?: string;
}

interface EnrollmentsListProps {
  clientId: number;
}

const EnrollmentsList: React.FC<EnrollmentsListProps> = ({ clientId }) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEnrollment, setSelectedEnrollment] = useState<number | null>(null);
  const [showUnenrollDialog, setShowUnenrollDialog] = useState(false);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/enrollments/client/${clientId}`);
      setEnrollments(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching enrollments:', err);
      setError('Failed to load enrollments. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [clientId]);

  const handleStatusChange = async (enrollmentId: number, newStatus: string) => {
    try {
      await axios.patch(`${API_URL}/enrollments/${enrollmentId}/status`, {
        status: newStatus
      });
      fetchEnrollments(); // Refresh the list
    } catch (err) {
      console.error('Error updating enrollment status:', err);
      alert('Failed to update enrollment status. Please try again.');
    }
  };

  const handleUnenroll = async () => {
    if (selectedEnrollment === null) return;
    
    try {
      await axios.delete(`${API_URL}/enrollments/${selectedEnrollment}`);
      setShowUnenrollDialog(false);
      fetchEnrollments(); // Refresh the list
    } catch (err) {
      console.error('Error unenrolling client:', err);
      alert('Failed to unenroll client. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
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

  if (enrollments.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto" />
        <p className="mt-2 text-gray-500">This client is not enrolled in any health programs.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden">
        {enrollments.map((enrollment) => (
          <div 
            key={enrollment.id} 
            className="mb-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Activity className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {enrollment.program_name}
                  </h4>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Enrolled on {formatDate(enrollment.enrolled_at)}</span>
                  </div>
                  {enrollment.description && (
                    <p className="mt-2 text-sm text-gray-600">{enrollment.description}</p>
                  )}
                </div>
              </div>
              
              <div className="ml-4 flex flex-col items-end space-y-2">
                <div className="flex items-center space-x-2">
                  <select
                    value={enrollment.status}
                    onChange={(e) => handleStatusChange(enrollment.id, e.target.value)}
                    className={`text-sm rounded-full px-3 py-1 font-medium ${
                      enrollment.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : enrollment.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/programs/${enrollment.program_id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    View program
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedEnrollment(enrollment.id);
                      setShowUnenrollDialog(true);
                    }}
                    className="text-sm text-red-600 hover:text-red-800 transition-colors"
                  >
                    Unenroll
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {showUnenrollDialog && (
        <ConfirmDialog
          title="Unenroll Client"
          message="Are you sure you want to unenroll this client from the program? This action cannot be undone."
          confirmText="Unenroll"
          confirmType="danger"
          onConfirm={handleUnenroll}
          onCancel={() => setShowUnenrollDialog(false)}
        />
      )}
    </div>
  );
};

export default EnrollmentsList;