import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../Components/Sidebar/Sidebar';
import Pagination from '../Components/Pagination/Pagination';
import axiosWrapper from '../../src/utils/AxiosWrapper'; // Import the axiosWrapper function
import { useNavigate, useParams } from 'react-router-dom';

function CombinedDeviceClientUser() {


    const [pageDevices, setPageDevices] = useState(1);
    const [pageSizeDevices, setPageSizeDevices] = useState(5);
    const [searchDevices, setSearchDevices] = useState('');

    // Client user table states
    const [pageClientUsers, setPageClientUsers] = useState(1);
    const [pageSizeClientUsers, setPageSizeClientUsers] = useState(10);
    const [searchClientUsers, setSearchClientUsers] = useState('');




    const { client_id } = useParams();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [roles, setRoles] = useState([]);
    const [deletingClientUserId, setDeletingClientUserId] = useState(null);
    // Common pagination states
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [newUser, setNewUser] = useState({
        client_id: client_id,
        user_id: null,
        name: '',
        email: '',
        username: '',
        password: '',
        mobile_no: '',
        role_id: '',
        address: '',
    });
    const resetForm = () => {
        setEditingUser(null);
        setNewUser({
            client_id: client_id,
            user_id: null,
            name: '',
            email: '',
            username: '',
            password: '',
            mobile_no: '',
            role_id: '',
            address: '',
        });
        setErrors({});
    };
    const closeModal = () => {
        setErrors({}); // Reset errors on new submission

        const modalElement = document.getElementById('addUserModal');
        const modal = window.bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
    };
    const fetchRoles = async () => {
        try {
            const data = await axiosWrapper(`/roles/getRoles`, {}, navigate);
            console.log("roles data", data);
            setRoles(data.data); // Store roles in the state
        } catch (error) {
            console.error('Error fetching roles data:', error);
        }
    };
    /** -------------- Device Component Logic ---------------- **/
    const [devices, setDevices] = useState([]);
    const [clients, setClients] = useState([]);
    const [deviceTypes, setDeviceTypes] = useState([]);
    const [loadingDevices, setLoadingDevices] = useState(false);
    const [totalPagesDevices, setTotalPagesDevices] = useState(0);
    const [totalItemsDevices, setTotalItemsDevices] = useState(0);
    const [sortByDevice, setSortByDevice] = useState({
        field: "created_at",
        order: "asc",
    });

    const [editingUser, setEditingUser] = useState(null);

    const [errorsDevice, setErrorsDevice] = useState({});
    const [editingDevice, setEditingDevice] = useState(null);


    const [newDevice, setNewDevice] = useState({
        client_id: client_id,
        device_type_id: '',
        serial_no: '',
        mobile_no: '',
        port_no: '',
        status: true,
    });
    const [loading, setLoading] = useState(false);
    const [client, setClient] = useState(null);

    const handleSortChangeDevice = (field) => {
        setSortByDevice((prevSort) => ({
            field,
            order: prevSort.field === field && prevSort.order === "asc" ? "desc" : "asc",
        }));
    };

    const fetchDevices = async () => {
        const queryString = `?page=${pageDevices}&limit=${pageSizeDevices}&sortBy=${sortByDevice.field}&order=${sortByDevice.order}&search=${searchDevices}&client_id=${client_id}`;
        try {
            setLoadingDevices(true);
            const data = await axiosWrapper(`/device/paginateDevices${queryString}`, {}, navigate);

            setDevices(data.data.data);
            setTotalPagesDevices(data.data.totalPages || 0);
            setTotalItemsDevices(data.data.totalItems || 0);
            setLoadingDevices(false);
        } catch (error) {
            setLoadingDevices(false);
            toast.error('Error fetching devices');
        }
    };

    const fetchClients = async () => {
        try {
            const data = await axiosWrapper('/client/getClients', {}, navigate);
            setClients(data.data || []);
        } catch (error) {
            toast.error('Error fetching clients');
            setClients([]);
        }
    };

    const fetchDeviceTypes = async () => {
        try {
            const data = await axiosWrapper('/deviceType/getDeviceTypes', {}, navigate);
            setDeviceTypes(data.data || []);
        } catch (error) {
            toast.error('Error fetching device types');
            setDeviceTypes([]);
        }
    };

    useEffect(() => {
        fetchDevices();
        fetchClients();
        fetchRoles();
        fetchDeviceTypes();
    }, [pageDevices, pageSizeDevices, searchDevices, sortByDevice]);

    const handleAddDevice = async (e) => {
        e.preventDefault();
        setErrorsDevice({});
        try {
            await axiosWrapper('/device/addDevice', { data: newDevice }, navigate);
            toast.success('Device added successfully');
            resetDeviceForm();
            fetchDevices();
            closeDeviceModal();
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrorsDevice(error.response.data.errors);
                toast.error(error.response.data.message || 'An error occurred');
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

    const closeDeleteModal = () => {


        const modalElement = document.getElementById('deleteUserModal');
        const modal = window.bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
    };

    const handleEditDevice = (device) => {
        setErrorsDevice({});
        setEditingDevice(device);
        setNewDevice({
            device_id: device.device_id,
            client_id: device.client_id,
            device_type_id: device.device_type_id,
            serial_no: device.serial_no,
            mobile_no: device.mobile_no,
            port_no: device.port_no,
            status: device.status,
        });
    };

    const handleUpdateDevice = async (e) => {
        e.preventDefault();
        setErrorsDevice({});
        try {
            await axiosWrapper('/device/updateDevice', { data: newDevice }, navigate);
            toast.success('Device updated successfully');
            resetDeviceForm();
            fetchDevices();
            closeDeviceModal();
        } catch (error) {
            if (error.message && error.message.errors) {
                setErrorsDevice(error.message.errors);
                toast.error(error.message.message || 'An error occurred');
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    };

    const handleToggleStatusDevice = async (device) => {
        try {
            const updatedStatus = !device.status;
            await axiosWrapper('/device/deleteDevice', { data: { device_id: device.device_id, status: updatedStatus } }, navigate);
            toast.success(`Device ${updatedStatus ? 'restored' : 'deleted'} successfully`);
            fetchDevices();
        } catch (error) {
            toast.error('An error occurred while updating the device status');
        }
    };

    const resetDeviceForm = () => {
        setEditingDevice(null);
        setNewDevice({
            client_id: client_id,
            device_type_id: '',
            serial_no: '',
            mobile_no: '',
            port_no: '',
            status: true,
        });
        setErrorsDevice({});
    };

    const closeDeviceModal = () => {
        const modalElement = document.getElementById('addDeviceModal');
        const modal = window.bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
    };

    /** -------------- Client User Component Logic ---------------- **/
    const [clientUsers, setClientUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [loadingClientUsers, setLoadingClientUsers] = useState(false);
    const [totalPagesClientUsers, setTotalPagesClientUsers] = useState(0);
    const [totalItemsClientUsers, setTotalItemsClientUsers] = useState(0);
    const [sortByClientUser, setSortByClientUser] = useState({
        field: "created_at",
        order: "asc",
    });

    const [newClientUser, setNewClientUser] = useState({
        client_user_id: null,
        client_id: client_id,
        user_id: '',
    });

    const [errorsClientUser, setErrorsClientUser] = useState({});
    const [editingClientUser, setEditingClientUser] = useState(null);

    const handleSortChangeClientUser = (field) => {
        setSortByClientUser((prevSort) => ({
            field,
            order: prevSort.field === field && prevSort.order === "asc" ? "desc" : "asc",
        }));
    };

    const fetchClientUsers = async () => {
        const queryString = `?page=${pageClientUsers}&limit=${pageSizeClientUsers}&sortBy=${sortByClientUser.field}&order=${sortByClientUser.order}&search=${searchClientUsers}&client_id=${client_id}`;
        try {
            setLoadingClientUsers(true);
            const response = await axiosWrapper(`/clientUser/paginateClientUsers${queryString}`, {}, navigate);

            const { clientUsers, totalPages, currentPage, totalItems } = response.data;

            setClientUsers(clientUsers);
            setTotalPagesClientUsers(totalPages || 0);
            setTotalItemsClientUsers(totalItems || 0);
            setLoadingClientUsers(false);
        } catch (error) {
            setLoadingClientUsers(false);
            toast.error('Error fetching client users');
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await axiosWrapper('/users/getUsers', {}, navigate);
            setUsers(data.data || []);
        } catch (error) {
            toast.error('Error fetching users');
            setUsers([]);
        }
    };

    useEffect(() => {
        fetchClientUsers();
        fetchClients();
        fetchUsers();
        fetchClientDetails();
    }, [pageClientUsers, pageSizeClientUsers, searchClientUsers, sortByClientUser]);

    const handleAddClientUser = async (e) => {
        e.preventDefault();
        setErrorsClientUser({});
        try {
            await axiosWrapper('/clientUser/addClientUser', { data: newClientUser }, navigate);
            toast.success('Client user added successfully');
            resetClientUserForm();
            fetchClientUsers();
            closeClientUserModal();
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrorsClientUser(error.response.data.errors);
                toast.error(error.response.data.message || 'An error occurred');
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    };

    const handleEditClientUser = (clientUser) => {
        setErrorsClientUser({});
        setEditingClientUser(clientUser);
        setNewClientUser({
            client_user_id: clientUser.client_user_id,
            client_id: clientUser.client_id,
            user_id: clientUser.user_id,
        });
    };

    const handleUpdateClientUser = async (e) => {
        e.preventDefault();
        setErrorsClientUser({});
        try {
            await axiosWrapper('/clientUser/updateClientUser', { data: newClientUser }, navigate);
            toast.success('Client user updated successfully');
            resetClientUserForm();
            fetchClientUsers();
            closeClientUserModal();
        } catch (error) {
            if (error.message && error.message.errors) {
                setErrorsClientUser(error.message.errors);
                toast.error(error.message.message || 'An error occurred');
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    };

    const resetClientUserForm = () => {
        setEditingClientUser(null);
        setNewClientUser({
            client_user_id: null,
            client_id: client_id,
            user_id: '',
        });
        setErrorsClientUser({});
    };

    const closeClientUserModal = () => {
        const modalElement = document.getElementById('addClientUserModal');
        const modal = window.bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
    };

    const fetchClientDetails = async () => {
        setLoading(true);
        try {
            const response = await axiosWrapper(
                `/client/viewClient`,
                { data: { client_id: client_id } },
                navigate
            );
            setClient(response.data);
            setLoading(false);
        } catch (error) {
            toast.error('Error fetching client details');
            setLoading(false);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors on new submission

        try {
            await axiosWrapper('/users/updateUser', { data: newUser }, navigate);
            toast.success('User updated successfully');
            resetForm();
            fetchUsers();
            closeModal1(); // Close the modal after successful update
        } catch (error) {
            console.error('Error updating user:', error);
            if (error.message && error.message.errors) {
                setErrors(error.message.errors);
                toast.error(error.message.message || 'An error occurred');
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors on new submission

        try {
            await axiosWrapper('/users/addUser', { data: newUser }, navigate).then((respo) => {
                console.log(respo);
            });
            toast.success('User added successfully');
            resetForm();
            fetchClientUsers();
            fetchUsers();
            closeModal1();
        } catch (error) {
            console.error('Error adding user:', error);
            if (error.message && error.message.errors) {
                setErrors(error.message.errors);
                toast.error(error.message.message || 'An error occurred');
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    };
    const closeModal1 = () => {
        setErrors({}); // Reset errors on new submission

        const modalElement = document.getElementById('addClientUserModal');
        const modal = window.bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleEditUser = (user) => {
        setErrors({}); // Reset errors on new submission

        setEditingUser(user);
        setNewUser({
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            username: user.username,
            password: '',
            mobile_no: user.mobile_no,
            role_id: user.role_id,
            address: user.address,
        });
    };

    return (
        <div>
            <Sidebar />
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />



            <div className="main main-app p-3 p-lg-4">



                <div className="row">
                    <div className="card card-body mt-4 col-md-3">
                        {client ? (
                            <>
                                <h2>{client.client_name}</h2>
                                <p><strong>Client Code:</strong> {client.client_code}</p>
                                <p><strong>Contact Person:</strong> {client.contact_person}</p>
                                <p><strong>Mobile No:</strong> {client.mobile_no}</p>
                                <p><strong>Email:</strong> {client.email}</p>
                                <p><strong>Address:</strong> {client.address}</p>
                                {client.logo && <img src={client.logo} alt="Client Logo" style={{ width: '150px' }} />}
                                <p><strong>Status:</strong> {client.status ? 'Active' : 'Inactive'}</p>
                            </>
                        ) : <p>Loading client details...</p>}
                    </div>

                    <div className="row g-3 col-md-9">

                        {/* Device Section */}
                        <div className="d-md-flex align-items-center justify-content-between mb-3">
                            <div>
                                <h4 className="main-title mb-0">Devices</h4>
                            </div>
                            <div className="mt-3 mt-md-0 d-flex gap-2">
                                <button
                                    type="button"
                                    className="btn btn-primary d-flex align-items-center gap-2"
                                    data-bs-toggle="modal"
                                    data-bs-target="#addDeviceModal"
                                    onClick={resetDeviceForm}
                                >
                                    <i className="ri-add-line fs-18 lh-1"></i>Add New Device
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary d-flex align-items-center gap-2"
                                    data-bs-toggle="modal"
                                    data-bs-target="#addClientUserModal"
                                    onClick={resetClientUserForm}
                                >
                                    <i className="ri-add-line fs-18 lh-1"></i>Add New Client User
                                </button>
                            </div>
                        </div>

                        {/* Device Table */}
                        <div className="row g-3">
                            <div className="col-xl-12">
                                <div className="card card-one">
                                    <div className="card-body pb-3">
                                        <div className="d-flex align-items-center mb-2">
                                            <div className="form-search me-auto border py-0 shadow-none w-25">
                                                <input type="text" className="form-control" placeholder="Search" value={searchDevices} onChange={(e) => setSearchDevices(e.target.value)} />
                                                <i className="ri-search-line"></i>
                                            </div>
                                            <span className="me-2">Show</span>
                                            <select className="form-select me-2 w-10" value={pageSize} onChange={(e) => setPageSize(parseInt(e.target.value))}>
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
                                                        <th className="w-24" onClick={() => handleSortChangeDevice("client")}> Client
                                                            {sortByDevice.field === "client" && (
                                                                <span style={{ display: "inline-flex" }}>
                                                                    {sortByDevice.order === "asc" ? (
                                                                        <i className="ri-arrow-up-fill"></i>
                                                                    ) : (
                                                                        <i className="ri-arrow-down-fill"></i>
                                                                    )}
                                                                </span>
                                                            )}
                                                        </th>
                                                        <th className="w-24" onClick={() => handleSortChangeDevice("device_type_id")}> Device Type
                                                            {sortByDevice.field === "device_type_id" && (
                                                                <span style={{ display: "inline-flex" }}>
                                                                    {sortByDevice.order === "asc" ? (
                                                                        <i className="ri-arrow-up-fill"></i>
                                                                    ) : (
                                                                        <i className="ri-arrow-down-fill"></i>
                                                                    )}
                                                                </span>
                                                            )}
                                                        </th>
                                                        <th className="w-24" onClick={() => handleSortChangeDevice("serial_no")}> Serial No.
                                                            {sortByDevice.field === "serial_no" && (
                                                                <span style={{ display: "inline-flex" }}>
                                                                    {sortByDevice.order === "asc" ? (
                                                                        <i className="ri-arrow-up-fill"></i>
                                                                    ) : (
                                                                        <i className="ri-arrow-down-fill"></i>
                                                                    )}
                                                                </span>
                                                            )}
                                                        </th>
                                                        <th className="w-24" onClick={() => handleSortChangeDevice("mobile_no")}> Mobile No.
                                                            {sortByDevice.field === "mobile_no" && (
                                                                <span style={{ display: "inline-flex" }}>
                                                                    {sortByDevice.order === "asc" ? (
                                                                        <i className="ri-arrow-up-fill"></i>
                                                                    ) : (
                                                                        <i className="ri-arrow-down-fill"></i>
                                                                    )}
                                                                </span>
                                                            )}
                                                        </th>
                                                        <th className="w-24" onClick={() => handleSortChangeDevice("port_no")}> Port No.
                                                            {sortByDevice.field === "port_no" && (
                                                                <span style={{ display: "inline-flex" }}>
                                                                    {sortByDevice.order === "asc" ? (
                                                                        <i className="ri-arrow-up-fill"></i>
                                                                    ) : (
                                                                        <i className="ri-arrow-down-fill"></i>
                                                                    )}
                                                                </span>
                                                            )}
                                                        </th>
                                                        <th className="w-24" onClick={() => handleSortChangeDevice("status")}> Status
                                                            {sortByDevice.field === "status" && (
                                                                <span style={{ display: "inline-flex" }}>
                                                                    {sortByDevice.order === "asc" ? (
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
                                                    {Array.isArray(devices) && devices.length > 0 ? devices.map((device, index) => (
                                                        <tr key={device.device_id} style={{ opacity: device.status ? 1 : 0.5 }}>
                                                            <td className="text-center">{index + 1}</td>
                                                            <td>{clients.find(client => client.client_id === device.client_id)?.client_name || ''}</td>
                                                            <td>{deviceTypes.find(type => type.device_type_id === device.device_type_id)?.device_type || ''}</td>
                                                            <td>{device.serial_no}</td>
                                                            <td>{device.mobile_no}</td>
                                                            <td>{device.port_no}</td>
                                                            <td>{device.status ? 'Active' : 'Inactive'}</td>
                                                            <td className="text-center">
                                                                <div className="d-flex align-items-center justify-content-center">
                                                                    {device.status && (
                                                                        <a href="#" className="text-success me-2" onClick={() => handleEditDevice(device)} data-bs-toggle="modal" data-bs-target="#addDeviceModal">
                                                                            <i className="ri-pencil-line fs-18 lh-1"></i>
                                                                        </a>
                                                                    )}
                                                                    <div className="form-check form-switch me-2">
                                                                        <input className="form-check-input" type="checkbox" role="switch" id={`flexSwitchCheckChecked-${device.device_id}`} checked={device.status} onChange={() => handleToggleStatusDevice(device)} />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )) : (
                                                        <tr>
                                                            <td colSpan="8" className="text-center">No devices found</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="card-footer p-2">
                                        <div className="d-flex justify-content-between align-items-center px-2">
                                            <span>Showing {totalItemsDevices} devices</span>
                                            <Pagination
                                                currentPage={pageDevices}
                                                totalPages={totalPagesDevices}
                                                onPageChange={setPageDevices}
                                                pageSize={pageSizeDevices}
                                                onPageSizeChange={setPageSizeDevices}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Client User Section */}
                        <div className="d-md-flex align-items-center justify-content-between mt-5 mb-3">
                            <div>
                                {/* <ol className="breadcrumb fs-sm mb-1">
                                    <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">Client Users</li>
                                </ol> */}
                                <h4 className="main-title mb-0">Client Users</h4>
                            </div>

                        </div>
                        {/* Client User Table */}
                        <div className="row g-3">
                            <div className="col-xl-12">
                                <div className="card card-one">
                                    <div className="card-body pb-3">
                                        <div className="d-flex align-items-center mb-2">
                                            <div className="form-search me-auto border py-0 shadow-none w-25">
                                                <input type="text" className="form-control" placeholder="Search" value={searchClientUsers} onChange={(e) => setSearchClientUsers(e.target.value)} />
                                                <i className="ri-search-line"></i>
                                            </div>
                                            <span className="me-2">Show</span>
                                            <select className="form-select me-2 w-10" value={pageSize} onChange={(e) => setPageSize(parseInt(e.target.value))}>
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
                                                        <th className="w-24" onClick={() => handleSortChangeClientUser("client_id")}>Client Name
                                                            {sortByClientUser.field === "client_id" && (
                                                                <span style={{ display: "inline-flex" }}>
                                                                    {sortByClientUser.order === "asc" ? (
                                                                        <i className="ri-arrow-up-fill"></i>
                                                                    ) : (
                                                                        <i className="ri-arrow-down-fill"></i>
                                                                    )}
                                                                </span>
                                                            )}
                                                        </th>
                                                        <th className="w-24" onClick={() => handleSortChangeClientUser("user")}>User Name
                                                            {sortByClientUser.field === "user" && (
                                                                <span style={{ display: "inline-flex" }}>
                                                                    {sortByClientUser.order === "asc" ? (
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
                                                    {Array.isArray(clientUsers) && clientUsers.length > 0 ? clientUsers.map((clientUser, index) => {
                                                        // Find the corresponding user from the users list based on clientUser's user_id
                                                        const user = users.find((u) => u.user_id === clientUser.user_id);

                                                        return (
                                                            <tr key={clientUser.client_user_id}>
                                                                <td className="text-center">{index + 1}</td>
                                                                <td>{clientUser.client?.client_name || 'No Client Name'}</td>
                                                                <td>{user?.name || 'No User Name'}</td> {/* Display the user name from the users list */}
                                                                <td className="text-center">
                                                                    <div className="d-flex align-items-center justify-content-center">
                                                                        <a href="#"
                                                                            className="text-success me-2"
                                                                            onClick={() => handleEditUser(user)}  // Pass the user from the users list
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#addClientUserModal">
                                                                            <i className="ri-pencil-line fs-18 lh-1"></i>
                                                                        </a>
                                                                        <a href="#"
                                                                            className="text-danger"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#deleteUserModal"
                                                                            onClick={() => setDeletingClientUserId(clientUser.client_user_id)}>
                                                                            <i className="ri-delete-bin-line fs-18 lh-1"></i>
                                                                        </a>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    }) : (
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
                                            <span>Showing {totalItemsClientUsers} client users</span>
                                            <Pagination
                                                currentPage={pageClientUsers}
                                                totalPages={totalPagesClientUsers}
                                                onPageChange={setPageClientUsers}
                                                pageSize={pageSizeClientUsers}
                                                onPageSizeChange={setPageSizeClientUsers}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Add/Edit Device Modal */}
            <div className="modal fade" id="addDeviceModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title" id="exampleModalLabel">{editingDevice ? "Edit Device" : "Add New Device"}</h5>
                            <button type="button" className="btn-close modal_close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={editingDevice ? handleUpdateDevice : handleAddDevice}>
                                <div className="row g-3">
                                    {/* <div className="col-md-6">
                                        <label className="form-label">Client <span className="text-danger">*</span></label>
                                        <select className={`form-control ${errorsDevice.client_id ? "is-invalid" : ""}`} name="client_id" value={newDevice.client_id} onChange={(e) => setNewDevice({ ...newDevice, client_id: e.target.value })}>
                                            <option value="">Select Client</option>
                                            {clients.map(client => (
                                                <option key={client.client_id} value={client.client_id}>{client.client_name}</option>
                                            ))}
                                        </select>
                                        {errorsDevice.client_id && <div className="invalid-feedback">{errorsDevice.client_id}</div>}
                                    </div> */}
                                    <div className="col-md-6">
                                        <label className="form-label">Device Type <span className="text-danger">*</span></label>
                                        <select className={`form-control ${errorsDevice.device_type_id ? "is-invalid" : ""}`} name="device_type_id" value={newDevice.device_type_id} onChange={(e) => setNewDevice({ ...newDevice, device_type_id: e.target.value })}>
                                            <option value="">Select Device Type</option>
                                            {deviceTypes.map(deviceType => (
                                                <option key={deviceType.device_type_id} value={deviceType.device_type_id}>{deviceType.device_type}</option>
                                            ))}
                                        </select>
                                        {errorsDevice.device_type_id && <div className="invalid-feedback">{errorsDevice.device_type_id}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Serial No <span className="text-danger">*</span></label>
                                        <input type="text" className={`form-control ${errorsDevice.serial_no ? "is-invalid" : ""}`} name="serial_no" value={newDevice.serial_no} onChange={(e) => setNewDevice({ ...newDevice, serial_no: e.target.value })} placeholder="Enter Serial No" />
                                        {errorsDevice.serial_no && <div className="invalid-feedback">{errorsDevice.serial_no}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Mobile No <span className="text-danger">*</span></label>
                                        <input type="text" className={`form-control ${errorsDevice.mobile_no ? "is-invalid" : ""}`} name="mobile_no" value={newDevice.mobile_no} onChange={(e) => setNewDevice({ ...newDevice, mobile_no: e.target.value })} placeholder="Enter Mobile No" />
                                        {errorsDevice.mobile_no && <div className="invalid-feedback">{errorsDevice.mobile_no}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Port No <span className="text-danger">*</span></label>
                                        <input type="text" className={`form-control ${errorsDevice.port_no ? "is-invalid" : ""}`} name="port_no" value={newDevice.port_no} onChange={(e) => setNewDevice({ ...newDevice, port_no: e.target.value })} placeholder="Enter Port No" />
                                        {errorsDevice.port_no && <div className="invalid-feedback">{errorsDevice.port_no}</div>}
                                    </div>
                                </div>
                                <div className="modal-footer d-block border-top-0">
                                    <div className="d-flex gap-2 mb-1 mt-2">
                                        <button type="button" className="btn btn-white flex-fill" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" className="btn btn-primary flex-fill">{editingDevice ? "Update" : "Save"}</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add/Edit Client User Modal */}
            <div className="modal fade" id="addClientUserModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title" id="exampleModalLabel">{editingClientUser ? "Edit Client User" : "Add New Client User"}</h5>
                            <button type="button" className="btn-close modal_close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={editingUser ? handleUpdateUser : handleAddUser}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Name <span className="text-danger">*</span></label>
                                        <input type="text" className={`form-control ${errors.name ? "is-invalid" : ""}`} name="name" value={newUser.name} onChange={handleInputChange} placeholder="Enter your name" />
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Email <span className="text-danger">*</span></label>
                                        <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} name="email" value={newUser.email} onChange={handleInputChange} placeholder="Enter your email" />
                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Username <span className="text-danger">*</span></label>
                                        <input type="text" className={`form-control ${errors.username ? "is-invalid" : ""}`} name="username" value={newUser.username} onChange={handleInputChange} placeholder="Enter your username" />
                                        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                                    </div>
                                    {!editingUser && (
                                        <div className="col-md-6">
                                            <label className="form-label">Password <span className="text-danger">*</span></label>
                                            <input type="password" className={`form-control ${errors.password ? "is-invalid" : ""}`} name="password" value={newUser.password} onChange={handleInputChange} placeholder="Enter your password" />
                                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                        </div>
                                    )}
                                    <div className="col-md-6">
                                        <label className="form-label">Mobile No. <span className="text-danger">*</span></label>
                                        <input type="text" className={`form-control ${errors.mobile_no ? "is-invalid" : ""}`} name="mobile_no" value={newUser.mobile_no} onChange={handleInputChange} placeholder="Enter your mobile no." />
                                        {errors.mobile_no && <div className="invalid-feedback">{errors.mobile_no}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Role <span className="text-danger">*</span></label>
                                        <select className={`form-control ${errors.role_id ? "is-invalid" : ""}`} name="role_id" value={newUser.role_id} onChange={handleInputChange}>
                                            <option value="">Select a role</option>
                                            {roles.map(role => (
                                                <option key={role.role_id} value={role.role_id}>{role.role}</option>
                                            ))}
                                        </select>
                                        {errors.role_id && <div className="invalid-feedback">{errors.role_id}</div>}
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label">Address</label>
                                        <textarea rows="2" className={`form-control ${errors.address ? "is-invalid" : ""}`} name="address" value={newUser.address} onChange={handleInputChange} placeholder="Enter your address"></textarea>
                                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                                    </div>
                                </div>
                                <div className="modal-footer d-block border-top-0">
                                    <div className="d-flex gap-2 mb-4">
                                        <button type="button" className="btn btn-white flex-fill" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" className="btn btn-primary flex-fill">{editingUser ? "Update" : "Save"}</button>
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

export default CombinedDeviceClientUser;
