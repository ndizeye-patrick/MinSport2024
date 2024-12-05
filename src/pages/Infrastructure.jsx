import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import InfrastructureMap from '../components/infrastructure/InfrastructureMap';
import InfrastructureList from '../components/infrastructure/InfrastructureList';
import AddInfrastructureModal from '../components/infrastructure/AddInfrastructureModal';
import BookingManagement from '../components/infrastructure/BookingManagement';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { useDarkMode } from '../contexts/DarkModeContext';
import CategoryManagementModal from '../components/infrastructure/CategoryManagementModal';
import axiosInstance from '../utils/axiosInstance';

const Infrastructure = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const { isDarkMode } = useDarkMode();
  const [categories, setCategories] = useState([]);
  const [infrastructure, setInfrastructure] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchInfrastructure();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/infrastructure-categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchInfrastructure = async () => {
    try {
      const response = await axiosInstance.get('/infrastructures');
      setInfrastructure(response.data);
    } catch (error) {
      console.error('Error fetching infrastructure:', error);
    }
  };

  const updateCategories = async (updatedCategories) => {
    try {
      await axiosInstance.put('/infrastructure-categories', updatedCategories);
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error updating categories:', error);
    }
  };

  const showAddButton = activeTab === 'list';

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Sports Infrastructure
          </h1>
          <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage and monitor sports facilities across the country
          </p>
        </div>
        <div className="flex gap-3">
          {showAddButton && (
            <>
              <Button
                variant="outline"
                onClick={() => setShowCategoryModal(true)}
              >
                Manage Categories
              </Button>
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Infrastructure
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="list" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">
            List View
          </TabsTrigger>
          <TabsTrigger value="map">
            Map View
          </TabsTrigger>
          <TabsTrigger value="bookings">
            Booking Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <InfrastructureList infrastructure={infrastructure} />
        </TabsContent>

        <TabsContent value="map">
          <InfrastructureMap infrastructure={infrastructure} />
        </TabsContent>

        <TabsContent value="bookings">
          <BookingManagement />
        </TabsContent>
      </Tabs>

      <AddInfrastructureModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={fetchInfrastructure}
      />

      <CategoryManagementModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        categories={categories}
        onUpdate={updateCategories}
      />
    </div>
  );
};

export default Infrastructure;
