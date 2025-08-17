import React from "react";
import "./SettingsModal.css";
const SettingsModal = ({ onClose }: { onClose: () => void }) => (
  <div className="modal-overlay active">
    <div className="modal-content">
      <div className="modal-header">
        <h2>Settings</h2>
        <button className="close-button" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="modal-body">
        <div className="checkbox-group">
          <input type="checkbox" id="notifications" defaultChecked />
          <label htmlFor="notifications">Email Notifications</label>
        </div>
        <div className="checkbox-group">
          <input type="checkbox" id="autoplay" defaultChecked />
          <label htmlFor="autoplay">Autoplay</label>
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={onClose}>
          Save
        </button>
      </div>
    </div>
  </div>
);
export default SettingsModal;