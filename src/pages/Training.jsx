import React, { useState, useEffect } from 'react';
import { Plus, Edit } from 'lucide-react';
import Modal from '../components/ui/Modal';
import AddTrainingForm from '../components/forms/AddTrainingForm';
import ActionMenu from '../components/ui/ActionMenu';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { toast } from 'react-hot-toast';
import PageLoading from '../components/ui/PageLoading';
import Message from '../components/ui/Message';
import { useDarkMode } from '../contexts/DarkModeContext';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import axiosInstance from '../utils/axiosInstance'; // Import the axios instance

// Define the Table components if they are not from a library
const Table = ({ children }) => <table className="min-w-full">{children}</table>;
const TableHeader = ({ children }) => <thead>{children}</thead>;
const TableRow = ({ children }) => <tr>{children}</tr>;
const TableHead = ({ children }) => <th className="px-4 py-2">{children}</th>;
const TableBody = ({ children }) => <tbody>{children}</tbody>;
const TableCell = ({ children }) => <td className="px-4 py-2">{children}</td>;

const Training = () => {
  const { isDarkMode } = useDarkMode();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [trainingToDelete, setTrainingToDelete] = useState(null);
  const [trainingToEdit, setTrainingToEdit] = useState(null);

  // Fetch training data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/trainings'); // Replace with your endpoint
        setTrainings(response.data);
        setFilteredTrainings(response.data);
        setIsLoading(false);
      } catch (error) {
        setMessage({
          type: 'error',
          text: 'Failed to load trainings. Please try again.'
        });
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle adding or editing training
  const handleAddOrEditTraining = async (data) => {
    setIsSubmitting(true);
    try {
      let response;
      if (trainingToEdit) {
        response = await axiosInstance.put(`/trainings/${trainingToEdit.id}`, data); // Edit endpoint
        const updatedTrainings = trainings.map((t) =>
          t.id === trainingToEdit.id ? response.data : t
        );
        setTrainings(updatedTrainings);
        setFilteredTrainings(updatedTrainings);
      } else {
        response = await axiosInstance.post('/trainings', data); // Add endpoint
        const newTrainings = [...trainings, response.data];
        setTrainings(newTrainings);
        setFilteredTrainings(newTrainings);
      }
      setShowAddModal(false);
      setMessage({
        type: 'success',
        text: trainingToEdit ? 'Training updated successfully' : 'Training added successfully'
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to add or update training'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting a training
  const handleDeleteConfirm = async () => {
    setIsSubmitting(true);
    try {
      await axiosInstance.delete(`/trainings/${trainingToDelete.id}`); // Delete endpoint
      const updatedTrainings = trainings.filter(t => t.id !== trainingToDelete.id);
      setTrainings(updatedTrainings);
      setFilteredTrainings(updatedTrainings);
      setShowDeleteDialog(false);
      setTrainingToDelete(null);
      toast.success('Training deleted successfully');
    } catch (error) {
      toast.error('Failed to delete training');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTrainings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTrainings.length / itemsPerPage);

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {message && (
        <Message
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search trainings..."
          className="border p-2 rounded-md w-full"
        />
        <Button
          variant="default"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="h-4 w-4" />
          Add Training
        </Button>
      </div>

      {/* Trainings Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>From Date</TableHead>
            <TableHead>To Date</TableHead>
            <TableHead>Organiser</TableHead>
            <TableHead>Participants</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((training) => (
            <TableRow key={training.id}>
              <TableCell>{training.title}</TableCell>
              <TableCell>{training.fromDate ? new Date(training.fromDate).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell>{training.toDate ? new Date(training.toDate).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell>{training.organiser}</TableCell>
              <TableCell>{training.participants ? training.participants.join(', ') : 'N/A'}</TableCell>
              <TableCell>
                <ActionMenu
                  onDelete={() => {
                    setTrainingToDelete(training);
                    setShowDeleteDialog(true);
                  }}
                  onEdit={() => {
                    setTrainingToEdit(training);
                    setShowAddModal(true);
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <div>
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Modals */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => !isSubmitting && setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Training"
        message="Are you sure you want to delete this training?"
        isSubmitting={isSubmitting}
      />
      
      <Dialog open={showAddModal} onOpenChange={(open) => {
        setShowAddModal(open);
        setTrainingToEdit(null); // Reset on closing modal
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{trainingToEdit ? 'Edit Training' : 'Add Training'}</DialogTitle>
            <DialogDescription>
              {trainingToEdit ? 'Update the training details.' : 'Fill in the details for the new training'}
            </DialogDescription>
          </DialogHeader>
          <AddTrainingForm
            onSubmit={handleAddOrEditTraining}
            onCancel={() => setShowAddModal(false)}
            trainingToEdit={trainingToEdit}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Training;