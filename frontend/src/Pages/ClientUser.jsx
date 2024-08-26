import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../Components/Sidebar/Sidebar';
import Pagination from '../Components/Pagination/Pagination';
import axiosWrapper from '../../src/utils/AxiosWrapper'; // Import the axiosWrapper function
import { useNavigate } from 'react-router-dom';

function ClientUser() {
    const [clientUsers, setClientUsers] = useState([]);
    const [clients, setClients] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({
        field: "created_at",
        order: "asc",
    });

    const navigate = useNavigate(); // Use navigate for redirecting if needed

    // State for new client user form
    const [newClientUser, setNewClientUser] = useState({
        client_user_id: null,
        client_id: '',
        user_id: '',
    });

    const [errors, setErrors] = useState({});
    const [deletingClientUserId, setDeletingClientUserId] = useState(null); // Track the ID of the client user to be deleted

    // State for editing client user
    const [editingClientUser, setEditingClientUser] = useState(null);

    const startIndex = (page - 1) * pageSize + 1;
    const endIndex = Math.min(page * pageSize, totalItems);

    const handleSortChange = (field) => {
        setSortBy((prevSort) => ({
            field,
            order:
                prevSort.field === field && prevSort.order === "asc" ? "desc" : "asc",
        }));
    };

    const fetchClientUsers = async () => {
        const queryString = `?page=${page}&limit=${pageSize}&sortBy=${sortBy.field}&order=${sortBy.order}&search=${search}`;
        try {
            setLoading(true);
            const response = await axiosWrapper(`/clientUser/paginateClientUsers${queryString}`, {}, navigate);

            // Extract clientUsers array from the response and set it in state
            const { clientUsers, totalPages, currentPage, totalItems } = response.data;

            setClientUsers(clientUsers); // Now you're correctly setting the clientUsers
            console.log("Client Users", clientUsers); // Check the console to ensure data is populated

            // Set other pagination-related state
            setTotalPages(totalPages || 0);
            setCurrentPage(currentPage || 1);
            setTotalItems(totalItems || 0);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error('Error fetching client users');
        }
    };

    const fetchClients = async () => {
        try {
            const data = await axiosWrapper('/client/getClients', {}, navigate);

            setClients(data.data || []); // Fallback to an empty array if no data is returned
        } catch (error) {
            toast.error('Error fetching clients');
            setClients([]); // Ensure clients is set to an empty array on error
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await axiosWrapper('/users/getUsers', {}, navigate);
            setUsers(data.data || []); // Fallback to an empty array if no data is returned
        } catch (error) {
            toast.error('Error fetching users');
            setUsers([]); // Ensure users is set to an empty array on error
        }
    };

    useEffect(() => {
        fetchClientUsers();
        fetchClients();
        fetchUsers();
    }, [page, pageSize, search, sortBy]);

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
        setNewClientUser((prevClientUser) => ({ ...prevClientUser, [name]: value }));
    };

    const handleAddClientUser = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors on new submission

        const { ...clientUserData } = newClientUser; // Exclude 'status' from the data sent to backend

        try {
            await axiosWrapper('/clientUser/addClientUser', { data: clientUserData }, navigate);
            toast.success('Client user added successfully');
            resetForm();
            fetchClientUsers();
            closeModal();
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
                toast.error(error.response.data.message || 'An error occurred');
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    };

    const handleEditClientUser = (clientUser) => {
        setEditingClientUser(clientUser);
        setNewClientUser({
            client_user_id: clientUser.client_user_id,
            client_id: clientUser.client_id,
            user_id: clientUser.user_id,
        });
    };

    const handleUpdateClientUser = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors on new submission

        try {
            await axiosWrapper('/clientUser/updateClientUser', { data: newClientUser }, navigate);
            toast.success('Client user updated successfully');
            resetForm();
            fetchClientUsers();
            closeModal(); // Close the modal after successful update
        } catch (error) {
            if (error.message && error.message.errors) {
                setErrors(error.message.errors);
                toast.error(error.message.message || 'An error occurred');
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    };

    const handleDeleteClientUser = async () => {
        try {
            await axiosWrapper('/clientUser/deleteClientUser', { data: { client_user_id: deletingClientUserId } }, navigate);
            toast.success('Client user deleted successfully');
            fetchClientUsers();
            closeDeleteModal(); // Close the delete modal after successful deletion
        } catch (error) {
            toast.error('An error occurred while deleting the client user');
        }
    };

    const resetForm = () => {
        setEditingClientUser(null);
        setNewClientUser({
            client_user_id: null,
            client_id: '',
            user_id: '',
        });
        setErrors({});
    };

    // Function to close the modal
    const closeModal = () => {
        const modalElement = document.getElementById('addClientUserModal');
        const modal = window.bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
    };

    const closeDeleteModal = () => {
        const modalElement = document.getElementById('deleteUserModal');
        const modal = window.bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
    };

    return (
        <div>
            <Sidebar />
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
            <div className="main main-app p-3 p-lg-4">
                <div className="d-md-flex align-items-center justify-content-between mb-3">
                    <div>
                        <ol className="breadcrumb fs-sm mb-1">
                            <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Client Users</li>
                        </ol>
                        <h4 className="main-title mb-0">Client Users</h4>
                    </div>
                    <div className="mt-3 mt-md-0">
                        <button type="button" className="btn btn-primary d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#addClientUserModal" onClick={resetForm}>
                            <i className="ri-add-line fs-18 lh-1"></i>Add New Client User
                        </button>
                    </div>
                </div>
                <div className="row g-3">
                    <div className="col-xl-12">
                        <div className="card card-one">
                            <div className="card-body pb-3">
                                <div className="d-flex align-items-center mb-2">
                                    <div className="form-search me-auto border py-0 shadow-none w-25">
                                        <input type="text" className="form-control" placeholder="Search" value={search} onChange={handleSearchChange} />
                                        <i className="ri-search-line"></i>
                                    </div>
                                    <span className="me-2">Show</span>
                                    <select className="form-select me-2 w-10" value={pageSize} onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}>
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
                                                <th className="w-24" onClick={() => handleSortChange("client_id")}>Client Name
                                                    {sortBy.field === "client_id" && (
                                                        <span style={{ display: "inline-flex" }}>
                                                            {sortBy.order === "asc" ? (
                                                                <i className="ri-arrow-up-fill"></i>
                                                            ) : (
                                                                <i className="ri-arrow-down-fill"></i>
                                                            )}
                                                        </span>
                                                    )}
                                                </th>
                                                <th>User Name</th>
                                                <th className="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(clientUsers) && clientUsers.length > 0 ? clientUsers.map((clientUser, index) => (
                                                <tr key={clientUser.client_user_id}>
                                                    <td className="text-center">{startIndex + index}</td> {/* Serial number */}
                                                    {/* Accessing nested client and user data directly */}
                                                    <td>{clientUser.client?.client_name || 'No Client Name'}</td>
                                                    <td>{clientUser.user?.name || 'No User Name'}</td>
                                                    <td className="text-center">
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            <a href="#" className="text-success me-2" onClick={() => handleEditClientUser(clientUser)} data-bs-toggle="modal" data-bs-target="#addClientUserModal">
                                                                <i className="ri-pencil-line fs-18 lh-1"></i>
                                                            </a>
                                                            <a href="#" className="text-danger" data-bs-toggle="modal" data-bs-target="#deleteUserModal" onClick={() => setDeletingClientUserId(clientUser.client_user_id)}>
                                                                <i className="ri-delete-bin-line fs-18 lh-1"></i>
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center">No client users found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="card-footer p-2">
                                <div className="d-flex justify-content-between align-items-center px-2">
                                    <span>Showing {startIndex} to {endIndex} of {totalItems} client users</span>
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
            <div className="modal fade" id="addClientUserModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title" id="exampleModalLabel">{editingClientUser ? "Edit Client User" : "Add New Client User"}</h5>
                            <button type="button" className="btn-close modal_close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={editingClientUser ? handleUpdateClientUser : handleAddClientUser}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Client <span className="text-danger">*</span></label>
                                        <select className={`form-control ${errors.client_id ? "is-invalid" : ""}`} name="client_id" value={newClientUser.client_id} onChange={handleInputChange}>
                                            <option value="">Select Client</option>
                                            {clients?.length > 0 ? clients.map(client => (
                                                <option key={client.client_id} value={client.client_id}>{client.client_name}</option>
                                            )) : (
                                                <option disabled>Loading clients...</option>
                                            )}
                                        </select>
                                        {errors.client_id && <div className="invalid-feedback">{errors.client_id}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">User <span className="text-danger">*</span></label>
                                        <select className={`form-control ${errors.user_id ? "is-invalid" : ""}`} name="user_id" value={newClientUser.user_id} onChange={handleInputChange}>
                                            <option value="">Select User</option>
                                            {users?.length > 0 ? users.map(user => (
                                                <option key={user.user_id} value={user.user_id}>{user.name}</option>
                                            )) : (
                                                <option disabled>Loading users...</option>
                                            )}
                                        </select>
                                        {errors.user_id && <div className="invalid-feedback">{errors.user_id}</div>}
                                    </div>
                                </div>
                                <div className="modal-footer d-block border-top-0">
                                    <div className="d-flex gap-2 mb-1 mt-2">
                                        <button type="button" className="btn btn-white flex-fill" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" className="btn btn-primary flex-fill">{editingClientUser ? "Update" : "Save"}</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* DELETE MODAL */}
            <div className="modal fade" id="deleteUserModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header bg-danger text-white">
                            <h5 className="modal-title" id="exampleModalLabel">Delete Client User</h5>
                            <button type="button" className="btn-close modal_close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-center">
                            <div className="mb-1 text-danger ti--3"><i className="ri-delete-bin-line fs-40 lh-1"></i></div>
                            <h5 className="fw-semibold text-dark mb-1">Delete Client User</h5>
                            <p className="fs-md text-secondary">Are you sure you want to delete this client user?</p>
                        </div>
                        <div className="modal-footer d-block border-top-0 pt-0">
                            <div className="d-flex gap-2 mb-4">
                                <button type="button" className="btn btn-white flex-fill" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-danger flex-fill" onClick={handleDeleteClientUser}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ClientUser;
