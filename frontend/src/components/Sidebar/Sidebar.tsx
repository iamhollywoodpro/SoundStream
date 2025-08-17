import React from "react";
// If you have Sidebar.css, keep it imported; otherwise Dashboard.css styles handle it
// import "./Sidebar.css";

type Props = {
  currentPage: string;
  setCurrentPage: (page: string) => void;
};

const Sidebar: React.FC<Props> = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: "dashboard", icon: "fas fa-home", label: "Dashboard" },
    { id: "discovery", icon: "fas fa-compass", label: "Discovery" },
    { id: "library", icon: "fas fa-book", label: "Library" },
    { id: "favorites", icon: "fas fa-heart", label: "Favorites" },
    { id: "ai-ar", icon: "fas fa-chart-line", label: "AI A&R" },
    { id: "ai-manager", icon: "fas fa-user-tie", label: "AI Manager" },
    { id: "music-generator", icon: "fas fa-music", label: "Music Generator" },
    { id: "vocal-ai", icon: "fas fa-microphone", label: "Vocal AI" },
    { id: "community", icon: "fas fa-users", label: "Community" },
    { id: "chat", icon: "fas fa-comments", label: "Chat" },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">
          <div className="waveform">
            <div className="wave" />
            <div className="wave" />
            <div className="wave" />
            <div className="wave" />
            <div className="wave" />
          </div>
        </div>
        <span className="logo-text">SoundStream</span>
      </div>

      <nav className="nav-section">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${currentPage === item.id ? "active" : ""}`}
            onClick={() => setCurrentPage(item.id)}
          >
            <i className={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="upload-button" type="button">
        <i className="fas fa-upload" /> Upload Track
      </button>

      <button
        className="analytics-button"
        type="button"
        onClick={() => setCurrentPage("dashboard")}
      >
        <i className="fas fa-chart-bar" /> View Analytics
      </button>
    </aside>
  );
};

export default Sidebar;