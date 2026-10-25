const statusOptions = ['Not started', 'In progress', 'On hold', 'Done'];
const priorityOptions = ['High', 'Medium', 'Low'];
const categoryOptions = ['Research', 'Writing', 'Training', 'Administration', 'Events'];

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
          <a href="https://docs.google.com/spreadsheets/d/107Ej9K3Ztxl6EWqd7k8WtdaXhmXNRnT0tmeBni4V5iM/edit" target="_blank" rel="noreferrer">
            Open Google Sheet ↗
          </a>
        </div>
        {loading ? (
          <p className="empty" role="status">Loading tasks…</p>
        ) : filteredTasks.length ? (
          <div className="table-wrap">
            <table className="task-table">
              <thead>
                <tr>
                  <th scope="col">Task</th>
                  <th scope="col">Status</th>
                  <th scope="col">Priority</th>
                  <th scope="col">Due date</th>
                  <th scope="col">Category</th>
                  <th scope="col">Milestone</th>
                  <th scope="col">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td><strong>{task.title}</strong></td>
                    <td><span className={`task-sheet-badge status-${task.status.toLowerCase().replace(/\s+/g, '-')}`}>{task.status}</span></td>
                    <td><span className={`task-sheet-badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span></td>
                    <td>{task.due_date}</td>
                    <td>{task.category}</td>
                    <td>{task.milestone}</td>
                    <td className="task-notes">{task.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty">{tasks.length ? 'No tasks match these filters.' : 'No tasks yet. Add tasks to the TASKS tab in Google Sheets.'}</p>
        )}
      </div>
    </section>
  );
}

export default TasksPage;
