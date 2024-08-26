import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../Components/Sidebar/Sidebar';
import Pagination from '../Components/Pagination/Pagination';
import axiosWrapper from '../../src/utils/AxiosWrapper'; // Import the axiosWrapper function
import { useNavigate } from 'react-router-dom';

function Client() {
    const [clients, setClients] = useState([]);
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

    // State for new client form
    const [newClient, setNewClient] = useState({
        client_id: null,
        client_code: '',
        client_name: '',
        contact_person: '',
        mobile_no: '',
        email: '',
        address: '',
        logo: '',
        status: true,
    });

    const [errors, setErrors] = useState({});

    // State for editing client
    const [editingClient, setEditingClient] = useState(null);

    const startIndex = (page - 1) * pageSize + 1;
    const endIndex = Math.min(page * pageSize, totalItems);

    const handleSortChange = (field) => {
        setSortBy((prevSort) => ({
            field,
            order:
                prevSort.field === field && prevSort.order === "asc" ? "desc" : "asc",
        }));
    };

    const fetchClients = async () => {
        const queryString = `?page=${page}&limit=${pageSize}&sortBy=${sortBy.field}&order=${sortBy.order}&search=${search}`;
        try {
            setLoading(true);
            const data = await axiosWrapper(`/client/paginateClient${queryString}`, {}, navigate);

            setClients(data.data.data);
            setTotalPages(data.data.totalPages || 0);
            setCurrentPage(data.data.currentPage || 1);
            setTotalItems(data.data.totalItems || 0);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error('Error fetching clients');
        }
    };

    useEffect(() => {
        fetchClients();
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
        setNewClient((prevClient) => ({ ...prevClient, [name]: value }));
    };

    const handleAddClient = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors on new submission

        const { status, ...clientData } = newClient; // Exclude 'status' from the data sent to backend

        try {
            await axiosWrapper('/client/addClient', { data: clientData }, navigate);
            toast.success('Client added successfully');
            resetForm();
            fetchClients();
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

    const handleEditClient = (client) => {
        setEditingClient(client);
        setNewClient({
            client_id: client.client_id,
            client_code: client.client_code,
            client_name: client.client_name,
            contact_person: client.contact_person,
            mobile_no: client.mobile_no,
            email: client.email,
            address: client.address,
            logo: client.logo,
            status: client.status,
        });
    };

    const handleUpdateClient = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors on new submission

        try {
            await axiosWrapper('/client/updateClient', { data: newClient }, navigate);
            toast.success('Client updated successfully');
            resetForm();
            fetchClients();
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

    const handleToggleStatus = async (client) => {
        try {
            const updatedStatus = !client.status;
            await axiosWrapper('/client/deleteClient', { data: { client_id: client.client_id, status: updatedStatus } }, navigate);
            toast.success(`Client ${updatedStatus ? 'restored' : 'deleted'} successfully`);
            fetchClients();
        } catch (error) {
            toast.error('An error occurred while updating the client status');
        }
    };

    const resetForm = () => {
        setEditingClient(null);
        setNewClient({
            client_id: null,
            client_code: '',
            client_name: '',
            contact_person: '',
            mobile_no: '',
            email: '',
            address: '',
            logo: '',
            status: '',
        });
        setErrors({});
    };

    // Function to close the modal
    const closeModal = () => {
        const modalElement = document.getElementById('addClientModal');
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
                            <li className="breadcrumb-item active" aria-current="page">Clients</li>
                        </ol>
                        <h4 className="main-title mb-0">Clients</h4>
                    </div>
                    <div className="mt-3 mt-md-0">
                        <button type="button" className="btn btn-primary d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#addClientModal" onClick={resetForm}>
                            <i className="ri-add-line fs-18 lh-1"></i>Add New Client
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
                                                <th className="w-24" onClick={() => handleSortChange("client_name")}>Client Name
                                                    {sortBy.field === "client_name" && (
                                                        <span style={{ display: "inline-flex" }}>
                                                            {sortBy.order === "asc" ? (
                                                                <i className="ri-arrow-up-fill"></i>
                                                            ) : (
                                                                <i className="ri-arrow-down-fill"></i>
                                                            )}
                                                        </span>
                                                    )}
                                                </th>
                                                <th>Client Code</th>
                                                <th>Contact Person</th>
                                                <th>Mobile No</th>
                                                <th>Email</th>
                                                <th>Address</th>
                                                {/* <th>Logo</th> */}
                                                <th>Status</th>
                                                <th className="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(clients) && clients.length > 0 ? clients.map((client, index) => (
                                                <tr key={client.client_id} style={{ opacity: client.status ? 1 : 0.5 }}>
                                                    <td className="text-center">{startIndex + index}</td> {/* Serial number */}
                                                    <td>{client.client_name}</td>
                                                    <td>{client.client_code}</td>
                                                    <td>{client.contact_person}</td>
                                                    <td>{client.mobile_no}</td>
                                                    <td>{client.email}</td>
                                                    <td>{client.address}</td>
                                                    {/* <td>{client.logo}</td> */}
                                                    <td>{client.status ? 'Active' : 'Inactive'}</td>
                                                    <td className="text-center">
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            {client.status && (
                                                                <a href="#" className="text-success me-2" onClick={() => handleEditClient(client)} data-bs-toggle="modal" data-bs-target="#addClientModal">
                                                                    <i className="ri-pencil-line fs-18 lh-1"></i>
                                                                </a>
                                                            )}
                                                            <div className="form-check form-switch me-2">
                                                                <input className="form-check-input" type="checkbox" role="switch" id={`flexSwitchCheckChecked-${client.client_id}`} checked={client.status} onChange={() => handleToggleStatus(client)} />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="10" className="text-center">No clients found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="card-footer p-2">
                                <div className="d-flex justify-content-between align-items-center px-2">
                                    <span>Showing {startIndex} to {endIndex} of {totalItems} clients</span>
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
            <div className="modal fade" id="addClientModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title" id="exampleModalLabel">{editingClient ? "Edit Client" : "Add New Client"}</h5>
                            <button type="button" className="btn-close modal_close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={editingClient ? handleUpdateClient : handleAddClient}>
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="form-label">Client Code <span className="text-danger">*</span></label>
                                        <input type="text" className={`form-control ${errors.client_code ? "is-invalid" : ""}`} name="client_code" value={newClient.client_code} onChange={handleInputChange} placeholder="Enter Client Code" />
                                        {errors.client_code && <div className="invalid-feedback">{errors.client_code}</div>}
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Client Name <span className="text-danger">*</span></label>
                                        <input type="text" className={`form-control ${errors.client_name ? "is-invalid" : ""}`} name="client_name" value={newClient.client_name} onChange={handleInputChange} placeholder="Enter Client Name" />
                                        {errors.client_name && <div className="invalid-feedback">{errors.client_name}</div>}
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Contact Person</label>
                                        <input type="text" className={`form-control ${errors.contact_person ? "is-invalid" : ""}`} name="contact_person" value={newClient.contact_person} onChange={handleInputChange} placeholder="Enter Contact Person" />
                                        {errors.contact_person && <div className="invalid-feedback">{errors.contact_person}</div>}
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Mobile No</label>
                                        <input type="text" className={`form-control ${errors.mobile_no ? "is-invalid" : ""}`} name="mobile_no" value={newClient.mobile_no} onChange={handleInputChange} placeholder="Enter Mobile No" />
                                        {errors.mobile_no && <div className="invalid-feedback">{errors.mobile_no}</div>}
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Email</label>
                                        <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} name="email" value={newClient.email} onChange={handleInputChange} placeholder="Enter Email" />
                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Logo</label>
                                        <input type="text" className={`form-control ${errors.logo ? "is-invalid" : ""}`} name="logo" value={newClient.logo} onChange={handleInputChange} placeholder="Enter Logo URL" />
                                        {errors.logo && <div className="invalid-feedback">{errors.logo}</div>}
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label">Address</label>
                                        <textarea className={`form-control ${errors.address ? "is-invalid" : ""}`} name="address" value={newClient.address} onChange={handleInputChange} placeholder="Enter Address" />
                                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                                    </div>

                                </div>
                                <div className="modal-footer d-block border-top-0">
                                    <div className="d-flex gap-2 mb-1 mt-2">
                                        <button type="button" className="btn btn-white flex-fill" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" className="btn btn-primary flex-fill">{editingClient ? "Update" : "Save"}</button>
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

export default Client;
