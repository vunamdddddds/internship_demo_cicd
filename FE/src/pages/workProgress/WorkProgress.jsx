// src/pages/workProgress/WorkProgress.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import WorkFilters from "./WorkFilters";
import TaskTable from "./TaskTable";
import TaskDetail from "./TaskDetail";
import { getTasks } from "~/services/TaskService";

const WorkProgress = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const [filters, setFilters] = useState({
    keyWord: searchParams.get("keyWord") || "",
    status: searchParams.get("status") || "",
  });

  const [appliedFilters, setAppliedFilters] = useState({ ...filters });

  // CẬP NHẬT URL (chỉ keyWord & status)
  useEffect(() => {
    const params = {};
    if (appliedFilters.keyWord) params.keyWord = appliedFilters.keyWord;
    if (appliedFilters.status) params.status = appliedFilters.status;
    setSearchParams(params);
  }, [appliedFilters]);

  // LẤY TOÀN BỘ DỮ LIỆU (không phân trang)
  useEffect(() => {
    fetchTasks();
  }, [appliedFilters]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks({
        keyword: appliedFilters.keyWord,
        status: appliedFilters.status,
        // Không gửi page → backend mặc định trả hết
      });
      setTasks(data.content || data || []); // Hỗ trợ cả phân trang & không
    } catch (error) {
      toast.error("Lỗi tải dữ liệu!");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // CẬP NHẬT TASK QUA API TRONG TaskDetail
  const handleTaskUpdate = (taskId, update) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              ...(update.type === "updateStatus" ? { status: update.status } : {}),
              subtasks:
                update.type === "addSubtask"
                  ? [...t.subtasks, update.subtask]
                  : update.type === "deleteSubtask"
                  ? t.subtasks.filter((s) => s.id !== update.subId)
                  : update.type === "updateSubtask"
                  ? t.subtasks.map((s) =>
                      s.id === update.subId
                        ? { ...s, [update.field]: update.value }
                        : s
                    )
                  : t.subtasks,
            }
          : t
      )
    );
  };

  // HIỂN THỊ CHI TIẾT
  if (selectedTask) {
    return (
      <TaskDetail
        task={selectedTask}
        onBack={() => setSelectedTask(null)}
        onTaskUpdate={handleTaskUpdate}
      />
    );
  }

  return (
    <>
      <WorkFilters
        filters={filters}
        onFilterChange={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
        onSearch={() => setAppliedFilters({ ...filters })}
      />
      <TaskTable
        tasks={tasks}
        loading={loading}
        onTaskClick={setSelectedTask}
        onStatusChange={(taskId, status) =>
          handleTaskUpdate(taskId, { type: "updateStatus", status })
        }
      />
    </>
  );
};

export default WorkProgress;