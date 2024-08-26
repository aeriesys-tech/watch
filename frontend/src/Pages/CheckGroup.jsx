import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../Components/Sidebar/Sidebar';
import Pagination from '../Components/Pagination/Pagination';
import axiosWrapper from '../../src/utils/AxiosWrapper'; // Import the axiosWrapper function
import { useNavigate } from 'react-router-dom';

function CheckGroup() {
    const [checkGroups, setCheckGroups] = useState([]);
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

    const navigate = useNavigate(); // Use navigate for redirecting if needed

    // State for new check group form
    const [newCheckGroup, setNewCheckGroup] = useState({
        check_group_id: null,
        check_group: '',
        status: true
    });

    const [errors, setErrors] = useState({});

    // State for editing check group
    const [editingCheckGroup, setEditingCheckGroup] = useState(null);

    const startIndex = (page - 1) * pageSize + 1;
    const endIndex = Math.min(page * pageSize, totalItems);

    const handleSortChange = (field) => {
        setSortBy((prevSort) => ({
            field,
            order:
                prevSort.field === field && prevSort.order === "asc" ? "desc" : "asc",
        }));
    };

    const fetchCheckGroups = async () => {
        const queryString = `?page=${page}&limit=${pageSize}&sortBy=${sortBy.field}&order=${sortBy.order}&search=${search}`;
        try {
            setLoading(true);
            const data = await axiosWrapper(`/checkGroup/paginateCheckGroup${queryString}`, {}, navigate);

            setCheckGroups(data.data.data);
            setTotalPages(data.data.totalPages || 0);
            setCurrentPage(data.data.currentPage || 1);
            setTotalItems(data.data.totalItems || 0);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error('Error fetching check groups');
        }
    };

    useEffect(() => {
        fetchCheckGroups();
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
        setNewCheckGroup((prevCheckGroup) => ({ ...prevCheckGroup, [name]: value }));
    };

    const handleAddCheckGroup = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors on new submission

        const { status, ...checkGroupData } = newCheckGroup; // Exclude 'status' from the data sent to backend

        try {
            await axiosWrapper('/checkGroup/addCheckGroup', { data: checkGroupData }, navigate);
            toast.success('Check group added successfully');
            resetForm();
            fetchCheckGroups();
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

    const handleEditCheckGroup = (checkGroup) => {
        setErrors({}); // Reset errors on new submission
        setEditingCheckGroup(checkGroup);
        setNewCheckGroup({
            check_group_id: checkGroup.check_group_id,
            check_group: checkGroup.check_group,
            status: checkGroup.status,
        });
    };

    const handleUpdateCheckGroup = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors on new submission

        try {
            await axiosWrapper('/checkGroup/updateCheckGroup', { data: newCheckGroup }, navigate);
            toast.success('Check group updated successfully');
            resetForm();
            fetchCheckGroups();
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

    const handleToggleStatus = async (checkGroup) => {
        try {
            const updatedStatus = !checkGroup.status;
            await axiosWrapper('/checkGroup/deleteCheckGroup', { data: { check_group_id: checkGroup.check_group_id, status: updatedStatus } }, navigate);
            toast.success(`Check group ${updatedStatus ? 'restored' : 'deleted'} successfully`);
            fetchCheckGroups();
        } catch (error) {
            toast.error('An error occurred while updating the check group status');
        }
    };

    const resetForm = () => {
        setEditingCheckGroup(null);
        setNewCheckGroup({
            check_group_id: null,
            check_group: '',
            status: '',
        });
        setErrors({});
    };

    // Function to close the modal
    const closeModal = () => {
        setErrors({}); // Reset errors on new submission

        const modalElement = document.getElementById('addCheckGroupModal');
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
                            <li className="breadcrumb-item active" aria-current="page">Check Groups</li>
                        </ol>
                        <h4 className="main-title mb-0">Check Groups</h4>
                    </div>
                    <div className="mt-3 mt-md-0">
                        <button type="button" className="btn btn-primary d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#addCheckGroupModal" onClick={resetForm}>
                            <i className="ri-add-line fs-18 lh-1"></i>Add New Check Group
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
                                                <th className="w-24" onClick={() => handleSortChange("check_group")}>Check Group
                                                    {sortBy.field === "check_group" && (
                                                        <span style={{ display: "inline-flex" }}>
                                                            {sortBy.order === "asc" ? (
                                                                <i className="ri-arrow-up-fill"></i>
                                                            ) : (
                                                                <i className="ri-arrow-down-fill"></i>
                                                            )}
                                                        </span>
                                                    )}
                                                </th>
                                                <th className="w-24" onClick={() => handleSortChange("status")}>Status
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
                                            {Array.isArray(checkGroups) && checkGroups.length > 0 ? checkGroups.map((checkGroup, index) => (
                                                <tr key={checkGroup.id} style={{ opacity: checkGroup.status ? 1 : 0.5 }}>
                                                    <td className="text-center">{startIndex + index}</td> {/* Serial number */}
                                                    <td>{checkGroup.check_group}</td>
                                                    <td>{checkGroup.status ? 'Active' : 'Inactive'}</td>
                                                    <td className="text-center">
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            {checkGroup.status && (
                                                                <a href="#" className="text-success me-2" onClick={() => handleEditCheckGroup(checkGroup)} data-bs-toggle="modal" data-bs-target="#addCheckGroupModal">
                                                                    <i className="ri-pencil-line fs-18 lh-1"></i>
                                                                </a>
                                                            )}
                                                            <div className="form-check form-switch me-2">
                                                                <input className="form-check-input" type="checkbox" role="switch" id={`flexSwitchCheckChecked-${checkGroup.id}`} checked={checkGroup.status} onChange={() => handleToggleStatus(checkGroup)} />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="8" className="text-center">No check groups found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="card-footer p-2">
                                <div className="d-flex justify-content-between align-items-center px-2">
                                    <span>Showing {startIndex} to {endIndex} of {totalItems} check groups</span>
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
            <div className="modal fade" id="addCheckGroupModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title" id="exampleModalLabel">{editingCheckGroup ? "Edit Check Group" : "Add New Check Group"}</h5>
                            <button type="button" className="btn-close modal_close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={editingCheckGroup ? handleUpdateCheckGroup : handleAddCheckGroup}>
                                <div className="row g-3">
                                    <div className="col-md-12">
                                        <label className="form-label">Check Group <span className="text-danger">*</span></label>
                                        <input type="text" className={`form-control ${errors.check_group ? "is-invalid" : ""}`} name="check_group" value={newCheckGroup.check_group} onChange={handleInputChange} placeholder="Enter Check Group" />
                                        {errors.check_group && <div className="invalid-feedback">{errors.check_group}</div>}
                                    </div>
                                </div>
                                <div className="modal-footer d-block border-top-0">
                                    <div className="d-flex gap-2 mb-1 mt-2">
                                        <button type="button" className="btn btn-white flex-fill" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" className="btn btn-primary flex-fill">{editingCheckGroup ? "Update" : "Save"}</button>
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

export default CheckGroup;
