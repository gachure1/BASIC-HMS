import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

interface Program {
  id: number;
  name: string;
}

interface EnrollmentFormProps {
  clientId: number;
  onSubmit: (programId: number) => void;
  onCancel: () => void;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ clientId, onSubmit, onCancel }) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolledPrograms, setEnrolledPrograms] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all programs
        const programsRes = await axios.get(`${API_URL}/programs`);
        setPrograms(programsRes.data);
        
        // Fetch programs client is already enrolled in
        const enrollmentsRes = await axios.get(`${API_URL}/enrollments/client/${clientId}`);
        const enrolledProgramIds = enrollmentsRes.data.map((enrollment: any) => enrollment.program_id);
        setEnrolledPrograms(enrolledProgramIds);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching enrollment data:', err);
        setError('Failed to load programs. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedProgram === '') {
      setError('Please select a program');
      return;
    }
    
    onSubmit(Number(selectedProgram));
  };

  // Filter out programs the client is already enrolled in
  const availablePrograms = programs.filter(program => !enrolledPrograms.includes(program.id));

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (availablePrograms.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600">
          This client is already enrolled in all available programs.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h4 className="text-lg font-medium text-gray-800 mb-3">Enroll in Health Program</h4>
      
      {error && (
        <div className="mb-4 text-sm text-red-600">
          <p>{error}</p>
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-1">
          Select Program
        </label>
        <select
          id="program"
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value ? Number(e.target.value) : '')}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select a program</option>
          {availablePrograms.map((program) => (
            <option key={program.id} value={program.id}>
              {program.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Enroll
        </button>
      </div>
    </form>
  );
};

export default EnrollmentForm;