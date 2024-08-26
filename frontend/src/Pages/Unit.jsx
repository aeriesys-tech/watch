import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../Components/Sidebar/Sidebar';
import Pagination from '../Components/Pagination/Pagination';
import axiosWrapper from '../../src/utils/AxiosWrapper'; // Import the axiosWrapper function
import { useNavigate } from 'react-router-dom';

function Unit() {
    const [units, setUnits] = useState([]);
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

    // State for new unit form
    const [newUnit, setNewUnit] = useState({
        unit_id: null,
        unit: '',
        status: true
    });

    const [errors, setErrors] = useState({});

    // State for editing unit
    const [editingUnit, setEditingUnit] = useState(null);

    const startIndex = (page - 1) * pageSize + 1;
    const endIndex = Math.min(page * pageSize, totalItems);

    const handleSortChange = (field) => {
        setSortBy((prevSort) => ({
            field,
            order:
                prevSort.field === field && prevSort.order === "asc" ? "desc" : "asc",
        }));
    };

    const fetchUnits = async () => {
        const queryString = `?page=${page}&limit=${pageSize}&sortBy=${sortBy.field}&order=${sortBy.order}&search=${search}`;
        try {
            setLoading(true);
            const data = await axiosWrapper(`/unit/paginateUnits${queryString}`, {}, navigate);

            setUnits(data.data.data);
            setTotalPages(data.data.totalPages || 0);
            setCurrentPage(data.data.currentPage || 1);
            setTotalItems(data.data.totalItems || 0);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching unit data:', error);
            toast.error('Error fetching unit data');
        }
    };

    useEffect(() => {
        fetchUnits();
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
        setNewUnit((prevUnit) => ({ ...prevUnit, [name]: value }));
    };

    const handleAddUnit = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors on new submission

        const { status, ...unitData } = newUnit; // Exclude 'status' from the data sent to backend

        try {
            await axiosWrapper('/unit/addUnit', { data: unitData }, navigate);
            toast.success('Unit added successfully');
            resetForm();
            fetchUnits();
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

    const handleEditUnit = (unit) => {
        setEditingUnit(unit);
        setNewUnit({
            unit_id: unit.unit_id,
            unit: unit.unit,
            status: unit.status,
        });
    };

    const handleUpdateUnit = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors on new submission

        try {
            await axiosWrapper('/unit/updateUnit', { data: newUnit }, navigate);
            toast.success('Unit updated successfully');
            resetForm();
            fetchUnits();
            closeModal(); // Close the modal after successful update
        } catch (error) {
            console.error('Error updating unit:', error);
            if (error.message && error.message.errors) {
                setErrors(error.message.errors);
                toast.error(error.message.message || 'An error occurred');
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    };

    const handleToggleStatus = async (unit) => {
        try {
            const updatedStatus = !unit.status;
            await axiosWrapper('/unit/deleteUnit', { data: { unit_id: unit.unit_id, status: updatedStatus } }, navigate);
            toast.success(`Unit ${updatedStatus ? 'restored' : 'deleted'} successfully`);
            fetchUnits();
        } catch (error) {
            console.error('Error toggling unit status:', error);
            toast.error('An error occurred while updating the unit status');
        }
    };

    const resetForm = () => {
        setEditingUnit(null);
        setNewUnit({
            unit_id: null,
            unit: '',
            status: '',
        });
        setErrors({});
    };

    // Function to close the modal
    const closeModal = () => {
        const modalElement = document.getElementById('addUnitModal');
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
                            <li className="breadcrumb-item active" aria-current="page">Units</li>
                        </ol>
                        <h4 className="main-title mb-0">Units</h4>
                    </div>
                    <div className="mt-3 mt-md-0">
                        <button type="button" className="btn btn-primary d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#addUnitModal" onClick={resetForm}>
                            <i className="ri-add-line fs-18 lh-1"></i>Add New Unit
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
                                                <th className="w-24" onClick={() => handleSortChange("unit")}>Unit
                                                    {sortBy.field === "unit" && (
                                                        <span style={{ display: "inline-flex" }}>
                                                            {sortBy.order === "asc" ? (
                                                                <i className="ri-arrow-up-fill"></i>
                                                            ) : (
                                                                <i className="ri-arrow-down-fill"></i>
                                                            )}
                                                        </span>
                                                    )}
                                                </th>
                                                <th>Status</th>
                                                <th className="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(units) && units.length > 0 ? units.map((unit, index) => (
                                                <tr key={unit.id} style={{ opacity: unit.status ? 1 : 0.5 }}>
                                                    <td className="text-center">{startIndex + index}</td> {/* Serial number */}
                                                    <td>{unit.unit}</td>
                                                    <td>{unit.status ? 'Active' : 'Inactive'}</td>
                                                    <td className="text-center">
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            {unit.status && (
                                                                <a href="#" className="text-success me-2" onClick={() => handleEditUnit(unit)} data-bs-toggle="modal" data-bs-target="#addUnitModal">
                                                                    <i className="ri-pencil-line fs-18 lh-1"></i>
                                                                </a>
                                                            )}
                                                            <div className="form-check form-switch me-2">
                                                                <input className="form-check-input" type="checkbox" role="switch" id={`flexSwitchCheckChecked-${unit.id}`} checked={unit.status} onChange={() => handleToggleStatus(unit)} />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="8" className="text-center">No units found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="card-footer p-2">
                                <div className="d-flex justify-content-between align-items-center px-2">
                                    <span>Showing {startIndex} to {endIndex} of {totalItems} units</span>
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
            <div className="modal fade" id="addUnitModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title" id="exampleModalLabel">{editingUnit ? "Edit Unit" : "Add New Unit"}</h5>
                            <button type="button" className="btn-close modal_close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={editingUnit ? handleUpdateUnit : handleAddUnit}>
                                <div className="row g-3">
                                    <div className="col-md-12">
                                        <label className="form-label">Unit <span className="text-danger">*</span></label>
                                        <input type="text" className={`form-control ${errors.unit ? "is-invalid" : ""}`} name="unit" value={newUnit.unit} onChange={handleInputChange} placeholder="Enter Unit" />
                                        {errors.unit && <div className="invalid-feedback">{errors.unit}</div>}
                                    </div>
                                </div>
                                <div className="modal-footer d-block border-top-0">
                                    <div className="d-flex gap-2 mb-1 mt-2">
                                        <button type="button" className="btn btn-white flex-fill" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" className="btn btn-primary flex-fill">{editingUnit ? "Update" : "Save"}</button>
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

export default Unit;
