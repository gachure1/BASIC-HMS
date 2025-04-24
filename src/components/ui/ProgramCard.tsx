import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Calendar, Users, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import ConfirmDialog from './ConfirmDialog';
import { formatDate } from '../../utils/dateUtils';

const API_URL = 'http://localhost:3000/api';

interface Program {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

interface ProgramCardProps {
  program: Program;
  onRefresh: () => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, onRefresh }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [clientCount, setClientCount] = useState<number | null>(null);

  const fetchClientCount = async () => {
    if (clientCount !== null) return; // Only fetch once
    
    try {
      const response = await axios.get(`${API_URL}/programs/${program.id}/clients`);
      setClientCount(response.data.length);
    } catch (error) {
      console.error('Error fetching client count:', error);
      setClientCount(0);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/programs/${program.id}`);
      onRefresh();
    } catch (error) {
      console.error('Error deleting program:', error);
      alert('Failed to delete program. Please try again.');
    }
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
      onMouseEnter={fetchClientCount}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {program.name}
          </h3>
          <div className="flex space-x-1">
            <Link 
              to={`/programs/${program.id}`}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <Edit size={18} />
            </Link>
            <button 
              onClick={() => setShowDeleteDialog(true)}
              className="text-gray-400 hover:text-red-500 p-1"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {program.description || 'No description provided.'}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Created on {formatDate(program.created_at)}</span>
        </div>
        
        {clientCount !== null && (
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            <span>
              {clientCount} {clientCount === 1 ? 'client' : 'clients'} enrolled
            </span>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 px-5 py-3 bg-gray-50">
        <Link 
          to={`/programs/${program.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-150"
        >
          View details &rarr;
        </Link>
      </div>
      
      {showDeleteDialog && (
        <ConfirmDialog
          title="Delete Program"
          message={`Are you sure you want to delete "${program.name}"? This action cannot be undone.`}
          confirmText="Delete"
          confirmType="danger"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </div>
  );
};

export default ProgramCard;