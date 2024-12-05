import React, { useState, useEffect, Fragment } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { Search, Plus, Eye, Edit, Trash2, AlertTriangle, X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import AddAcademyModal from '../components/AddAcademyModal';
import AddAcademyStudent from '../components/AddAcademyStudent';
import EditAcademyModal from '../components/EditAcademyModal';
import axiosInstance from '../utils/axiosInstance';

function Academies() {
  const [activeTab, setActiveTab] = useState('manage');
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAcademy, setSelectedAcademy] = useState(null);
  const [isViewStudentsModalOpen, setIsViewStudentsModalOpen] = useState(false);
  const [selectedAcademyStudents, setSelectedAcademyStudents] = useState([]);
  const [academies, setAcademies] = useState([]);
  const [students, setStudents] = useState([]);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isViewStudentModalOpen, setIsViewStudentModalOpen] = useState(false);
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const [isDeleteStudentModalOpen, setIsDeleteStudentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [transferData, setTransferData] = useState({
    fromSchool: '',
    student: '',
    toSchool: ''
  });

  useEffect(() => {
    fetchAcademies();
    fetchStudents();
  }, []);

  const fetchAcademies = async () => {
    try {
      const response = await axiosInstance.get('/academies');
      setAcademies(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching academies:', error);
      toast.error('Failed to fetch academies');
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get('/academy-students');
      setStudents(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/academies/${selectedAcademy.id}`);
      setAcademies(prev => prev.filter(a => a.id !== selectedAcademy.id));
      setIsDeleteModalOpen(false);
      toast.success('Academy deleted successfully');
    } catch (error) {
      console.error('Error deleting academy:', error);
      toast.error('Failed to delete academy');
    }
  };

  const handleEditSubmit = async (updatedAcademy) => {
    try {
      if (!updatedAcademy.id) {
        throw new Error('Academy ID is required for updating');
      }

      const response = await axiosInstance.put(`/academies/${updatedAcademy.id}`, updatedAcademy);

      if (response.status === 200) {
        setAcademies(prev => prev.map(academy => 
          academy.id === updatedAcademy.id ? updatedAcademy : academy
        ));
        setIsEditModalOpen(false);
        toast.success('Academy updated successfully');
      } else {
        throw new Error('Failed to update academy');
      }
    } catch (error) {
      console.error('Error updating academy:', error);
      toast.error('Failed to update academy');
    }
  };

  const handleDeleteStudentConfirm = async () => {
    try {
      await axiosInstance.delete(`/academy-students/${selectedStudent.id}`);
      setStudents(prev => prev.filter(s => s.id !== selectedStudent.id));
      setIsDeleteStudentModalOpen(false);
      toast.success('Student deleted successfully');
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Failed to delete student');
    }
  };

  const handleEditStudentSubmit = async (updatedStudent) => {
    try {
      if (!updatedStudent.id) {
        throw new Error('Student ID is required for updating');
      }

      const response = await axiosInstance.put(`/academy-students/${updatedStudent.id}`, updatedStudent);

      if (response.status === 200) {
        setStudents(prev => prev.map(student => 
          student.id === updatedStudent.id ? updatedStudent : student
        ));
        setIsEditStudentModalOpen(false);
        toast.success('Student updated successfully');
      } else {
        throw new Error('Failed to update student');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Failed to update student');
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    try {
      // Implement the transfer logic here
      console.log('Transferring student:', transferData);
      // Reset transfer data after successful transfer
      setTransferData({ fromSchool: '', student: '', toSchool: '' });
      toast.success('Student transferred successfully');
    } catch (error) {
      console.error('Error transferring student:', error);
      toast.error('Failed to transfer student');
    }
  };

  const handleFromSchoolChange = (schoolId) => {
    setTransferData(prev => ({ ...prev, fromSchool: schoolId, student: '', toSchool: '' }));
  };

  const availableStudents = students.filter(student => student.schoolId === transferData.fromSchool);

  const renderContent = () => {
    switch (activeTab) {
      case 'manage':
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search academies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Academy
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Students</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Operation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {academies.map((academy) => (
                    <tr key={academy.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{academy.name}</td>
                      <td className="px-4 py-3 text-sm">{academy.location}</td>
                      <td className="px-4 py-3 text-sm">{academy.category}</td>
                      <td className="px-4 py-3 text-sm">{academy.students || '-'}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedAcademy(academy);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedAcademy(academy);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      case 'students':
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              <Button
                onClick={() => setIsAddStudentModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Class</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Game</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Gender</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Operation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{`${student.firstName} ${student.lastName}`}</td>
                      <td className="px-4 py-3 text-sm">{student.class}</td>
                      <td className="px-4 py-3 text-sm">{student.game}</td>
                      <td className="px-4 py-3 text-sm">{student.gender}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsEditStudentModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsDeleteStudentModalOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      case 'transfer':
        return (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Academy Student Transfer</h2>
            
            <form onSubmit={handleTransferSubmit} className="space-y-6">
              {/* School From */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  School From <span className="text-red-500">*</span>
                </label>
                <select
                  value={transferData.fromSchool}
                  onChange={(e) => handleFromSchoolChange(e.target.value)}
                  required
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Select School</option>
                  {academies.map(academy => (
                    <option key={academy.id} value={academy.id}>
                      {academy.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Selection */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Student <span className="text-red-500">*</span>
                </label>
                <select
                  value={transferData.student}
                  onChange={(e) => setTransferData(prev => ({ ...prev, student: e.target.value }))}
                  required
                  disabled={!transferData.fromSchool}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Select Student</option>
                  {availableStudents.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} - {student.class}
                    </option>
                  ))}
                </select>
              </div>

              {/* School To */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  School To <span className="text-red-500">*</span>
                </label>
                <select
                  value={transferData.toSchool}
                  onChange={(e) => setTransferData(prev => ({ ...prev, toSchool: e.target.value }))}
                  required
                  disabled={!transferData.student}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Select School</option>
                  {academies
                    .filter(academy => academy.id !== transferData.fromSchool)
                    .map(academy => (
                      <option key={academy.id} value={academy.id}>
                        {academy.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Transfer Student
                </Button>
              </div>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-6">Manage Academies</h1>

        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              activeTab === 'manage' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('manage')}
          >
            Manage Academies
          </button>
          <button
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              activeTab === 'students' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('students')}
          >
            Manage Academy Students
          </button>
          <button
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              activeTab === 'transfer' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('transfer')}
          >
            Transfer Students
          </button>
        </div>

        <div className="transition-all duration-200 ease-in-out">
          {renderContent()}
        </div>
      </div>

      <AddAcademyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(data) => {
          // Handle adding new academy
          console.log('New academy:', data);
          setIsAddModalOpen(false);
          toast.success('Academy added successfully');
        }}
      />

      {/* Add Student Modal */}
      <AddAcademyStudent
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        onAdd={(studentData) => {
          // Handle adding new student
          console.log('New student:', studentData);
          setIsAddStudentModalOpen(false);
          toast.success('Student added successfully');
        }}
      />

      {/* View Academy Modal */}
      <Transition appear show={isViewModalOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setIsViewModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-xl font-bold">
                    View Academy School
                  </Dialog.Title>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Render academy details here */}

                <div className="flex justify-end mt-6 pt-4 border-t">
                  <Button
                    onClick={() => setIsViewModalOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                  <Dialog.Title className="text-lg font-medium">
                    Delete Academy
                  </Dialog.Title>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to delete "{selectedAcademy?.name}"? 
                  This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleDeleteConfirm}
                  >
                    Delete Academy
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Add EditAcademyModal */}
      <EditAcademyModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAcademy(null);
        }}
        onEdit={handleEditSubmit}
        academyData={selectedAcademy}
      />

      {/* Add View Students Modal */}
      <Transition appear show={isViewStudentsModalOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setIsViewStudentsModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-xl font-bold">
                    Academy Students
                  </Dialog.Title>
                  <button
                    onClick={() => setIsViewStudentsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {selectedAcademyStudents.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Class</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Game</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Gender</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedAcademyStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">{student.name}</td>
                            <td className="px-4 py-3">{student.class}</td>
                            <td className="px-4 py-3">{student.game}</td>
                            <td className="px-4 py-3">{student.gender}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No students found for this academy</p>
                  </div>
                )}

                <div className="flex justify-end mt-6">
                  <Button onClick={() => setIsViewStudentsModalOpen(false)}>
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* View Student Modal */}
      <Transition appear show={isViewStudentModalOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setIsViewStudentModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-xl font-bold">
                    Student Details
                  </Dialog.Title>
                  <button
                    onClick={() => setIsViewStudentModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Render student details here */}

                <div className="flex justify-end mt-6 pt-4 border-t">
                  <Button onClick={() => setIsViewStudentModalOpen(false)}>
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Student Confirmation Modal */}
      <Transition appear show={isDeleteStudentModalOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setIsDeleteStudentModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                  <Dialog.Title className="text-lg font-medium">
                    Delete Student
                  </Dialog.Title>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to delete {selectedStudent?.firstName} {selectedStudent?.lastName}? 
                  This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteStudentModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleDeleteStudentConfirm}
                  >
                    Delete Student
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Student Modal */}
      <AddAcademyStudent
        isOpen={isEditStudentModalOpen}
        onClose={() => {
          setIsEditStudentModalOpen(false);
          setSelectedStudent(null);
        }}
        onAdd={handleEditStudentSubmit}
        studentData={selectedStudent}
        isEditing={true}
      />
    </div>
  );
}

export default Academies;
