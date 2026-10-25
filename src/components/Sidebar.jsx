function Sidebar({ navItems, activeSection, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="brand">Sílvia PhD</div>
      <nav aria-label="Main navigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-button ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onSelect(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
