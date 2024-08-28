import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../Components/Sidebar/Sidebar";
import Pagination from "../Components/Pagination/Pagination";
import axiosWrapper from "../../src/utils/AxiosWrapper"; // Import the axiosWrapper function
import { useNavigate } from "react-router-dom";

function User() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]); // State to store the roles
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState({
    field: "created_at",
    order: "asc",
  });

  const navigate = useNavigate(); // Use navigate for redirecting if needed

  // State for new user form
  const [newUser, setNewUser] = useState({
    user_id: null,
    name: "",
    email: "",
    username: "",
    password: "",
    mobile_no: "",
    role_id: "",
    address: "",
  });

  // State for form errors
  const [errors, setErrors] = useState({});

  // State for editing user
  const [editingUser, setEditingUser] = useState(null);

  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalItems);

  useEffect(() => {
    fetchUsers();
    fetchRoles(); // Fetch roles when the component mounts
  }, [page, pageSize, search, sortBy]);

  const handleSortChange = (field) => {
    setSortBy((prevSort) => ({
      field,
      order:
        prevSort.field === field && prevSort.order === "asc" ? "desc" : "asc",
    }));
  };

  const fetchUsers = async () => {
    const queryString = `?page=${page}&limit=${pageSize}&sortBy=${sortBy.field}&order=${sortBy.order}&search=${search}`;
    try {
      setLoading(true);
      const data = await axiosWrapper(
        `/users/paginateUsers${queryString}`,
        {},
        navigate
      );
      console.log("API Response:", data.data.data);

      setUsers(data.data.data);
      setTotalPages(data.data.totalPages || 0);
      setCurrentPage(data.data.currentPage || 1);
      setTotalItems(data.data.totalItems || 0);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching user data:", error);
      toast.error("Error fetching user data");
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await axiosWrapper(`/roles/getRoles`, {}, navigate);
      console.log("roles data", data);
      setRoles(data.data); // Store roles in the state
    } catch (error) {
      console.error("Error fetching roles data:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset errors on new submission

    try {
      await axiosWrapper("/users/addUser", { data: newUser }, navigate).then(
        (respo) => {
          console.log(respo);
        }
      );
      toast.success("User added successfully");
      resetForm();
      fetchUsers();
      closeModal();
    } catch (error) {
      console.error("Error adding user:", error);
      if (error.message && error.message.errors) {
        setErrors(error.message.errors);
        toast.error(error.message.message || "An error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleEditUser = (user) => {
    setErrors({}); // Reset errors on new submission

    setEditingUser(user);
    setNewUser({
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      username: user.username,
      password: "",
      mobile_no: user.mobile_no,
      role_id: user.role_id,
      address: user.address,
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset errors on new submission

    try {
      await axiosWrapper("/users/updateUser", { data: newUser }, navigate);
      toast.success("User updated successfully");
      resetForm();
      fetchUsers();
      closeModal(); // Close the modal after successful update
    } catch (error) {
      console.error("Error updating user:", error);
      if (error.message && error.message.errors) {
        setErrors(error.message.errors);
        toast.error(error.message.message || "An error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const updatedStatus = !user.status;
      await axiosWrapper(
        "/users/deleteUser",
        { data: { user_id: user.user_id, status: updatedStatus } },
        navigate
      );
      toast.success(
        `User ${updatedStatus ? "restored" : "deleted"} successfully`
      );
      fetchUsers();
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error("An error occurred while updating the user status");
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    setNewUser({
      user_id: null,
      name: "",
      email: "",
      username: "",
      password: "",
      mobile_no: "",
      role_id: "",
      address: "",
    });
    setErrors({});
  };

  // Function to close the modal
  const closeModal = () => {
    setErrors({}); // Reset errors on new submission

    const modalElement = document.getElementById("addUserModal");
    const modal = window.bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  };

  return (
    <>
      <Sidebar />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="main main-app p-3 p-lg-4">
        <div className="d-md-flex align-items-center justify-content-between mb-3">
          <div>
            <ol className="breadcrumb fs-sm mb-1">
              <li className="breadcrumb-item">
                <a href="#">Dashboard</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Users
              </li>
            </ol>
            <h4 className="main-title mb-0">All Users</h4>
          </div>
          <div className="mt-3 mt-md-0">
            <button
              type="button"
              className="btn btn-primary d-flex align-items-center gap-2"
              data-bs-toggle="modal"
              data-bs-target="#addUserModal"
              onClick={resetForm}
            >
              <i className="ri-add-line fs-18 lh-1"></i>Add New User
            </button>
          </div>
        </div>
        <div className="row g-3">
          <div className="col-xl-12">
            <div className="card card-one">
              <div className="card-body pb-3">
                <div className="d-flex align-items-center mb-2">
                  <div className="form-search me-auto border py-0 shadow-none w-25">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      value={search}
                      onChange={handleSearchChange}
                    />
                    <i className="ri-search-line"></i>
                  </div>
                  <span className="me-2">Show</span>
                  <select
                    className="form-select me-2 w-10"
                    value={pageSize}
                    onChange={(e) =>
                      handlePageSizeChange(parseInt(e.target.value))
                    }
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                  </select>
                </div>
                <div className="table-responsive">
                  <table className="table table-bordered text-nowrap">
                    <thead className="bg-light">
                      <tr>
                        <th className="text-center">#ID</th>
                        <th
                          className="w-24"
                          onClick={() => handleSortChange("name")}
                        >
                          {" "}
                          Name
                          {sortBy.field === "name" && (
                            <span style={{ display: "inline-flex" }}>
                              {sortBy.order === "asc" ? (
                                <i className="ri-arrow-up-fill"></i>
                              ) : (
                                <i className="ri-arrow-down-fill"></i>
                              )}
                            </span>
                          )}
                        </th>
                        <th
                          className="w-24"
                          onClick={() => handleSortChange("mobile_no")}
                        >
                          {" "}
                          Mobile No.
                          {sortBy.field === "mobile_no" && (
                            <span style={{ display: "inline-flex" }}>
                              {sortBy.order === "asc" ? (
                                <i className="ri-arrow-up-fill"></i>
                              ) : (
                                <i className="ri-arrow-down-fill"></i>
                              )}
                            </span>
                          )}
                        </th>
                        <th
                          className="w-24"
                          onClick={() => handleSortChange("email")}
                        >
                          {" "}
                          Email
                          {sortBy.field === "email" && (
                            <span style={{ display: "inline-flex" }}>
                              {sortBy.order === "asc" ? (
                                <i className="ri-arrow-up-fill"></i>
                              ) : (
                                <i className="ri-arrow-down-fill"></i>
                              )}
                            </span>
                          )}
                        </th>
                        <th
                          className="w-24"
                          onClick={() => handleSortChange("status")}
                        >
                          {" "}
                          Status
                          {sortBy.field === "status" && (
                            <span style={{ display: "inline-flex" }}>
                              {sortBy.order === "asc" ? (
                                <i className="ri-arrow-up-fill"></i>
                              ) : (
                                <i className="ri-arrow-down-fill"></i>
                              )}
                            </span>
                          )}
                        </th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(users) && users.length > 0 ? (
                        users.map((user, index) => (
                          <tr
                            key={user.id}
                            style={{ opacity: user.status ? 1 : 0.5 }}
                          >
                            <td className="text-center">
                              {startIndex + index}
                            </td>{" "}
                            {/* Serial number */}
                            <td>{user.name}</td>
                            <td>{user.mobile_no}</td>
                            <td>{user.email}</td>
                            <td>{user.status ? "Active" : "Inactive"}</td>
                            <td className="text-center">
                              <div className="d-flex align-items-center justify-content-center">
                                {user.status && (
                                  <a
                                    href=""
                                    className="text-success me-2"
                                    onClick={() => handleEditUser(user)}
                                    data-bs-toggle="modal"
                                    data-bs-target="#addUserModal"
                                  >
                                    <i className="ri-pencil-line fs-18 lh-1"></i>
                                  </a>
                                )}
                                <div className="form-check form-switch me-2">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id={`flexSwitchCheckChecked-${user.id}`}
                                    checked={user.status}
                                    onChange={() => handleToggleStatus(user)}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer p-2">
                <div className="d-flex justify-content-between align-items-center px-2">
                  <span>
                    Showing {startIndex} to {endIndex} of {totalItems} users
                  </span>
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                    totalItems={totalItems}
                    startIndex={startIndex}
                    endIndex={endIndex}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADD/EDIT MODAL */}
      <div
        className="modal fade"
        id="addUserModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="exampleModalLabel">
                {editingUser ? "Edit User" : "Add New User"}
              </h5>
              <button
                type="button"
                className="btn-close modal_close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={editingUser ? handleUpdateUser : handleAddUser}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      name="name"
                      value={newUser.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      name="email"
                      value={newUser.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      Username <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.username ? "is-invalid" : ""
                      }`}
                      name="username"
                      value={newUser.username}
                      onChange={handleInputChange}
                      placeholder="Enter your username"
                    />
                    {errors.username && (
                      <div className="invalid-feedback">{errors.username}</div>
                    )}
                  </div>
                  {!editingUser && (
                    <div className="col-md-6">
                      <label className="form-label">
                        Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className={`form-control ${
                          errors.password ? "is-invalid" : ""
                        }`}
                        name="password"
                        value={newUser.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                      />
                      {errors.password && (
                        <div className="invalid-feedback">
                          {errors.password}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="col-md-6">
                    <label className="form-label">
                      Mobile No. <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.mobile_no ? "is-invalid" : ""
                      }`}
                      name="mobile_no"
                      value={newUser.mobile_no}
                      onChange={handleInputChange}
                      placeholder="Enter your mobile no."
                    />
                    {errors.mobile_no && (
                      <div className="invalid-feedback">{errors.mobile_no}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      Role <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-control ${
                        errors.role_id ? "is-invalid" : ""
                      }`}
                      name="role_id"
                      value={newUser.role_id}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a role</option>
                      {roles.map((role) => (
                        <option key={role.role_id} value={role.role_id}>
                          {role.role}
                        </option>
                      ))}
                    </select>
                    {errors.role_id && (
                      <div className="invalid-feedback">{errors.role_id}</div>
                    )}
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Address</label>
                    <textarea
                      rows="2"
                      className={`form-control ${
                        errors.address ? "is-invalid" : ""
                      }`}
                      name="address"
                      value={newUser.address}
                      onChange={handleInputChange}
                      placeholder="Enter your address"
                    ></textarea>
                    {errors.address && (
                      <div className="invalid-feedback">{errors.address}</div>
                    )}
                  </div>
                </div>
                <div className="modal-footer d-block border-top-0">
                  <div className="d-flex gap-2 mb-4">
                    <button
                      type="button"
                      className="btn btn-white flex-fill"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary flex-fill">
                      {editingUser ? "Update" : "Save"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default User;
