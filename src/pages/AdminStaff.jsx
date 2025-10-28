import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { adminAPI } from "../services/api";
import "../App.css";

function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await adminAPI.getStaff();
        if (isMounted) setStaff(data);
      } catch (e) {
        setStaff([]);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null); // For edit modal
  const [selectedIds, setSelectedIds] = useState([]); // For delete checkboxes
  const [selectAll, setSelectAll] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  // Handle Add Staff
  const handleAddStaff = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone
    ) {
      alert("All fields are required!");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg("");
      const res = await adminAPI.addStaff(formData);
      setStaff((prev) => [...prev, res.staff]);
      setShowAddModal(false);
      setFormData({ name: "", email: "", password: "", phone: "" });
    } catch (e) {
      const msg = e?.response?.data?.error || "Failed to add staff";
      setErrorMsg(msg);
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Staff
  const handleEditStaff = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone
    ) {
      alert("All fields are required!");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg("");
      const res = await adminAPI.updateStaff(selectedStaff.id, formData);
      setStaff(staff.map((s) => (s.id === selectedStaff.id ? res.staff : s)));
      setShowEditModal(false);
      setSelectedStaff(null);
      setFormData({ name: "", email: "", password: "", phone: "" });
    } catch (e) {
      const msg = e?.response?.data?.error || "Failed to update staff";
      setErrorMsg(msg);
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Staff
  const handleDeleteStaff = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one staff member to delete!");
      return;
    }
    try {
      await adminAPI.deleteStaff(selectedIds);
      setStaff(staff.filter((s) => !selectedIds.includes(s.id)));
    } catch (e) {
      const msg = e?.response?.data?.error || "Failed to delete staff";
      alert(msg);
    }
    setSelectedIds([]);
    setSelectAll(false);
    setShowDeleteModal(false);
  };

  const openAddModal = () => {
    setFormData({ name: "", email: "", password: "", phone: "" });
    setShowAddModal(true);
  };

  const openEditModal = (staffMember) => {
    setSelectedStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      password: staffMember.password,
      phone: staffMember.phone,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one staff member to delete!");
      return;
    }
    setShowDeleteModal(true);
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
      setSelectAll(false);
    } else {
      setSelectedIds(staff.map((s) => s.id));
      setSelectAll(true);
    }
  };

  // Get selected staff names for display in delete modal
  const getSelectedStaffNames = () => {
    return staff.filter((s) => selectedIds.includes(s.id)).map((s) => s.name);
  };

  return (
    <AdminLayout activeMenuItem="staff">
      <div className="staff-header">
        <h1 className="page-header">Staff Management</h1>
        <div className="staff-actions">
          <button className="btn btn-primary" onClick={openAddModal}>
            ➕ Add Staff
          </button>
          <button
            className="btn btn-secondary"
            onClick={openDeleteModal}
            disabled={selectedIds.length === 0}
          >
            🗑️ Delete Selected ({selectedIds.length})
          </button>
        </div>
      </div>

      <div className="staff-table-container">
        <table className="staff-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Staff Name</th>
              <th>Email ID</th>
              <th>Password</th>
              <th>Phone No</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((staffMember) => (
              <tr key={staffMember.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(staffMember.id)}
                    onChange={() => handleCheckboxChange(staffMember.id)}
                  />
                </td>
                <td>{staffMember.name}</td>
                <td>{staffMember.email}</td>
                <td>{staffMember.password ? "••••••" : "—"}</td>
                <td>{staffMember.phone}</td>
                {/* Actions column removed */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Staff</h2>
            <form>
              <div className="form-group">
                <label>Staff Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter staff name"
                />
              </div>
              <div className="form-group">
                <label>Email ID</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter email address"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter password"
                />
              </div>
              <div className="form-group">
                <label>Phone No</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddStaff}
                >
                  Add Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Staff</h2>
            <form>
              <div className="form-group">
                <label>Staff Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter staff name"
                />
              </div>
              <div className="form-group">
                <label>Email ID</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter email address"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter password"
                />
              </div>
              <div className="form-group">
                <label>Phone No</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleEditStaff}
                >
                  Update Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Staff Modal */}
      {showDeleteModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="modal-content modal-delete"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Delete Staff</h2>
            <p>
              Are you sure you want to delete {selectedIds.length} staff
              member(s)?
            </p>
            <div className="selected-staff-list">
              <strong>Selected Staff:</strong>
              <ul>
                {getSelectedStaffNames().map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            </div>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteStaff}
              >
                Delete {selectedIds.length} Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminStaff;
