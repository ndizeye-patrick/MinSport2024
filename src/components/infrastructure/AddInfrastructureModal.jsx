/* src/components/infrastructure/AddInfrastructureModal.jsx */
import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { useInfrastructure } from '../../contexts/InfrastructureContext';
import { validateInfrastructureForm } from '../../utils/validation';
import { AlertCircle, Plus } from 'lucide-react';
import { locations } from '../../data/locations';

const AddInfrastructureModal = ({ isOpen, onClose }) => {
  const { categories, addInfrastructure } = useInfrastructure();
  const [formData, setFormData] = useState({
    name: '',
    infra_category: 1,
    infra_sub_category: 1,
    type_level: '',
    status: '',
    capacity: 1,
    description: '',
    location_province: '',
    location_district: '',
    location_sector: '',
    location_cell: '',
    location_village: '',
    latitude: 1,
    longitude: 1,
    upi: '',
    plot_area: 1,
    construction_date: '',
    owner: '',
  });
  const [errors, setErrors] = useState({});
  const [locationData, setLocationData] = useState({
    provinces: locations.provinces,
    districts: [],
    sectors: [],
    cells: [],
    villages: []
  });

  const handleClose = () => {
    setFormData({
      name: '',
      infra_category: 1,
      infra_sub_category: 1,
      type_level: '',
      status: '',
      capacity: 1,
      description: '',
      location_province: '',
      location_district: '',
      location_sector: '',
      location_cell: '',
      location_village: '',
      latitude: 1,
      longitude: 1,
      upi: '',
      plot_area: 1,
      construction_date: '',
      owner: '',
    });
    setErrors({});
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateInfrastructureForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the form errors before submitting');
      return;
    }

    toast.custom((t) => (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <h3 className="font-medium mb-2 dark:text-white">Confirm Submission</h3>
        <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">
          Are you sure you want to add this infrastructure?
        </p>
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => toast.dismiss(t)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
            onClick={async () => {
              toast.dismiss(t);
              try {
                setErrors({});
                await addInfrastructure(formData);
                toast.success('Infrastructure added successfully');
                onClose();
              } catch (error) {
                toast.error('Failed to add infrastructure');
              }
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    ));
  };

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Reset dependent fields
    switch (field) {
      case 'location_province':
        setLocationData(prev => ({
          ...prev,
          districts: locations.districts[value] || [],
          sectors: [],
          cells: [],
          villages: []
        }));
        break;
      case 'location_district':
        setLocationData(prev => ({
          ...prev,
          sectors: locations.sectors[value] || [],
          cells: [],
          villages: []
        }));
        break;
      case 'location_sector':
        setLocationData(prev => ({
          ...prev,
          cells: locations.cells[value] || [],
          villages: []
        }));
        break;
      case 'location_cell':
        setLocationData(prev => ({
          ...prev,
          villages: locations.villages[value] || []
        }));
        break;
      default:
        break;
    }
  };

  const renderError = (field) => {
    return errors[field] ? (
      <p className="text-sm text-red-500 mt-1 flex items-center">
        <AlertCircle className="h-4 w-4 mr-1" />
        {errors[field]}
      </p>
    ) : null;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Infrastructure"
      size="2xl"
    >
      <div className="flex flex-col h-[calc(100vh-180px)]">
        {/* Form Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Add New Infrastructure
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Fill in the details below to add a new sports infrastructure
          </p>
        </div>

        {/* Form Content - Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-6">
          <form id="add-infrastructure-form" onSubmit={handleSubmit}>
            <div className="space-y-8 py-6">
              {/* Basic Information Section */}
              <section>
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Basic Information
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enter the main details of the infrastructure
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full"
                      placeholder="Enter infrastructure name"
                      required
                    />
                    {renderError('name')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <Select
                      value={formData.infra_category}
                      onChange={(e) => setFormData({ ...formData, infra_category: parseInt(e.target.value) })}
                      required
                      className="w-full"
                    >
                      <option value="">Select Category</option>
                      {Object.keys(categories).map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </Select>
                    {renderError('infra_category')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <Select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      required
                      className="w-full"
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Under Construction">Under Construction</option>
                      <option value="Under Maintenance">Under Maintenance</option>
                      <option value="Inactive">Inactive</option>
                    </Select>
                    {renderError('status')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Capacity</label>
                    <Input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                      required
                      className="w-full"
                    />
                    {renderError('capacity')}
                  </div>
                </div>
              </section>

              {/* Description */}
              <section>
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Description
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enter a detailed description of the infrastructure
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                    className="w-full"
                  />
                  {renderError('description')}
                </div>
              </section>

              {/* Location Information Section */}
              <section>
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Location Details
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Specify the location hierarchy
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Province */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Province</label>
                    <Select
                      value={formData.location_province}
                      onChange={(e) => handleLocationChange('location_province', e.target.value)}
                      required
                      className="w-full"
                    >
                      <option value="">Select Province</option>
                      {locationData.provinces.map(province => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </Select>
                    {renderError('location_province')}
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-sm font-medium mb-2">District</label>
                    <Select
                      value={formData.location_district}
                      onChange={(e) => handleLocationChange('location_district', e.target.value)}
                      required
                      disabled={!formData.location_province}
                      className="w-full"
                    >
                      <option value="">Select District</option>
                      {locationData.districts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </Select>
                    {renderError('location_district')}
                  </div>

                  {/* Sector */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Sector</label>
                    <Select
                      value={formData.location_sector}
                      onChange={(e) => handleLocationChange('location_sector', e.target.value)}
                      required
                      disabled={!formData.location_district}
                      className="w-full"
                    >
                      <option value="">Select Sector</option>
                      {locationData.sectors.map(sector => (
                        <option key={sector} value={sector}>{sector}</option>
                      ))}
                    </Select>
                    {renderError('location_sector')}
                  </div>

                  {/* Cell */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Cell</label>
                    <Select
                      value={formData.location_cell}
                      onChange={(e) => handleLocationChange('location_cell', e.target.value)}
                      required
                      disabled={!formData.location_sector}
                      className="w-full"
                    >
                      <option value="">Select Cell</option>
                      {locationData.cells.map(cell => (
                        <option key={cell} value={cell}>{cell}</option>
                      ))}
                    </Select>
                    {renderError('location_cell')}
                  </div>

                  {/* Village */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Village</label>
                    <Select
                      value={formData.location_village}
                      onChange={(e) => handleLocationChange('location_village', e.target.value)}
                      required
                      disabled={!formData.location_cell}
                      className="w-full"
                    >
                      <option value="">Select Village</option>
                      {locationData.villages.map(village => (
                        <option key={village} value={village}>{village}</option>
                      ))}
                    </Select>
                    {renderError('location_village')}
                  </div>
                </div>
              </section>

              {/* GPS Coordinates */}
              <section>
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    GPS Coordinates
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enter the GPS coordinates of the infrastructure
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Latitude</label>
                    <Input
                      type="number"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                      required
                      className="w-full"
                    />
                    {renderError('latitude')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Longitude</label>
                    <Input
                      type="number"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                      required
                      className="w-full"
                    />
                    {renderError('longitude')}
                  </div>
                </div>
              </section>

              {/* Additional Information */}
              <section>
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Additional Information
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Provide additional details about the infrastructure
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">UPI</label>
                    <Input
                      value={formData.upi}
                      onChange={(e) => setFormData({ ...formData, upi: e.target.value })}
                      required
                      className="w-full"
                    />
                    {renderError('upi')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Plot Area</label>
                    <Input
                      type="number"
                      value={formData.plot_area}
                      onChange={(e) => setFormData({ ...formData, plot_area: parseFloat(e.target.value) })}
                      required
                      className="w-full"
                    />
                    {renderError('plot_area')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Construction Date</label>
                    <Input
                      type="date"
                      value={formData.construction_date}
                      onChange={(e) => setFormData({ ...formData, construction_date: e.target.value })}
                      required
                      className="w-full"
                    />
                    {renderError('construction_date')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Owner</label>
                    <Input
                      value={formData.owner}
                      onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                      required
                      className="w-full"
                    />
                    {renderError('owner')}
                  </div>
                </div>
              </section>
            </div>
          </form>
        </div>

        {/* Fixed Footer with Action Buttons */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="min-w-[100px] h-10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="add-infrastructure-form"
              className="min-w-[140px] h-10 bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Infrastructure
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddInfrastructureModal;
