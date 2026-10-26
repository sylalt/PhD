import { formatTaskDate } from '../utils/date';

const statusOptions = ['Not started', 'In progress', 'On hold', 'Done'];
const priorityOptions = ['High', 'Medium', 'Low'];
const categoryOptions = ['Research', 'Writing', 'Training', 'Administration', 'Events'];

function getMilestoneColorClass(milestone) {
  const milestoneNumber = Number(milestone.match(/^M(\d+)/i)?.[1]);
  if (!milestoneNumber) return '';

  return `task-milestone-color-${((milestoneNumber - 1) % 4) + 1}`;
}

function TasksPage({
  loading,
  tasks,
  filteredTasks,
  taskFilter,
  priorityFilter,
  categoryFilter,
  onTaskFilter,
  onPriorityFilter,
  onCategoryFilter
}) {
  return (
    <section className="page">
      <div className="section-tools task-filters">
        <select value={taskFilter} onChange={(event) => onTaskFilter(event.target.value)} aria-label="Filter tasks by status">
          <option value="all">All statuses</option>
          {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
        <select value={priorityFilter} onChange={(event) => onPriorityFilter(event.target.value)} aria-label="Filter tasks by priority">
          <option value="all">All priorities</option>
          {priorityOptions.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
        </select>
        <select value={categoryFilter} onChange={(event) => onCategoryFilter(event.target.value)} aria-label="Filter tasks by category">
          <option value="all">All categories</option>
          {categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
      </div>

      <div className="card task-table-card">
        <div className="card-head">
          <h2>Tasks</h2>
        </div>
        {loading ? (
          <p className="empty" role="status">Loading tasks…</p>
        ) : (
          <div className="table-wrap">
            <table className="task-table">
              <thead>
                <tr>
                  <th scope="col" aria-label="Task"></th>
                  <th scope="col">Status</th>
                  <th scope="col">Priority</th>
                  <th scope="col">Due date</th>
                  <th scope="col">Category</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length ? filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <div className="task-title-row">
                        {task.milestone && (
                          <span className={`task-milestone ${getMilestoneColorClass(task.milestone)}`}>
                            {task.milestone.split(' - ')[0]}
                          </span>
                        )}
                        {task.notes ? (
                          <details className="task-description-details">
                            <summary><span className="task-title">{task.title}</span></summary>
                            <div className="task-description-content">
                              <p className="task-description">{task.notes}</p>
                            </div>
                          </details>
                        ) : (
                          <span className="task-title">{task.title}</span>
                        )}
                      </div>
                    </td>
                    <td><span className={`task-sheet-badge status-${task.status.toLowerCase().replace(/\s+/g, '-')}`}>{task.status}</span></td>
                    <td><span className={`task-sheet-badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span></td>
                    <td>{formatTaskDate(task.due_date)}</td>
                    <td>{task.category}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="empty">
                      {tasks.length ? 'No tasks match these filters.' : 'No tasks yet. Add tasks to the TASKS tab in Google Sheets.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default TasksPage;
