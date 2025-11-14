import React, { useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import KanbanColumn from "./KanbanColumn";
import TaskCard from "./TaskCard";
import TaskApi from "../../api/TaskApi";

import styles from "../../pages/mentor/TaskManagementPage.module.css";

function KanbanBoard({
  columns, // New prop
  setTasks, // Keep for optimistic updates and reverting
  isLoading,
  onOpenCreateModal,
  onOpenDetailModal,
  onDeleteTask,
  selectedSprintId, // Need this to assign tasks from backlog
}) {
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event) => {
    const { active } = event;
    // Find the active task from all items in all columns
    const task = Object.values(columns)
      .flatMap((col) => col.items)
      .find((t) => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const sourceTask = Object.values(columns)
      .flatMap((col) => col.items)
      .find((t) => t.id === active.id);

    // Find the destination column by checking which column contains the `overId`
    // or if `overId` is a columnId itself.
    const destinationColumnId = Object.keys(columns).find(
      (key) =>
        columns[key].items.some((item) => item.id === overId) || key === overId
    );

    if (!destinationColumnId || !sourceTask) return;

    const sourceColumnId = sourceTask.sprint_Id ? sourceTask.status : 'BACKLOG';

    if (sourceColumnId === destinationColumnId) return; // No change

    // --- API Call Logic ---
    try {
      // Case 1: Moving TO the backlog
      if (destinationColumnId === 'BACKLOG') {
        await TaskApi.batchUpdateTasks({
          action: 'MOVE_TO_BACKLOG',
          taskIds: [activeId],
        });
      } 
      // Case 2: Moving FROM the backlog to a sprint status column
      else if (sourceColumnId === 'BACKLOG') {
        if (!selectedSprintId) {
          alert("Please select a sprint before moving tasks from the backlog.");
          return;
        }
        await TaskApi.batchUpdateTasks({
          action: 'MOVE_TO_SPRINT',
          taskIds: [activeId],
          targetSprintId: selectedSprintId,
        });
        // Also update the status if it's not TODO
        if (destinationColumnId !== 'TODO') {
            await TaskApi.updateTask(activeId, { status: destinationColumnId });
        }
      }
      // Case 3: Moving between status columns within a sprint
      else {
        await TaskApi.updateTask(activeId, { status: destinationColumnId });
      }

      // --- Refresh data ---
      // Instead of an optimistic update, call the refresh function passed from the parent.
      setTasks();

    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Failed to move task. Please try again.");
      // On error, you might still want to refresh to revert any failed optimistic state,
      // but since we're not doing that, this is fine.
    }
  };

  if (isLoading) {
    return <p>Loading tasks...</p>;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.boardContainer}>
        {Object.entries(columns).map(([columnId, column]) => (
          <KanbanColumn
            key={columnId}
            columnId={columnId}
            title={column.name}
            tasks={column.items}
            onOpenCreateModal={() => onOpenCreateModal(columnId)}
            onOpenDetailModal={onOpenDetailModal}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

export default KanbanBoard;