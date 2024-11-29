import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Calendar, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

function EditContractModal({ isOpen, onClose, onEdit, contractData }) {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    contractNo: '',
    title: '',
    supplier: '',
    email: '',
    phone: '',
    amount: '',
    currency: 'FRW',
    administrator: '',
    startDate: '',
    duration: {
      value: '',
      unit: 'Days'
    },
    endDate: ''
  });

  // Currency options
  const currencies = [
    { code: 'FRW', symbol: 'FRW' },
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' }
  ];

  // Mock employee data (in real app, fetch from API)
  const [employees] = useState([
    { id: 1, name: 'GATSIMBANYI Aimable', department: 'PS', position: 'Contract Manager' },
    { id: 2, name: 'KAYITAKIRWA Eric', department: 'Finance', position: 'Senior Manager' },
    { id: 3, name: 'UWASE Marie', department: 'Legal', position: 'Contract Administrator' },
    { id: 4, name: 'MUGISHA Jean', department: 'PS', position: 'Project Manager' },
    { id: 5, name: 'KAMANZI Peter', department: 'Finance', position: 'Contract Supervisor' }
  ]);

  // States for administrator search
  const [administratorSearch, setAdministratorSearch] = useState('');
  const [showAdministratorDropdown, setShowAdministratorDropdown] = useState(false);

  // Duration units
  const durationUnits = ['Days', 'Weeks', 'Months', 'Quarters', 'Year'];

  // Load contract data when modal opens
  useEffect(() => {
    if (contractData) {
      setFormData({
        ...contractData,
        duration: {
          value: contractData.duration?.value || '',
          unit: contractData.duration?.unit || 'Days'
        }
      });
    }
  }, [contractData]);

  // Filter administrators based on search
  const filteredAdministrators = employees.filter(emp =>
    emp.name.toLowerCase().includes(administratorSearch.toLowerCase()) ||
    emp.department.toLowerCase().includes(administratorSearch.toLowerCase()) ||
    emp.position.toLowerCase().includes(administratorSearch.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Basic validation
      if (!formData.contractNo || !formData.title || !formData.supplier) {
        throw new Error('Please fill in all required fields');
      }

      // Phone number validation (Rwanda format)
      const phoneRegex = /^(\+?25)?(07[238]\d{7})$/;
      if (!phoneRegex.test(formData.phone)) {
        throw new Error('Please enter a valid Rwandan phone number');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Amount validation
      if (isNaN(formData.amount) || formData.amount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      await onEdit(formData);
      onClose();
      toast.success('Contract updated successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle administrator selection
  const handleAdministratorSelect = (employee) => {
    setFormData(prev => ({
      ...prev,
      administrator: employee.name
    }));
    setShowAdministratorDropdown(false);
    setAdministratorSearch('');
  };

  // Calculate end date based on start date and duration
  const calculateEndDate = (startDate, duration) => {
    if (!startDate || !duration.value || !duration.unit) return '';

    const start = new Date(startDate);
    let end = new Date(start);

    switch (duration.unit) {
      case 'Days':
        end.setDate(start.getDate() + parseInt(duration.value));
        break;
      case 'Weeks':
        end.setDate(start.getDate() + (parseInt(duration.value) * 7));
        break;
      case 'Months':
        end.setMonth(start.getMonth() + parseInt(duration.value));
        break;
      case 'Quarters':
        end.setMonth(start.getMonth() + (parseInt(duration.value) * 3));
        break;
      case 'Year':
        end.setFullYear(start.getFullYear() + parseInt(duration.value));
        break;
      default:
        break;
    }

    return end.toISOString().split('T')[0];
  };

  // Update end date whenever start date or duration changes
  const handleDateDurationChange = (field, value) => {
    const updatedFormData = { ...formData, [field]: value };
    
    if (field === 'startDate' || (field === 'duration' && value.value)) {
      const endDate = calculateEndDate(
        updatedFormData.startDate,
        field === 'duration' ? value : updatedFormData.duration
      );
      updatedFormData.endDate = endDate;
    }

    setFormData(updatedFormData);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`w-full max-w-2xl transform overflow-hidden rounded-lg ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'
              } p-6 text-left align-middle shadow-xl transition-all`}>
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-xl font-bold">
                    Edit Contract
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contract Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Contract No <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.contractNo}
                        onChange={(e) => setFormData(prev => ({ ...prev, contractNo: e.target.value }))}
                        required
                        placeholder="Enter contract number"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                        placeholder="Enter contract title"
                      />
                    </div>
                  </div>

                  {/* Supplier Information */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Supplier <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.supplier}
                        onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                        required
                        placeholder="Enter supplier name"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        placeholder="Enter email"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        required
                        placeholder="07X XXX XXXX"
                      />
                    </div>
                  </div>

                  {/* Amount and Currency */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Amount <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        required
                        min="0"
                        placeholder="Enter amount"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">Currency</label>
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                        className="w-full border rounded-lg p-2"
                      >
                        {currencies.map(currency => (
                          <option key={currency.code} value={currency.code}>
                            {currency.code} ({currency.symbol})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Contract Administrator */}
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Contract Administrator <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="relative">
                        <Input
                          type="text"
                          value={administratorSearch}
                          onChange={(e) => {
                            setAdministratorSearch(e.target.value);
                            setShowAdministratorDropdown(true);
                          }}
                          onFocus={() => setShowAdministratorDropdown(true)}
                          placeholder="Search administrator..."
                          className="w-full pr-10"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                      
                      {/* Selected administrator display */}
                      {formData.administrator && !showAdministratorDropdown && (
                        <div className="mt-2 p-2 bg-blue-50 rounded-md flex justify-between items-center">
                          <span>{formData.administrator}</span>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, administrator: '' }))}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      {/* Administrator search dropdown */}
                      {showAdministratorDropdown && administratorSearch && (
                        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto border">
                          {filteredAdministrators.length > 0 ? (
                            filteredAdministrators.map(employee => (
                              <button
                                key={employee.id}
                                type="button"
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                onClick={() => handleAdministratorSelect(employee)}
                              >
                                <div className="font-medium">{employee.name}</div>
                                <div className="text-sm text-gray-500">
                                  {employee.department} • {employee.position}
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-sm text-gray-500">
                              No administrators found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contract Duration */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleDateDurationChange('startDate', e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block mb-1 text-sm font-medium">Duration</label>
                        <Input
                          type="number"
                          value={formData.duration.value}
                          onChange={(e) => handleDateDurationChange('duration', {
                            ...formData.duration,
                            value: e.target.value
                          })}
                          min="1"
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium">Unit</label>
                        <select
                          value={formData.duration.unit}
                          onChange={(e) => handleDateDurationChange('duration', {
                            ...formData.duration,
                            unit: e.target.value
                          })}
                          className="w-full border rounded-lg p-2"
                          required
                        >
                          {durationUnits.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">End Date</label>
                      <Input
                        type="date"
                        value={formData.endDate}
                        readOnly
                        className="bg-gray-100"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Update Contract
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default EditContractModal; 