function PapersPage({
  paperSearch,
  paperStatus,
  paperStream,
  filteredPapers,
  allStreamOptions,
  onSearch,
  onStatusChange,
  onStreamChange
}) {
  return (
    <section className="page">
      <div className="section-tools">
        <input
          type="search"
          value={paperSearch}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search papers..."
          aria-label="Search papers"
        />
        <select value={paperStatus} onChange={(event) => onStatusChange(event.target.value)} aria-label="Filter papers by status">
          <option value="">All statuses</option>
          <option value="Unread">Unread</option>
          <option value="Reading">Reading</option>
          <option value="Read">Read</option>
        </select>
        <select value={paperStream} onChange={(event) => onStreamChange(event.target.value)} aria-label="Filter by literature stream">
          <option value="">All literature streams</option>
          {allStreamOptions.map((stream) => (
            <option key={stream} value={stream}>{stream}</option>
          ))}
        </select>
      </div>

      <div className="card paper-table-card">
        <div className="card-head">
          <h2>Papers</h2>
        </div>
        <div className="table-wrap">
          <table className="paper-table">
            <thead>
              <tr>
                <th>Author(s)</th>
                <th>Year</th>
                <th>Title</th>
                <th>Literature stream</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPapers.length ? (
                filteredPapers.map((paper, index) => (
                  <tr key={`${paper.title}-${index}`}>
                    <td className="paper-author">{paper.author}</td>
                    <td className="paper-year">{paper.year}</td>
                    <td className="paper-title">
                      {paper.link && paper.link !== '#' ? (
                        <a href={paper.link} target="_blank" rel="noreferrer">{paper.title}</a>
                      ) : (
                        paper.title
                      )}
                    </td>
                    <td className="paper-metadata">{paper.stream}</td>
                    <td className="paper-status">
                      <span className={`task-sheet-badge paper-status-badge${paper.read ? ` status-${paper.read.toLowerCase()}` : ''}`}>
                        {paper.read}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty">No papers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default PapersPage;
