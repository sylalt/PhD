import StatCard from '../components/StatCard';
import FromYourReading from '../components/FromYourReading';
import formatDate from '../utils/date';

function DashboardPage({
  papers,
  quotes,
  quotesStatus,
  outstandingTasks,
  nextMeeting,
  overallProgress,
  onViewProgress,
  onViewTasks
}) {
  return (
    <section className="page dashboard-page">
      <div className="stats-grid">
        <StatCard label="Total papers" value={papers.length} tone="lavender" />
        <StatCard label="Unread papers" value={papers.filter((paper) => paper.read === 'Unread').length} tone="peach" />
        <StatCard label="Currently reading" value={papers.filter((paper) => paper.read === 'Reading').length} tone="blue" />
        <StatCard label="Outstanding tasks" value={outstandingTasks.length} tone="sage" />
      </div>

      <div className="grid two">
        <article className="card dashboard-card dashboard-progress-card">
          <div className="card-head">
            <h2>PhD progress</h2>
            <span className="dashboard-progress-value">{overallProgress}%</span>
          </div>
          <div className="progress dashboard-progress" role="progressbar" aria-label="Overall PhD progress" aria-valuenow={overallProgress} aria-valuemin="0" aria-valuemax="100">
            <div style={{ width: `${overallProgress}%` }} />
          </div>
          <p className="muted">Your PhD journey at a glance, with progress reflecting the importance of each goal, milestone and task.</p>
          <button type="button" className="button secondary" onClick={() => onViewProgress()}>
            View PhD roadmap →
          </button>
        </article>

        <article className="card dashboard-card dashboard-meeting-card">
          <div className="card-head">
            <h2>Upcoming supervisor meeting</h2>
          </div>
          {nextMeeting ? (
            <div className="dashboard-meeting">
              <strong>{nextMeeting.title}</strong>
              <time className="dashboard-date-badge meeting-date" dateTime={nextMeeting.date}>{formatDate(nextMeeting.date)}</time>
              <div className="muted">{nextMeeting.agenda}</div>
            </div>
          ) : (
            <div className="empty">No meetings added yet.</div>
          )}
        </article>
      </div>

      <div className="grid two">
        <article className="card dashboard-card dashboard-tasks-card">
          <div className="card-head">
            <h2>Outstanding tasks</h2>
            <button type="button" className="text-button" onClick={() => onViewTasks()}>View all</button>
          </div>
          <div className="list">
            {outstandingTasks.length ? (
              outstandingTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="list-item">
                  <span className="dashboard-date-badge task-date">{task.title}</span>
                  {task.due_date
                    ? <time className="muted" dateTime={task.due_date}>Due: {formatDate(task.due_date, true)}</time>
                    : <span className="muted">No due date</span>}
                </div>
              ))
            ) : (
              <div className="empty">All tasks are done.</div>
            )}
          </div>
        </article>

        <FromYourReading quotes={quotes} status={quotesStatus} />
      </div>
    </section>
  );
}

export default DashboardPage;
