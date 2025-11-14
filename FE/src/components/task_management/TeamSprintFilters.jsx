import React from "react";
import Select, { components } from "react-select";
import { Plus, Pencil, CheckSquare } from "lucide-react";
import styles from "../../pages/mentor/TaskManagementPage.module.css";

const sprintStatusColors = {
  TODO: "#4299e1", // blue
  IN_PROGRESS: "#48bb78", // green
  DONE: "#a0aec0", // gray
};

const { Option } = components;
const SprintOption = (props) => (
  <Option {...props}>
    <div style={{ display: "flex", alignItems: "center" }}>
      <span
        style={{
          backgroundColor: sprintStatusColors[props.data.status],
          borderRadius: "50%",
          width: "10px",
          height: "10px",
          marginRight: "10px",
        }}
      />
      {props.data.label}
    </div>
  </Option>
);

function TeamSprintFilters({
  teams,
  sprints,
  selectedTeamId,
  selectedSprintId,
  onTeamChange,
  onSprintChange,
  isLoadingSprints,
  onOpenCreateSprintModal,
  onOpenEditSprintModal,
  onOpenReviewModal, // New prop
  getSprintStatus,
  isInternView = false,
}) {
  const teamOptions = teams?.map((team) => ({
    value: team.id,
    label: team.teamName,
  }));

  const sprintOptions = sprints.map((sprint) => ({
    value: sprint.id,
    label: `${sprint.name} (${sprint.startDate} to ${sprint.endDate})`,
    status: getSprintStatus(sprint),
  }));

  const selectedTeam = teamOptions?.find(
    (option) => option.value === selectedTeamId
  );
  const selectedSprint = sprintOptions.find(
    (option) => option.value === selectedSprintId
  );

  const isSprintFinished = selectedSprint && selectedSprint.status === 'DONE';

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#edf2f7',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      minWidth: '250px',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#cbd5e0',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#4299e1' : state.isFocused ? '#ebf8ff' : 'white',
      color: state.isSelected ? 'white' : '#2d3748',
    }),
  };

  const Legend = () => (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
      {Object.entries(sprintStatusColors).map(([status, color]) => (
        <div key={status} style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: '#4a5568' }}>
          <span style={{ backgroundColor: color, borderRadius: '50%', width: '10px', height: '10px', marginRight: '5px' }} />
          {status === 'TODO' ? 'Upcoming' : status === 'IN_PROGRESS' ? 'Ongoing' : 'Finished'}
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.filtersContainer}>
      {!isInternView && (
        <div className={styles.filterGroup}>
          <label htmlFor="team-select" className={styles.filterLabel}>
            Team
          </label>
          <Select
            id="team-select"
            value={selectedTeam}
            onChange={onTeamChange}
            options={teamOptions}
            styles={customSelectStyles}
            isClearable
            placeholder="-- Select a Team --"
          />
        </div>
      )}

      <div className={styles.filterGroup} style={{ flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="sprint-select" className={styles.filterLabel}>
            Sprint
          </label>
          <Legend />
        </div>
        <Select
          id="sprint-select"
          value={selectedSprint}
          onChange={onSprintChange}
          options={sprintOptions}
          components={{ Option: SprintOption }}
          styles={customSelectStyles}
          isClearable
          isLoading={isLoadingSprints}
          isDisabled={!isInternView && !selectedTeamId || isLoadingSprints}
          placeholder="-- Select a Sprint --"
        />
      </div>
      
      {!isInternView && (
        <>
          <div style={{ alignSelf: 'flex-end' }}>
            <button 
              onClick={onOpenCreateSprintModal} 
              disabled={!selectedTeamId}
              title="Create New Sprint"
              className={styles.actionButton}
            >
              <Plus size={16} /> Create Sprint
            </button>
          </div>

          <div style={{ alignSelf: 'flex-end' }}>
            <button 
              onClick={onOpenEditSprintModal} 
              disabled={!selectedSprintId}
              title="Edit Selected Sprint"
              className={styles.actionButton}
            >
              <Pencil size={16} /> Edit Sprint
            </button>
          </div>

          <div style={{ alignSelf: 'flex-end' }}>
            <button 
              onClick={() => onOpenReviewModal(selectedSprintId)} 
              disabled={!isSprintFinished}
              title="Review Finished Sprint"
              className={styles.actionButton}
            >
              <CheckSquare size={16} /> Review Sprint
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TeamSprintFilters;
