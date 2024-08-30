import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../Components/Sidebar/Sidebar';
import Pagination from '../Components/Pagination/Pagination';
import axiosWrapper from '../../src/utils/AxiosWrapper'; // Import the axiosWrapper function
import { useNavigate } from 'react-router-dom';
import { hasPermission } from "../Services/authUtils";


function DeviceUser() {
    const [deviceUsers, setDeviceUsers] = useState([]);
    const [clients, setClients] = useState([]);
    const [devices, setDevices] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({
        field: "created_at",
        order: "asc",
    });

    const navigate = useNavigate();

    // State for new device user form
    const [newDeviceUser, setNewDeviceUser] = useState({
        client_id: '',
        device_id: '',
        user_id: '',
        from_date_time: '',
        to_date_time: '',
        status: true,
    });

    const [errors, setErrors] = useState({});

    // State for editing device user
    const [editingDeviceUser, setEditingDeviceUser] = useState(null);

    const startIndex = (page - 1) * pageSize + 1;
    const endIndex = Math.min(page * pageSize, totalItems);

    const handleSortChange = (field) => {
        setSortBy((prevSort) => ({
            field,
            order:
                prevSort.field === field && prevSort.order === "asc" ? "desc" : "asc",
        }));
    };

    const fetchDeviceUsers = async () => {
        const queryString = `?page=${page}&limit=${pageSize}&sortBy=${sortBy.field}&order=${sortBy.order}&search=${search}`;
        try {
            setLoading(true);
            const data = await axiosWrapper(`/deviceUser/paginateDeviceUsers${queryString}`, {}, navigate);

            setDeviceUsers(data.data.data);
            setTotalPages(data.data.totalPages || 0);
            setCurrentPage(data.data.currentPage || 1);
            setTotalItems(data.data.totalItems || 0);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error('Error fetching device users');
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

    const fetchDevices = async () => {
        try {
            const data = await axiosWrapper('/device/getDevices', {}, navigate);
            setDevices(data.data || []); // Fallback to an empty array if no data is returned
        } catch (error) {
            toast.error('Error fetching devices');
            setDevices([]); // Ensure devices is set to an empty array on error
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
        fetchDeviceUsers();
        fetchClients();
        fetchDevices();
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
        setNewDeviceUser((prevDeviceUser) => ({ ...prevDeviceUser, [name]: value }));
    };

    const handleAddDeviceUser = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors on new submission

        try {
            await axiosWrapper('/deviceUser/addDeviceUser', { data: newDeviceUser }, navigate);
            toast.success('Device User added successfully');
            resetForm();
            fetchDeviceUsers();
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

    const handleEditDeviceUser = (deviceUser) => {
        setErrors({}); // Reset errors on new submission

        setEditingDeviceUser(deviceUser);

        setNewDeviceUser({
            device_user_id: deviceUser.device_user_id,
            client_id: deviceUser.client_id,
            device_id: deviceUser.device_id,
            user_id: deviceUser.user_id,
            from_date_time: deviceUser.from_date_time,
            to_date_time: deviceUser.to_date_time,
            status: deviceUser.status,
        });
    };

    const handleUpdateDeviceUser = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors on new submission

        try {
            await axiosWrapper('/deviceUser/updateDeviceUser', { data: newDeviceUser }, navigate);
            toast.success('Device User updated successfully');
            resetForm();
            fetchDeviceUsers();
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

    const handleToggleStatus = async (deviceUser) => {
        try {
            const updatedStatus = !deviceUser.status;
            await axiosWrapper('/deviceUser/deleteDeviceUser', { data: { device_user_id: deviceUser.device_user_id, status: updatedStatus } }, navigate);
            toast.success(`Device User ${updatedStatus ? 'restored' : 'deleted'} successfully`);
            fetchDeviceUsers();
        } catch (error) {
            toast.error('An error occurred while updating the device user status');
        }
    };

    const resetForm = () => {
        setEditingDeviceUser(null);
        setNewDeviceUser({
            client_id: '',
            device_id: '',
            user_id: '',
            from_date_time: '',
            to_date_time: '',
            status: true,
        });
        setErrors({});
    };

    // Function to close the modal
    const closeModal = () => {
        setErrors({}); // Reset errors on new submission

        const modalElement = document.getElementById('addDeviceUserModal');
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
                            <li className="breadcrumb-item active" aria-current="page">Device Users</li>
                        </ol>
                        <h4 className="main-title mb-0">Device Users</h4>
                    </div>
                    {hasPermission(["device_users.create"]) && (
                        <div className="mt-3 mt-md-0">
                            <button type="button" className="btn btn-primary d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#addDeviceUserModal" onClick={resetForm}>
                                <i className="ri-add-line fs-18 lh-1"></i>Add New Device User
                            </button>
                        </div>
                    )}
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
                                                <th className="w-24" onClick={() => handleSortChange("client")}> Client
                                                    {sortBy.field === "client" && (
                                                        <span style={{ display: "inline-flex" }}>
                                                            {sortBy.order === "asc" ? (
                                                                <i className="ri-arrow-up-fill"></i>
                                                            ) : (
                                                                <i className="ri-arrow-down-fill"></i>
                                                            )}
                                                        </span>
                                                    )}
                                                </th>
                                                <th className="w-24" onClick={() => handleSortChange("device")}> Device
                                                    {sortBy.field === "device" && (
                                                        <span style={{ display: "inline-flex" }}>
                                                            {sortBy.order === "asc" ? (
                                                                <i className="ri-arrow-up-fill"></i>
                                                            ) : (
                                                                <i className="ri-arrow-down-fill"></i>
                                                            )}
                                                        </span>
                                                    )}
                                                </th>
                                                <th className="w-24" onClick={() => handleSortChange("user")}> User
                                                    {sortBy.field === "user" && (
                                                        <span style={{ display: "inline-flex" }}>
                                                            {sortBy.order === "asc" ? (
                                                                <i className="ri-arrow-up-fill"></i>
                                                            ) : (
                                                                <i className="ri-arrow-down-fill"></i>
                                                            )}
                                                        </span>
                                                    )}
                                                </th>
                                                <th className="w-24" onClick={() => handleSortChange("from_date_time")}> From Date
                                                    {sortBy.field === "from_date_time" && (
                                                        <span style={{ display: "inline-flex" }}>
                                                            {sortBy.order === "asc" ? (
                                                                <i className="ri-arrow-up-fill"></i>
                                                            ) : (
                                                                <i className="ri-arrow-down-fill"></i>
                                                            )}
                                                        </span>
                                                    )}
                                                </th>
                                                <th className="w-24" onClick={() => handleSortChange("to_date_time")}> To Date
                                                    {sortBy.field === "to_date_time" && (
                                                        <span style={{ display: "inline-flex" }}>
                                                            {sortBy.order === "asc" ? (
                                                                <i className="ri-arrow-up-fill"></i>
                                                            ) : (
                                                                <i className="ri-arrow-down-fill"></i>
                                                            )}
                                                        </span>
                                                    )}
                                                </th>
                                                <th className="w-24" onClick={() => handleSortChange("status")}> Status
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
                                                {(hasPermission(["device_users.update"]) || hasPermission(["device_users.delete"])) && (
                                                    <th className="text-center">Action</th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(deviceUsers) && deviceUsers.length > 0 ? deviceUsers.map((deviceUser, index) => (
                                                <tr key={deviceUser.device_user_id} style={{ opacity: deviceUser.status ? 1 : 0.5 }}>
                                                    <td className="text-center">{startIndex + index}</td>
                                                    <td>{clients.find(client => client.client_id === deviceUser.client_id)?.client_name || ''}</td>
                                                    <td>{devices.find(device => device.device_id === deviceUser.device_id)?.serial_no || ''}</td>
                                                    <td>{users.find(user => user.user_id === deviceUser.user_id)?.name || ''}</td>
                                                    <td>{new Date(deviceUser.from_date_time).toLocaleString()}</td>
                                                    <td>{new Date(deviceUser.to_date_time).toLocaleString()}</td>
                                                    <td>{deviceUser.status ? 'Active' : 'Inactive'}</td>
                                                    <td className="text-center">
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            {/* Permission check for 'device_users.update' before showing edit option */}
                                                            {deviceUser.status && hasPermission(["device_users.update"]) && (
                                                                <a href="#" className="text-success me-2" onClick={() => handleEditDeviceUser(deviceUser)} data-bs-toggle="modal" data-bs-target="#addDeviceUserModal">
                                                                    <i className="ri-pencil-line fs-18 lh-1"></i>
                                                                </a>
                                                            )}
                                                            {/* Permission check for 'device_users.delete' before showing toggle switch */}
                                                            {hasPermission(["device_users.delete"]) && (
                                                                <div className="form-check form-switch me-2">
                                                                    <input className="form-check-input" type="checkbox" role="switch" id={`flexSwitchCheckChecked-${deviceUser.device_user_id}`} checked={deviceUser.status} onChange={() => handleToggleStatus(deviceUser)} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="8" className="text-center">No device users found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="card-footer p-2">
                                <div className="d-flex justify-content-between align-items-center px-2">
                                    <span>Showing {startIndex} to {endIndex} of {totalItems} device users</span>
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
            <div className="modal fade" id="addDeviceUserModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title" id="exampleModalLabel">{editingDeviceUser ? "Edit Device User" : "Add New Device User"}</h5>
                            <button type="button" className="btn-close modal_close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={editingDeviceUser ? handleUpdateDeviceUser : handleAddDeviceUser}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Client <span className="text-danger">*</span></label>
                                        <select className={`form-control ${errors.client_id ? "is-invalid" : ""}`} name="client_id" value={newDeviceUser.client_id} onChange={handleInputChange}>
                                            <option value="">Select Client</option>
                                            {clients.map(client => (
                                                <option key={client.client_id} value={client.client_id}>{client.client_name}</option>
                                            ))}
                                        </select>
                                        {errors.client_id && <div className="invalid-feedback">{errors.client_id}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Device <span className="text-danger">*</span></label>
                                        <select className={`form-control ${errors.device_id ? "is-invalid" : ""}`} name="device_id" value={newDeviceUser.device_id} onChange={handleInputChange}>
                                            <option value="">Select Device</option>
                                            {devices.map(device => (
                                                <option key={device.device_id} value={device.device_id}>{device.serial_no}</option>
                                            ))}
                                        </select>
                                        {errors.device_id && <div className="invalid-feedback">{errors.device_id}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">User <span className="text-danger">*</span></label>
                                        <select className={`form-control ${errors.user_id ? "is-invalid" : ""}`} name="user_id" value={newDeviceUser.user_id} onChange={handleInputChange}>
                                            <option value="">Select User</option>
                                            {users.map(user => (
                                                <option key={user.user_id} value={user.user_id}>{user.name}</option>
                                            ))}
                                        </select>
                                        {errors.user_id && <div className="invalid-feedback">{errors.user_id}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">From Date Time <span className="text-danger">*</span></label>
                                        <input type="datetime-local" className={`form-control ${errors.from_date_time ? "is-invalid" : ""}`} name="from_date_time" value={newDeviceUser.from_date_time} onChange={handleInputChange} />
                                        {errors.from_date_time && <div className="invalid-feedback">{errors.from_date_time}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">To Date Time <span className="text-danger">*</span></label>
                                        <input type="datetime-local" className={`form-control ${errors.to_date_time ? "is-invalid" : ""}`} name="to_date_time" value={newDeviceUser.to_date_time} onChange={handleInputChange} />
                                        {errors.to_date_time && <div className="invalid-feedback">{errors.to_date_time}</div>}
                                    </div>
                                </div>
                                <div className="modal-footer d-block border-top-0">
                                    <div className="d-flex gap-2 mb-1 mt-2">
                                        <button type="button" className="btn btn-white flex-fill" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" className="btn btn-primary flex-fill">{editingDeviceUser ? "Update" : "Save"}</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeviceUser;
