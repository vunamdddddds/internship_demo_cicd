import React, { useState, useEffect, useCallback } from "react";
import InternApi from "../../api/internApi"; // Corrected import path
import SprintApi from "../../api/SprintApi";
import TaskApi from "../../api/TaskApi";
import TeamSprintFilters from "../../components/task_management/TeamSprintFilters";
import KanbanBoard from "../../components/task_management/KanbanBoard";
import CreateTaskModal from "../../components/task_management/CreateTaskModal";
import TaskDetailModal from "../../components/task_management/TaskDetailModal";
import ConfirmationModal from "../../components/task_management/ConfirmationModal";
import styles from "../mentor/TaskManagementPage.module.css"; // Re-use the same styles

function MyWorkPage() {
  // Data states
  const [sprints, setSprints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teamDetails, setTeamDetails] = useState(null);

  // Selection states
  const [selectedSprintId, setSelectedSprintId] = useState("");

  // Loading states
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingSprints, setIsLoadingSprints] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  // Modal states
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  
  // Data for modals
  const [itemToDelete, setItemToDelete] = useState({ id: null, type: null });
  const [selectedTask, setSelectedTask] = useState(null);
  const [initialStatusForCreate, setInitialStatusForCreate] = useState("TODO");

  // --- Modal Handlers (Task) ---
  const handleOpenCreateTaskModal = (status) => {
    setInitialStatusForCreate(status);
    setIsCreateTaskModalOpen(true);
  };
  const handleCloseCreateTaskModal = () => setIsCreateTaskModalOpen(false);

  const handleOpenDetailModal = (task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };
  const handleCloseDetailModal = () => setIsDetailModalOpen(false);

  const handleOpenDeleteTaskModal = (taskId) => {
    setItemToDelete({ id: taskId, type: 'task' });
    setIsDeleteConfirmationOpen(true);
  };

  // --- Generic Confirmation Modal Handlers ---
  const handleCloseDeleteConfirmation = () => {
    setItemToDelete({ id: null, type: null });
    setIsDeleteConfirmationOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete.id || itemToDelete.type !== 'task') return;

    try {
      await TaskApi.deleteTask(itemToDelete.id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== itemToDelete.id));
    } catch (error) {
      console.error(`Failed to delete ${itemToDelete.type}:`, error);
      alert(`Failed to delete ${itemToDelete.type}. Please try again.`);
    } finally {
      handleCloseDeleteConfirmation();
    }
  };

  // --- API Calls ---
  useEffect(() => {
    const fetchMyProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const response = await InternApi.getMe();
        setTeamDetails(response.teamDetails || null);
      } catch (error) {
        console.error("Failed to fetch intern profile:", error);
        setTeamDetails(null);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    fetchMyProfile();
  }, []);

  const fetchSprints = useCallback(async () => {
    if (!teamDetails?.id) return;
    setIsLoadingSprints(true);
    try {
      const response = await SprintApi.getSprintsByTeam(teamDetails.id);
      setSprints(response.data || []);
    } catch (error) {
      console.error("Failed to fetch sprints:", error);
      setSprints([]);
    } finally {
      setIsLoadingSprints(false);
    }
  }, [teamDetails]);

  const fetchTasks = useCallback(async () => {
    if (!selectedSprintId) return;
    setIsLoadingTasks(true);
    try {
      const response = await TaskApi.getTasksBySprint(selectedSprintId);
      setTasks(response.data || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setTasks([]);
    } finally {
      setIsLoadingTasks(false);
    }
  }, [selectedSprintId]);

  useEffect(() => {
    fetchSprints();
  }, [fetchSprints]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const getSprintStatus = (sprint) => {
    const today = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    today.setHours(0, 0, 0, 0);
    
    if (today < startDate) return "TODO";
    if (today > endDate) return "DONE";
    return "IN_PROGRESS";
  };

  if (isLoadingProfile) {
    return <div className={styles.pageContainer}><p>Loading your profile...</p></div>;
  }

  if (!teamDetails) {
    return <div className={styles.pageContainer}><p>It seems you are not assigned to a team yet.</p></div>;
  }

  const sprintTasks = tasks.filter(task => task.status !== 'CANCELLED');

  const columns = {
    TODO: { name: "To Do", items: sprintTasks.filter(t => t.status === 'TODO') },
    IN_PROGRESS: { name: "In Progress", items: sprintTasks.filter(t => t.status === 'IN_PROGRESS') },
    DONE: { name: "Done", items: sprintTasks.filter(t => t.status === 'DONE') },
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Work</h1>
        <p style={{ margin: 0, color: '#718096' }}>Team: {teamDetails.teamName}</p>
      </header>
      
      <TeamSprintFilters
        sprints={sprints}
        selectedSprintId={selectedSprintId}
        onSprintChange={(selectedOption) => setSelectedSprintId(selectedOption ? selectedOption.value : "")}
        isLoadingSprints={isLoadingSprints}
        getSprintStatus={getSprintStatus}
        isInternView={true}
      />
      
      <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

      {selectedSprintId ? (
        <KanbanBoard
          columns={columns}
          setTasks={fetchTasks}
          isLoading={isLoadingTasks}
          onOpenCreateModal={handleOpenCreateTaskModal}
          onOpenDetailModal={handleOpenDetailModal}
          onDeleteTask={handleOpenDeleteTaskModal}
          selectedSprintId={selectedSprintId}
        />
      ) : (
        <p style={{ textAlign: 'center', marginTop: '40px', color: '#718096' }}>
          Please select a sprint to see your tasks.
        </p>
      )}

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={handleCloseCreateTaskModal}
        sprintId={selectedSprintId}
        initialStatus={initialStatusForCreate}
        teamMembers={teamDetails?.members || []}
        onTaskCreated={fetchTasks}
      />
      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        task={selectedTask}
        teamMembers={teamDetails?.members || []}
        onTaskUpdated={fetchTasks}
      />
      <ConfirmationModal
        isOpen={isDeleteConfirmationOpen}
        onClose={handleCloseDeleteConfirmation}
        onConfirm={handleConfirmDelete}
        title={`Confirm ${itemToDelete.type} Deletion`}
        message={`Are you sure you want to delete this ${itemToDelete.type}? This action cannot be undone.`}
      />
    </div>
  );
}

export default MyWorkPage;
