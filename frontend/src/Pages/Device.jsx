import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../Components/Sidebar/Sidebar';
import Pagination from '../Components/Pagination/Pagination';
import axiosWrapper from '../../src/utils/AxiosWrapper'; // Import the axiosWrapper function
import { useNavigate } from 'react-router-dom';

function Device() {
    const [devices, setDevices] = useState([]);
    const [clients, setClients] = useState([]);
    const [deviceTypes, setDeviceTypes] = useState([]);
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

    // State for new device form
    const [newDevice, setNewDevice] = useState({

        client_id: '',
        device_type_id: '',
        serial_no: '',
        mobile_no: '',
        port_no: '',
        status: true,
    });

    const [errors, setErrors] = useState({});

    // State for editing device
    const [editingDevice, setEditingDevice] = useState(null);

    const startIndex = (page - 1) * pageSize + 1;
    const endIndex = Math.min(page * pageSize, totalItems);

    const handleSortChange = (field) => {
        setSortBy((prevSort) => ({
            field,
            order:
                prevSort.field === field && prevSort.order === "asc" ? "desc" : "asc",
        }));
    };

    const fetchDevices = async () => {
        const queryString = `?page=${page}&limit=${pageSize}&sortBy=${sortBy.field}&order=${sortBy.order}&search=${search}`;
        try {
            setLoading(true);
            const data = await axiosWrapper(`/device/paginateDevices${queryString}`, {}, navigate);

            setDevices(data.data.data);
            setTotalPages(data.data.totalPages || 0);
            setCurrentPage(data.data.currentPage || 1);
            setTotalItems(data.data.totalItems || 0);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error('Error fetching devices');
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

    const fetchDeviceTypes = async () => {
        try {
            const data = await axiosWrapper('/deviceType/getDeviceTypes', {}, navigate);
            setDeviceTypes(data.data || []); // Fallback to an empty array if no data is returned
        } catch (error) {
            toast.error('Error fetching device types');
            setDeviceTypes([]); // Ensure deviceTypes is set to an empty array on error
        }
    };

    useEffect(() => {
        fetchDevices();
        fetchClients();
        fetchDeviceTypes();
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
        setNewDevice((prevDevice) => ({ ...prevDevice, [name]: value }));
    };

    const handleAddDevice = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors on new submission

        try {
            await axiosWrapper('/device/addDevice', { data: newDevice }, navigate);
            toast.success('Device added successfully');
            resetForm();
            fetchDevices();
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

    const handleEditDevice = (device) => {
        setErrors({}); // Reset errors on new submission

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
        setErrors({}); // Reset errors on new submission

        try {
            await axiosWrapper('/device/updateDevice', { data: newDevice }, navigate);
            toast.success('Device updated successfully');
            resetForm();
            fetchDevices();
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

    const handleToggleStatus = async (device) => {
        try {
            const updatedStatus = !device.status;
            await axiosWrapper('/device/deleteDevice', { data: { device_id: device.device_id, status: updatedStatus } }, navigate);
            toast.success(`Device ${updatedStatus ? 'restored' : 'deleted'} successfully`);
            fetchDevices();
        } catch (error) {
            toast.error('An error occurred while updating the device status');
        }
    };

    const resetForm = () => {
        setEditingDevice(null);
        setNewDevice({
            client_id: '',
            device_type_id: '',
            serial_no: '',
            mobile_no: '',
            port_no: '',
            status: '',
        });
        setErrors({});
    };

    // Function to close the modal
    const closeModal = () => {
        setErrors({}); // Reset errors on new submission

        const modalElement = document.getElementById('addDeviceModal');
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
                            <li className="breadcrumb-item active" aria-current="page">Devices</li>
                        </ol>
                        <h4 className="main-title mb-0">Devices</h4>
                    </div>
                    <div className="mt-3 mt-md-0">
                        <button type="button" className="btn btn-primary d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#addDeviceModal" onClick={resetForm}>
                            <i className="ri-add-line fs-18 lh-1"></i>Add New Device
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
                                                <th className="w-24" onClick={() => handleSortChange("device_type_id")}> Device Type
                                                    {sortBy.field === "device_type_id" && (
                                                        <span style={{ display: "inline-flex" }}>
                                                            {sortBy.order === "asc" ? (
                                                                <i className="ri-arrow-up-fill"></i>
                                                            ) : (
                                                                <i className="ri-arrow-down-fill"></i>
                                                            )}
                                                        </span>
                                                    )}
                                                </th>
                                                <th className="w-24" onClick={() => handleSortChange("serial_no")}> Serial No.
                                                    {sortBy.field === "serial_no" && (
                                                        <span style={{ display: "inline-flex" }}>
                                                            {sortBy.order === "asc" ? (
                                                                <i className="ri-arrow-up-fill"></i>
                                                            ) : (
                                                                <i className="ri-arrow-down-fill"></i>
                                                            )}
                                                        </span>
                                                    )}
                                                </th>
                                                <th className="w-24" onClick={() => handleSortChange("mobile_no")}> Mobile No.
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
                                                <th className="w-24" onClick={() => handleSortChange("port_no")}> Port No.
                                                    {sortBy.field === "port_no" && (
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
                                                <th className="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(devices) && devices.length > 0 ? devices.map((device, index) => (
                                                <tr key={device.device_id} style={{ opacity: device.status ? 1 : 0.5 }}>
                                                    <td className="text-center">{startIndex + index}</td>
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
                                                                <input className="form-check-input" type="checkbox" role="switch" id={`flexSwitchCheckChecked-${device.device_id}`} checked={device.status} onChange={() => handleToggleStatus(device)} />
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
                                    <span>Showing {startIndex} to {endIndex} of {totalItems} devices</span>
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
                                    <div className="col-md-6">
                                        <label className="form-label">Client <span className="text-danger">*</span></label>
                                        <select className={`form-control ${errors.client_id ? "is-invalid" : ""}`} name="client_id" value={newDevice.client_id} onChange={handleInputChange}>
                                            <option value="">Select Client</option>
                                            {clients.map(client => (
                                                <option key={client.client_id} value={client.client_id}>{client.client_name}</option>
                                            ))}
                                        </select>
                                        {errors.client_id && <div className="invalid-feedback">{errors.client_id}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Device Type <span className="text-danger">*</span></label>
                                        <select className={`form-control ${errors.device_type_id ? "is-invalid" : ""}`} name="device_type_id" value={newDevice.device_type_id} onChange={handleInputChange}>
                                            <option value="">Select Device Type</option>
                                            {deviceTypes.map(deviceType => (
                                                <option key={deviceType.device_type_id} value={deviceType.device_type_id}>{deviceType.device_type}</option>
                                            ))}
                                        </select>
                                        {errors.device_type_id && <div className="invalid-feedback">{errors.device_type_id}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Serial No <span className="text-danger">*</span></label>
                                        <input type="text" className={`form-control ${errors.serial_no ? "is-invalid" : ""}`} name="serial_no" value={newDevice.serial_no} onChange={handleInputChange} placeholder="Enter Serial No" />
                                        {errors.serial_no && <div className="invalid-feedback">{errors.serial_no}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Mobile No <span className="text-danger">*</span></label>
                                        <input type="text" className={`form-control ${errors.mobile_no ? "is-invalid" : ""}`} name="mobile_no" value={newDevice.mobile_no} onChange={handleInputChange} placeholder="Enter Mobile No" />
                                        {errors.mobile_no && <div className="invalid-feedback">{errors.mobile_no}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Port No <span className="text-danger">*</span></label>
                                        <input type="text" className={`form-control ${errors.port_no ? "is-invalid" : ""}`} name="port_no" value={newDevice.port_no} onChange={handleInputChange} placeholder="Enter Port No" />
                                        {errors.port_no && <div className="invalid-feedback">{errors.port_no}</div>}
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
        </div>
    );
}

export default Device;
