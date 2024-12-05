/* src/pages/Federations.jsx */
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../components/ui/table';
import {
  Search,
  Plus,
  Filter,
  X,
  MapPin,
  Users,
  Building2,
  Eye,
  Edit,
  Trash2,
  History,
  AlertCircle,
} from 'lucide-react';
import Modal from '../components/ui/Modal';
import AddFederationForm from '../components/forms/AddFederationForm';
import AddPlayerStaffForm from '../components/federation/AddPlayerStaffForm';
import ActionMenu from '../components/ui/ActionMenu';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { toast } from 'sonner';
import { federationApi } from '../services/federation';
import PageLoading from '../components/ui/PageLoading';
import Message from '../components/ui/Message';
import { useDarkMode } from '../contexts/DarkModeContext';
import ManageClubs from '../components/federation/ManageClubs';
import AddClubForm from '../components/federation/AddClubForm';
import { Button } from '../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import PlayerStaffTransfer from '../components/federation/PlayerStaffTransfer';

const Federations = () => {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('Manage Federations and associations');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [isAddFederationModalOpen, setIsAddFederationModalOpen] = useState(false);
  const [isAddClubModalOpen, setIsAddClubModalOpen] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [selectedFederation, setSelectedFederation] = useState(null);
  const [isLoadingClubs, setIsLoadingClubs] = useState(false);
  const [playersStaffData, setPlayersStaffData] = useState([]);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [playerToEdit, setPlayerToEdit] = useState(null);
  const [federations, setFederations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Set to 5 for pagination
  const [filteredFederations, setFilteredFederations] = useState([]);
  const [deletePlayerStaffDialogOpen, setDeletePlayerStaffDialogOpen] = useState(false);
  const [playerStaffToDelete, setPlayerStaffToDelete] = useState(null);

  const tabs = [
    'Manage Federations and associations',
    'Manage Clubs',
    'Manage Players/Staff',
    'Player/Staff Transfer',
    'Players Map',
  ];

  const filterConfig = {
    status: ['Active', 'Inactive', 'Suspended'],
    type: ['Federation', 'Association'],
    location: ['Kigali', 'Eastern', 'Western', 'Northern', 'Southern'],
  };

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const filters = {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
        };
        const [federationsData, federationOptions] = await Promise.all([
          federationApi.getAllFederations(filters),
          federationApi.getFederationOptions(),
        ]);
        setFederations(federationsData);
        setFilteredFederations(federationsData);
      } catch (error) {
        setMessage({
          type: 'error',
          text: error.message || 'Failed to load federations. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage, searchTerm]);

  const handleEditPlayerStaff = (staff) => {
    setPlayerToEdit(staff);
    setIsAddPlayerModalOpen(true);
  };

  const handleAddPlayerStaff = async (playerStaffData) => {
    try {
      setIsLoading(true);
      if (playerToEdit) {
        await federationApi.updatePlayerStaff(playerToEdit.id, playerStaffData);
        setPlayersStaffData((prev) =>
          prev.map((p) => (p.id === playerToEdit.id ? { ...p, ...playerStaffData } : p))
        );
        toast.success('Player/Staff updated successfully');
      } else {
        const newPlayerStaff = await federationApi.createPlayerStaff(playerStaffData);
        setPlayersStaffData((prev) => [...prev, newPlayerStaff]);
        toast.success('Player/Staff added successfully');
      }
      setIsAddPlayerModalOpen(false);
      setPlayerToEdit(null);
    } catch (error) {
      toast.error('Failed to save player/staff');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFederation = async (federationData) => {
    try {
      setIsSubmitting(true);
      const newFederation = await federationApi.createFederation(federationData);
      setFederations((prev) => [...prev, newFederation]);
      setFilteredFederations((prev) => [...prev, newFederation]);
      setIsAddFederationModalOpen(false);
    } catch (error) {
      toast.error('Failed to create federation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (federation) => {
    setFederationToEdit(federation);
    setEditModalOpen(true);
  };

  const handleDelete = async (federation) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage({
        type: 'success',
        text: 'Federation deleted successfully',
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to delete federation',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (federation) => {
    toast.success('Download started');
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(federations.map((federation) => federation.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const statsCards = [
    { icon: Building2, label: 'Total Federations', value: '12', color: 'bg-blue-100 text-blue-600' },
    { icon: Users, label: 'Total Players', value: '2,450', color: 'bg-green-100 text-green-600' },
    { icon: Users, label: 'Total Staff', value: '156', color: 'bg-purple-100 text-purple-600' },
    { icon: MapPin, label: 'Locations', value: '32', color: 'bg-orange-100 text-orange-600' },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedItem(null);
    setShowAddModal(false);
    setShowDeleteDialog(false);

    switch (tab) {
      case 'Add Federation or association':
        setModalType('federation');
        setShowAddModal(true);
        break;
      case 'Add Player/Staff':
        setModalType('playerStaff');
        setShowAddModal(true);
        break;
      case 'Player/Staff Transfer':
        setModalType('transfer');
        setShowAddModal(true);
        break;
      default:
        setModalType(null);
    }
  };

  const handleAddClub = async (clubData) => {
    try {
      setIsSubmitting(true);
      const newClub = await federationApi.addClub(selectedFederation.id, clubData);
      setClubs((prev) => [...prev, newClub]);
      setIsAddClubModalOpen(false);
    } catch (error) {
      console.error('Failed to add club:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClub = async (clubId, clubData) => {
    try {
      setIsSubmitting(true);
      const updatedClub = await federationApi.updateClub(selectedFederation.id, clubId, clubData);
      setClubs((prev) => prev.map((club) => (club.id === clubId ? updatedClub : club)));
    } catch (error) {
      console.error('Failed to update club:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClub = async (clubId) => {
    try {
      setIsSubmitting(true);
      await federationApi.deleteClub(selectedFederation.id, clubId);
      setClubs((prev) => prev.filter((club) => club.id !== clubId));
    } catch (error) {
      console.error('Failed to delete club:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManageClubs = async (federation) => {
    setSelectedFederation(federation);
    setIsLoadingClubs(true);
    try {
      const clubsData = await federationApi.getClubs(federation.id);
      setClubs(clubsData);
    } catch (error) {
      console.error('Failed to load clubs:', error);
    } finally {
      setIsLoadingClubs(false);
    }
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFederations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFederations.length / itemsPerPage);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [federationToEdit, setFederationToEdit] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [federationToDelete, setFederationToDelete] = useState(null);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);

  const handleEditSubmit = async (updatedData) => {
    try {
      setIsSubmitting(true);
      const updated = await federationApi.updateFederation(federationToEdit.id, updatedData);
      const updatedFederations = federations.map((fed) =>
        fed.id === federationToEdit.id ? updated : fed
      );
      setFederations(updatedFederations);
      setFilteredFederations(updatedFederations);
      setEditModalOpen(false);
      setFederationToEdit(null);
    } catch (error) {
      toast.error('Failed to update federation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (federation) => {
    setFederationToDelete(federation);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsSubmitting(true);
      await federationApi.deleteFederation(federationToDelete.id);
      const updatedFederations = federations.filter((fed) => fed.id !== federationToDelete.id);
      setFederations(updatedFederations);
      setFilteredFederations(updatedFederations);
      setDeleteModalOpen(false);
      setFederationToDelete(null);
    } catch (error) {
      toast.error('Failed to delete federation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkDeleteConfirm = async () => {
    try {
      const updatedFederations = federations.filter((fed) => !selectedRows.includes(fed.id));
      setFederations(updatedFederations);
      setFilteredFederations(updatedFederations);
      setSelectedRows([]);
      setBulkDeleteModalOpen(false);
      toast.success(`${selectedRows.length} federations deleted successfully`);
    } catch (error) {
      toast.error('Failed to delete federations');
    }
  };

  const [filteredPlayersStaff, setFilteredPlayersStaff] = useState(playersStaffData);
  const [playerFilters, setPlayerFilters] = useState({
    search: '',
    type: '',
    federation: '',
    club: '',
  });

  useEffect(() => {
    const fetchPlayersStaff = async () => {
      try {
        setIsLoading(true);
        const response = await federationApi.getAllPlayersStaff();
        setPlayersStaffData(response || []);
        setFilteredPlayersStaff(response || []);
      } catch (error) {
        console.error('Failed to fetch players/staff:', error);
        toast.error('Failed to fetch players/staff');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayersStaff();
  }, []);

  const handlePlayerSearch = async (value) => {
    const newFilters = { ...playerFilters, search: value };
    setPlayerFilters(newFilters);
  };

  const handleTypeFilter = async (value) => {
    const newFilters = { ...playerFilters, type: value };
    setPlayerFilters(newFilters);
  };

  const handleFederationFilter = async (value) => {
    const newFilters = { ...playerFilters, federation: value };
    setPlayerFilters(newFilters);
  };

  const handleClubFilter = async (value) => {
    const newFilters = { ...playerFilters, club: value };
    setPlayerFilters(newFilters);
  };

  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedSearch, setAdvancedSearch] = useState({
    type: '',
    federation: '',
    club: '',
  });

  const handleAdvancedSearch = (value, field) => {
    setAdvancedSearch((prev) => ({
      ...prev,
      [field]: value,
    }));

    const filtered = playersStaffData.filter((person) => {
      const matchesType = !advancedSearch.type || person.type === advancedSearch.type;
      const matchesFederation = !advancedSearch.federation || person.federation === advancedSearch.federation;
      const matchesClub = !advancedSearch.club || person.club === advancedSearch.club;

      return matchesType && matchesFederation && matchesClub;
    });

    setFilteredPlayersStaff(filtered);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setAdvancedSearch({
      type: '',
      federation: '',
      club: '',
    });
    setFilteredPlayersStaff(playersStaffData);
    setCurrentPage(1);
  };

  const handleDeletePlayerStaffClick = (playerStaff) => {
    setPlayerStaffToDelete(playerStaff);
    setDeletePlayerStaffDialogOpen(true);
  };

  const handleDeletePlayerStaffConfirm = async () => {
    try {
      setIsSubmitting(true);
      await federationApi.deletePlayerStaff(playerStaffToDelete.id);
      const updatedPlayersStaff = playersStaffData.filter((ps) => ps.id !== playerStaffToDelete.id);
      setPlayersStaffData(updatedPlayersStaff);
      setFilteredPlayersStaff(updatedPlayersStaff);
      setDeletePlayerStaffDialogOpen(false);
      setPlayerStaffToDelete(null);
      toast.success('Player/Staff deleted successfully');
    } catch (error) {
      toast.error('Failed to delete player/staff');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (activeTab === 'Manage Federations and associations') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <Button
              onClick={() => setIsAddFederationModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Federation
            </Button>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search federations..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  className="border rounded px-2 py-1"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px] text-xs">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedRows.length === currentItems.length}
                        onChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="min-w-[180px] text-xs">Name</TableHead>
                    <TableHead className="w-[80px] text-xs">Acronym</TableHead>
                    <TableHead className="w-[100px] text-xs">Year Founded</TableHead>
                    <TableHead className="min-w-[180px] text-xs">Legal Representative</TableHead>
                    <TableHead className="min-w-[120px] text-xs">Address</TableHead>
                    <TableHead className="w-[80px] text-xs">Operation</TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {currentItems.map((federation) => (
                  <TableRow key={federation.id}>
                    <TableCell className="text-xs">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedRows.includes(federation.id)}
                        onChange={() => {
                          if (selectedRows.includes(federation.id)) {
                            setSelectedRows(selectedRows.filter((id) => id !== federation.id));
                          } else {
                            setSelectedRows([...selectedRows, federation.id]);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-xs font-medium">{federation.name}</TableCell>
                    <TableCell className="text-xs">{federation.acronym}</TableCell>
                    <TableCell className="text-xs">{federation.yearFounded}</TableCell>
                    <TableCell className="text-xs">{federation.legalRepresentativeNam}</TableCell>
                    <TableCell className="text-xs">{federation.address}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-0.5">
                        <ActionMenu
                          onEdit={() => handleEdit(federation)}
                          onDelete={() => handleDeleteClick(federation)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="flex items-center text-sm text-gray-500">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredFederations.length)} of{' '}
                {filteredFederations.length} entries
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index + 1}
                    variant={currentPage === index + 1 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'Manage Clubs':
        return (
          <ManageClubs
            onAdd={handleAddClub}
            onEdit={handleEditClub}
            onDelete={handleDeleteClub}
            federations={federations}
            isLoading={isLoading}
          />
        );

      case 'Manage Players/Staff':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <Button
                onClick={() => {
                  setPlayerToEdit(null);
                  setIsAddPlayerModalOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Player/Staff
              </Button>

              <div className="flex flex-col gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Quick search..."
                      className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"
                      onChange={(e) => handlePlayerSearch(e.target.value, 'all')}
                    />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    {showAdvancedSearch ? 'Hide Filters' : 'Show Filters'}
                  </Button>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show:</span>
                    <select
                      className="border rounded px-2 py-1"
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>

                {showAdvancedSearch && (
                  <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          className="w-full border rounded-lg px-3 py-2"
                          value={playerFilters.type}
                          onChange={(e) => handleTypeFilter(e.target.value)}
                        >
                          <option value="">All Types</option>
                          <option value="Player">Player</option>
                          <option value="Staff">Staff</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Federation</label>
                        <select
                          className="w-full border rounded-lg px-3 py-2"
                          value={playerFilters.federation}
                          onChange={(e) => handleFederationFilter(e.target.value)}
                        >
                          <option value="">All Federations</option>
                          {federations.map((fed) => (
                            <option key={fed.id} value={fed.id}>
                              {fed.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Club</label>
                        <select
                          className="w-full border rounded-lg px-3 py-2"
                          value={playerFilters.club}
                          onChange={(e) => handleClubFilter(e.target.value)}
                        >
                          <option value="">All Clubs</option>
                          <option value="APR FC">APR FC</option>
                          <option value="Patriots BBC">Patriots BBC</option>
                        </select>
                      </div>

                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setPlayerFilters({
                              search: '',
                              type: '',
                              federation: '',
                              club: '',
                            });
                            setFilteredPlayersStaff(playersStaffData);
                          }}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px] text-xs">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </TableHead>
                    <TableHead className="min-w-[200px] text-xs">Name</TableHead>
                    <TableHead className="w-[100px] text-xs">Type</TableHead>
                    <TableHead className="min-w-[200px] text-xs">Federation</TableHead>
                    <TableHead className="w-[120px] text-xs">Club</TableHead>
                    <TableHead className="w-[120px] text-xs">Age/Date of birth</TableHead>
                    <TableHead className="w-[100px] text-xs">Nationality</TableHead>
                    <TableHead className="w-[120px] text-xs">Operation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlayersStaff.slice(indexOfFirstItem, indexOfLastItem).map((person) => (
                    <TableRow key={person.id}>
                      <TableCell>
                        <input type="checkbox" className="rounded border-gray-300" />
                      </TableCell>
                      <TableCell className="font-medium">{`${person.firstName} ${person.lastName}`}</TableCell>
                      <TableCell>{person.type}</TableCell>
                      <TableCell>{person.federation.name}</TableCell>
                      <TableCell>{person.currentClub.name}</TableCell>
                      <TableCell>{new Date(person.dateOfBirth).toLocaleDateString()}</TableCell>
                      <TableCell>{person.nationality}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <button className="p-1 rounded-lg hover:bg-gray-100" title="View Details">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditPlayerStaff(person)}
                            className="p-1 rounded-lg hover:bg-gray-100"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePlayerStaffClick(person)}
                            className="p-1 rounded-lg hover:bg-red-50 text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button className="p-1 rounded-lg hover:bg-gray-100" title="View Transfer History">
                            <History className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <div className="flex items-center text-sm text-gray-500">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPlayersStaff.length)} of{' '}
                  {filteredPlayersStaff.length} entries
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {[...Array(totalPages)].map((_, index) => (
                    <Button
                      key={index + 1}
                      variant={currentPage === index + 1 ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Player/Staff Transfer':
        return <PlayerStaffTransfer />;

      case 'Players Map':
        return (
          <div className="space-y-6">
            {/* Players Map Component */}
            {/* Add map visualization component here */}
          </div>
        );

      default:
        return null;
    }
  };

  const renderForm = () => {
    return (
      <AddFederationForm
        onSubmit={(data) => {
          console.log('New federation:', data);
          setShowAddModal(false);
          toast.success('Federation added successfully');
        }}
        onCancel={() => setShowAddModal(false)}
      />
    );
  };

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {message && (
        <Message type={message.type} message={message.text} onClose={() => setMessage(null)} />
      )}

      <div className="mb-6 overflow-x-auto">
        <nav className="flex space-x-4 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {renderContent()}

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          if (!isSubmitting) {
            setShowAddModal(false);
            setSelectedItem(null);
          }
        }}
        title="Add Federation"
      >
        {renderForm()}
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => !isSubmitting && setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title={`Delete ${modalType}`}
        message={`Are you sure you want to delete this ${modalType}? This action cannot be undone.`}
        isSubmitting={isSubmitting}
      />

      <Modal
        isOpen={isAddFederationModalOpen}
        onClose={() => setIsAddFederationModalOpen(false)}
        title="Add Federation"
      >
        <AddFederationForm
          onSubmit={handleAddFederation}
          onCancel={() => setIsAddFederationModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isAddClubModalOpen}
        onClose={() => setIsAddClubModalOpen(false)}
        title="Add Club"
        className="max-h-[90vh]"
      >
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <AddClubForm
            onSubmit={(data) => {
              console.log('New club:', data);
              setIsAddClubModalOpen(false);
              toast.success('Club added successfully');
            }}
            onCancel={() => setIsAddClubModalOpen(false)}
          />
        </div>
      </Modal>

      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Federation"
        className="max-w-4xl"
      >
        <div className="max-h-[80vh] overflow-y-auto">
          <AddFederationForm
            initialData={federationToEdit}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditModalOpen(false)}
            isEditing={true}
          />
        </div>
      </Modal>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="py-4">
              Are you sure you want to delete{' '}
              <span className="font-semibold">{federationToDelete?.name}</span>? This action cannot be undone and will
              remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete Federation
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkDeleteModalOpen} onOpenChange={setBulkDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Confirm Bulk Deletion
            </DialogTitle>
            <DialogDescription className="py-4">
              Are you sure you want to delete {selectedRows.length} federations? This action cannot be undone and will
              remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setBulkDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDeleteConfirm}>
              Delete {selectedRows.length} Federations
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deletePlayerStaffDialogOpen} onOpenChange={setDeletePlayerStaffDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="py-4">
              Are you sure you want to delete{' '}
              <span className="font-semibold">
                {playerStaffToDelete?.firstName} {playerStaffToDelete?.lastName}
              </span>
              ? This action cannot be undone and will remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeletePlayerStaffDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePlayerStaffConfirm}>
              Delete Player/Staff
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Modal
        isOpen={isAddPlayerModalOpen}
        onClose={() => {
          setIsAddPlayerModalOpen(false);
          setPlayerToEdit(null);
        }}
        title={playerToEdit ? 'Edit Player/Staff' : 'Add Player/Staff'}
      >
        <AddPlayerStaffForm onSubmit={handleAddPlayerStaff} onCancel={() => setIsAddPlayerModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Federations;

