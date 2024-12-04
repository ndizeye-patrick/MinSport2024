import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import axiosInstance from '../../utils/axiosInstance';

const CategoryManagementModal = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/infrastructure-categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }

    try {
      const response = await axiosInstance.post('/infrastructure-categories', { name: newCategory });
      setCategories(prev => [...prev, response.data]);
      setNewCategory('');
      toast.success('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await axiosInstance.delete(`/infrastructure-categories/${categoryId}`);
      setCategories(prev => prev.filter(category => category.id !== categoryId));
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const handleEdit = (category) => {
    setEditMode(category.id);
    setEditValue(category.name);
  };

  const handleSaveEdit = async () => {
    if (!editValue.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      const response = await axiosInstance.put(`/infrastructure-categories/${editMode}`, { name: editValue });
      setCategories(prev => prev.map(category => 
        category.id === editMode ? response.data : category
      ));
      setEditMode(null);
      setEditValue('');
      toast.success('Updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Categories"
      size="2xl"
    >
      <div className="flex flex-col h-[calc(100vh-180px)]">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Category Management
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add and manage categories
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            <section className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-base font-semibold mb-4">Add New Category</h3>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAddCategory}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus className="h-4 w-4" />
                  Add Category
                </Button>
              </div>
            </section>

            <section>
              <h3 className="text-base font-semibold mb-4">Current Categories</h3>
              <div className="space-y-4">
                {categories.map(category => (
                  <div key={category.id} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 flex items-center justify-between">
                      {editMode === category.id ? (
                        <div className="flex gap-2 flex-1">
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1"
                          />
                          <Button onClick={handleSaveEdit}>Save</Button>
                          <Button variant="outline" onClick={() => setEditMode(null)}>Cancel</Button>
                        </div>
                      ) : (
                        <>
                          <h4 className="font-medium text-lg">{category.name}</h4>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(category)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CategoryManagementModal;
