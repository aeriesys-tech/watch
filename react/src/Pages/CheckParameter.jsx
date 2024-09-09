import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../Components/Sidebar/Sidebar1';
import Pagination from '../Components/Pagination/Pagination';
import axiosWrapper from '../../src/utils/AxiosWrapper'; // Import the axiosWrapper function
import { useNavigate } from 'react-router-dom';
import { hasPermission } from "../Services/authUtils";

import img1 from '../Assets/img/icon/akar-icons_search.svg'
import img2 from '../Assets/img/icon/fluent_add-16-filled.svg'

function CheckParameter() {
    const [checkParameters, setCheckParameters] = useState([]);
    const [deviceTypes, setDeviceTypes] = useState([]);
    const [checkGroups, setCheckGroups] = useState([]);
    const [units, setUnits] = useState([]);
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

    // State for new check parameter form
    const [newCheckParameter, setNewCheckParameter] = useState({
        check_parameter_id: null,
        device_type_id: '',
        check_group_id: '',
        parameter_code: '',
        parameter_name: '',
        unit_id: '',
        icon: '',
        status: true,
    });

    const [errors, setErrors] = useState({});

    // State for editing check parameter
    const [editingCheckParameter, setEditingCheckParameter] = useState(null);

    const startIndex = (page - 1) * pageSize + 1;
    const endIndex = Math.min(page * pageSize, totalItems);

    const handleSortChange = (field) => {
        setSortBy((prevSort) => ({
            field,
            order:
                prevSort.field === field && prevSort.order === "asc" ? "desc" : "asc",
        }));
    };

    const fetchCheckParameters = async () => {
        const queryString = `?page=${page}&limit=${pageSize}&sortBy=${sortBy.field}&order=${sortBy.order}&search=${search}`;
        try {
            setLoading(true);
            const data = await axiosWrapper(`/checkParamter/paginateCheckParameters${queryString}`, {}, navigate);

            setCheckParameters(data.data.data);
            setTotalPages(data.data.totalPages || 0);
            setCurrentPage(data.data.currentPage || 1);
            setTotalItems(data.data.totalItems || 0);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error('Error fetching check parameters');
        }
    };

    const fetchDeviceTypes = async () => {
        try {
            const data = await axiosWrapper('/deviceType/getDeviceTypes', {}, navigate);
            setDeviceTypes(data.data || []);
            console.log("device", data.data)// Fallback to an empty array if no data is returned
        } catch (error) {
            toast.error('Error fetching device types');
            setDeviceTypes([]); // Ensure deviceTypes is set to an empty array on error
        }
    };

    const fetchCheckGroups = async () => {
        try {
            const data = await axiosWrapper('/checkGroup/getCheckGroups', {}, navigate);
            setCheckGroups(data.data || []);
            console.log("group", data.data)//// Fallback to an empty array if no data is returned
        } catch (error) {
            toast.error('Error fetching check groups');
            setCheckGroups([]); // Ensure checkGroups is set to an empty array on error
        }
    };

    const fetchUnits = async () => {
        try {
            const data = await axiosWrapper('/unit/getUnits', {}, navigate);
            setUnits(data.data || []); // Fallback to an empty array if no data is returned
        } catch (error) {
            toast.error('Error fetching units');
            setUnits([]); // Ensure units is set to an empty array on error
        }
    };

    useEffect(() => {
        fetchCheckParameters();
        fetchDeviceTypes();
        fetchCheckGroups();
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
        setNewCheckParameter((prevCheckParameter) => ({ ...prevCheckParameter, [name]: value }));
    };

    const handleAddCheckParameter = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors on new submission

        const { status, ...checkParameterData } = newCheckParameter; // Exclude 'status' from the data sent to backend

        try {
            await axiosWrapper('/checkParamter/addCheckParameters', { data: checkParameterData }, navigate);
            toast.success('Check Parameter added successfully');
            resetForm();
            fetchCheckParameters();
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

    const handleEditCheckParameter = (checkParameter) => {
        setErrors({}); // Reset errors on new submission

        setEditingCheckParameter(checkParameter);
        setNewCheckParameter({
            check_parameter_id: checkParameter.check_parameter_id,
            device_type_id: checkParameter.device_type_id,
            check_group_id: checkParameter.check_group_id,
            parameter_code: checkParameter.parameter_code,
            parameter_name: checkParameter.parameter_name,
            unit_id: checkParameter.unit_id,
            icon: checkParameter.icon,
            status: checkParameter.status,
        });
    };

    const handleUpdateCheckParameter = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors on new submission

        try {
            await axiosWrapper('/checkParamter/updateCheckParameters', { data: newCheckParameter }, navigate);
            toast.success('Check Parameter updated successfully');
            resetForm();
            fetchCheckParameters();
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

    const handleToggleStatus = async (checkParameter) => {
        try {
            const updatedStatus = !checkParameter.status;
            await axiosWrapper('/checkParamter/deleteCheckParameters', { data: { check_parameter_id: checkParameter.check_parameter_id, status: updatedStatus } }, navigate);
            toast.success(`Check Parameter ${updatedStatus ? 'restored' : 'deleted'} successfully`);
            fetchCheckParameters();
        } catch (error) {
            toast.error('An error occurred while updating the check parameter status');
        }
    };

    const resetForm = () => {
        setEditingCheckParameter(null);
        setNewCheckParameter({
            check_parameter_id: null,
            device_type_id: '',
            check_group_id: '',
            parameter_code: '',
            parameter_name: '',
            unit_id: '',
            icon: '',
            status: '',
        });
        setErrors({});
    };

    // Function to close the modal
    const closeModal = () => {
        setErrors({}); // Reset errors on new submission

        const modalElement = document.getElementById('addCheckParameterModal');
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
                            <li className="breadcrumb-item"><a href="#">Configuration</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Check Parameters</li>
                        </ol>
                        {/* <h4 className="main-title mb-0">Check Parameters</h4> */}
                    </div>
                    {/* {hasPermission(["check_parameters.create"]) && (
                        <div className="mt-3 mt-md-0">
                            <button type="button" className="btn btn-primary d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#addCheckParameterModal" onClick={resetForm}>
                                <i className="ri-add-line fs-18 lh-1"></i>Add New Check Parameter
                            </button>
                        </div>
                    )} */}
                </div>
                <div className="container-fluid mt-28">
                    <div className="row">
                        <div className="col">
                        <h5 className="text-uppercase rate-short-symbol card_title_evry">Check Parameters</h5>
                        </div>
                    </div>
                </div>
                
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">  
                            <div className="card card_parameter">
                                <div className="card-body p-0 pb-3">
                                    <div className="container-fluid px-3 pb-3">
                                        <div className="row g-2 g-lg-3 pt-3 user_row">
                                            <div className="col-sm-8 text-center text-sm-start">
                                                <ul className="list-unstyled d-inline-block card-option mb-0 text-center text-sm-start">
                                                    <li className="list-inline-item me-4">
                                                        <div className="form-group">
                                                        <label className="d-inline-block fs-xs align-text-bottom" for="from_year">
                                                            <small className="pe-2 fs-xs fw-bold">Show</small>
                                                            <select name="from_year" value={pageSize} onChange={(e) => handlePageSizeChange(parseInt(e.target.value))} className="form-select form-select-sm d-inline-block select_enteries border-0" aria-label=".form-select-sm example" style={{width: "auto"}} id="from_year">
                                                                <option value="5">5</option>
                                                                <option value="10">10</option>
                                                                <option value="20">20</option>
                                                                <option value="30">30</option>
                                                            </select> 
                                                            <small className="ps-2 fs-xs fw-bold">Enteries</small>
                                                        </label>
                                                        </div>
                                                    </li>
                                                    <li className="list-inline-item align-bottom"> 
                                                        <div className="input-group group_search bg-white">
                                                        <span className="input-group-prepend">
                                                            <div className="input-group-text p-0 bg-transparent border-right-0">
                                                            <img className="img-fluid p-2" src={img1} alt="custom-magnifier"/>
                                                            </div>
                                                        </span>
                                                        <input className="form-control border-left-0 text-muted user_search fs-xs ps-0 bg-transparent" type="search" placeholder="Search..." id="example-search-input" value={search} onChange={handleSearchChange}/>
                                                        <span className="input-group-append"></span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="col-sm-4 text-center text-sm-end">
                                                {/* {hasPermission(["units.create"]) && (
                                                    <button type="button" className="btn btn-sm fw-normal btn-primary float-sm-end my-common-radius fs-xs" data-bs-toggle="modal" data-bs-target="#addCheckParameterModal" onClick={resetForm}>
                                                        <i className="ri-add-line fs-18 lh-1"></i>Add New Check Parameter
                                                    </button>
                                                )} */}

                                                {hasPermission(["check_parameters.create"]) && (
                                                    <div className="mt-3 mt-md-0">
                                                        <button type="button" className="btn btn-sm fw-normal btn-primary float-sm-end my-common-radius fs-xs" data-bs-toggle="modal" data-bs-target="#addCheckParameterModal" onClick={resetForm}>
                                                            <i className="ri-add-line fs-18 lh-1"></i>Add New Check Parameter
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="table table-responsive mb-0">
                                    <table className="table table-bordered text-nowrap">
                                        <thead className="bg-light">
                                            <tr>
                                            <th className="text-center">#ID</th>
                                                <th className="w-24" onClick={() => handleSortChange("parameter_code")}>Parameter Code
                                                    {sortBy.field === "parameter_code" && (
                                                        <span style={{ display: "inline-flex" }}>
                                                            {sortBy.order === "asc" ? (
                                                                <i className="ri-arrow-up-fill"></i>
                                                            ) : (
                                                                <i className="ri-arrow-down-fill"></i>
                                                            )}
                                                        </span>
                                                    )}
                                                </th>
                                                <th className="w-24" onClick={() => handleSortChange("parameter_name")}>Parameter Name
                                                    {sortBy.field === "parameter_name" && (
                                                        <span style={{ display: "inline-flex" }}>
                                                            {sortBy.order === "asc" ? (
                                                                <i className="ri-arrow-up-fill"></i>
                                                            ) : (
                                                                <i className="ri-arrow-down-fill"></i>
                                                            )}
                                                        </span>
                                                    )}
                                                </th>
                                                <th className="w-24" onClick={() => handleSortChange("device_type_id")}>Device Type
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
                                                <th className="w-24" onClick={() => handleSortChange("check_group_id")}>Check Group
                                                    {sortBy.field === "check_group_id" && (
                                                        <span style={{ display: "inline-flex" }}>
                                                            {sortBy.order === "asc" ? (
                                                                <i className="ri-arrow-up-fill"></i>
                                                            ) : (
                                                                <i className="ri-arrow-down-fill"></i>
                                                            )}
                                                        </span>
                                                    )}
                                                </th>
                                                <th className="w-24" onClick={() => handleSortChange("unit_id")}>Unit
                                                    {sortBy.field === "unit_id" && (
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
                                                {(hasPermission(["check_parameters.update"]) || hasPermission(["check_parameters.delete"])) && (
                                                    <th className="text-center">Action</th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white p-3">
                                        {Array.isArray(checkParameters) && checkParameters.length > 0 ? checkParameters.map((checkParameter, index) => (
                                                <tr key={checkParameter.check_parameter_id} style={{ opacity: checkParameter.status ? 1 : 0.5 }}>
                                                    <td className="text-center">{startIndex + index}</td>
                                                    <td>{checkParameter.parameter_code}</td>
                                                    <td>{checkParameter.parameter_name}</td>
                                                    <td>{deviceTypes.find(device => device.device_type_id === checkParameter.device_type_id)?.device_type || ''}</td>
                                                    <td>{checkGroups.find(group => group.check_group_id === checkParameter.check_group_id)?.check_group || ''}</td>
                                                    <td>{units.find(unit => unit.unit_id === checkParameter.unit_id)?.unit || ''}</td>
                                                    <td>{checkParameter.status ? 'Active' : 'Inactive'}</td>
                                                    <td className="text-center">
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            {checkParameter.status && hasPermission(["check_parameters.update"]) && (
                                                                <a href="#" className="text-success me-2" onClick={() => handleEditCheckParameter(checkParameter)} data-bs-toggle="modal" data-bs-target="#addCheckParameterModal">
                                                                    <i className="ri-pencil-line fs-18 lh-1"></i>
                                                                </a>
                                                            )}
                                                            {hasPermission(["check_parameters.delete"]) && (
                                                                <div className="form-check form-switch me-2">
                                                                    <input className="form-check-input" type="checkbox" role="switch" id={`flexSwitchCheckChecked-${checkParameter.check_parameter_id}`} checked={checkParameter.status} onChange={() => handleToggleStatus(checkParameter)} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="10" className="text-center">No check parameters found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="table-footer">
                                    <div className="d-flex justify-content-between align-items-center px-2 py-2">
                                    <span>Showing {startIndex} to {endIndex} of {totalItems} check parameters</span>
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



                {/* <div className="row g-3">
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
                                                <th className="w-24" onClick={() => handleSortChange("parameter_code")}>Parameter Code
                                                    {sortBy.field === "parameter_code" && (
                                                        <span style={{ display: "inline-flex" }}>
                                                            {sortBy.order === "asc" ? (
                                                                <i className="ri-arrow-up-fill"></i>
                                                            ) : (
                                                                <i className="ri-arrow-down-fill"></i>
                                                            )}
                                                        </span>
                                                    )}
                                                </th>
                                                <th className="w-24" onClick={() => handleSortChange("parameter_name")}>Parameter Name
                                                    {sortBy.field === "parameter_name" && (
                                                        <span style={{ display: "inline-flex" }}>
                                                            {sortBy.order === "asc" ? (
                                                                <i className="ri-arrow-up-fill"></i>
                                                            ) : (
                                                                <i className="ri-arrow-down-fill"></i>
                                                            )}
                                                        </span>
                                                    )}
                                                </th>
                                                <th className="w-24" onClick={() => handleSortChange("device_type_id")}>Device Type
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
                                                <th className="w-24" onClick={() => handleSortChange("check_group_id")}>Check Group
                                                    {sortBy.field === "check_group_id" && (
                                                        <span style={{ display: "inline-flex" }}>
                                                            {sortBy.order === "asc" ? (
                                                                <i className="ri-arrow-up-fill"></i>
                                                            ) : (
                                                                <i className="ri-arrow-down-fill"></i>
                                                            )}
                                                        </span>
                                                    )}
                                                </th>
                                                <th className="w-24" onClick={() => handleSortChange("unit_id")}>Unit
                                                    {sortBy.field === "unit_id" && (
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
                                                {(hasPermission(["check_parameters.update"]) || hasPermission(["check_parameters.delete"])) && (
                                                    <th className="text-center">Action</th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(checkParameters) && checkParameters.length > 0 ? checkParameters.map((checkParameter, index) => (
                                                <tr key={checkParameter.check_parameter_id} style={{ opacity: checkParameter.status ? 1 : 0.5 }}>
                                                    <td className="text-center">{startIndex + index}</td>
                                                    <td>{checkParameter.parameter_code}</td>
                                                    <td>{checkParameter.parameter_name}</td>
                                                    <td>{deviceTypes.find(device => device.device_type_id === checkParameter.device_type_id)?.device_type || ''}</td>
                                                    <td>{checkGroups.find(group => group.check_group_id === checkParameter.check_group_id)?.check_group || ''}</td>
                                                    <td>{units.find(unit => unit.unit_id === checkParameter.unit_id)?.unit || ''}</td>
                                                    <td>{checkParameter.status ? 'Active' : 'Inactive'}</td>
                                                    <td className="text-center">
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            {checkParameter.status && hasPermission(["check_parameters.update"]) && (
                                                                <a href="#" className="text-success me-2" onClick={() => handleEditCheckParameter(checkParameter)} data-bs-toggle="modal" data-bs-target="#addCheckParameterModal">
                                                                    <i className="ri-pencil-line fs-18 lh-1"></i>
                                                                </a>
                                                            )}
                                                            {hasPermission(["check_parameters.delete"]) && (
                                                                <div className="form-check form-switch me-2">
                                                                    <input className="form-check-input" type="checkbox" role="switch" id={`flexSwitchCheckChecked-${checkParameter.check_parameter_id}`} checked={checkParameter.status} onChange={() => handleToggleStatus(checkParameter)} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="10" className="text-center">No check parameters found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="card-footer p-2">
                                <div className="d-flex justify-content-between align-items-center px-2">
                                    <span>Showing {startIndex} to {endIndex} of {totalItems} check parameters</span>
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
                </div> */}
            </div>

            {/* ADD/EDIT MODAL */}
            <div className="modal fade" id="addCheckParameterModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title" id="exampleModalLabel">{editingCheckParameter ? "Edit Check Parameter" : "Add New Check Parameter"}</h5>
                            <button type="button" className="btn-close modal_close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={editingCheckParameter ? handleUpdateCheckParameter : handleAddCheckParameter}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Parameter Code <span className="text-danger">*</span></label>
                                        <input type="text" className={`form-control ${errors.parameter_code ? "is-invalid" : ""}`} name="parameter_code" value={newCheckParameter.parameter_code} onChange={handleInputChange} placeholder="Enter Parameter Code" />
                                        {errors.parameter_code && <div className="invalid-feedback">{errors.parameter_code}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Parameter Name <span className="text-danger">*</span></label>
                                        <input type="text" className={`form-control ${errors.parameter_name ? "is-invalid" : ""}`} name="parameter_name" value={newCheckParameter.parameter_name} onChange={handleInputChange} placeholder="Enter Parameter Name" />
                                        {errors.parameter_name && <div className="invalid-feedback">{errors.parameter_name}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Device Type <span className="text-danger">*</span></label>
                                        <select className={`form-control ${errors.device_type_id ? "is-invalid" : ""}`} name="device_type_id" value={newCheckParameter.device_type_id} onChange={handleInputChange}>
                                            <option value="">Select Device Type</option>
                                            {deviceTypes.map(device => (
                                                <option key={device.device_type_id} value={device.device_type_id}>{device.device_type}</option>
                                            ))}
                                        </select>
                                        {errors.device_type_id && <div className="invalid-feedback">{errors.device_type_id}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Check Group <span className="text-danger">*</span></label>
                                        <select className={`form-control ${errors.check_group_id ? "is-invalid" : ""}`} name="check_group_id" value={newCheckParameter.check_group_id} onChange={handleInputChange}>
                                            <option value="">Select Check Group</option>
                                            {checkGroups.map(group => (
                                                <option key={group.check_group_id} value={group.check_group_id}>{group.check_group}</option>
                                            ))}
                                        </select>
                                        {errors.check_group_id && <div className="invalid-feedback">{errors.check_group_id}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Unit <span className="text-danger">*</span></label>
                                        <select className={`form-control ${errors.unit_id ? "is-invalid" : ""}`} name="unit_id" value={newCheckParameter.unit_id} onChange={handleInputChange}>
                                            <option value="">Select Unit</option>
                                            {units.map(unit => (
                                                <option key={unit.unit_id} value={unit.unit_id}>{unit.unit}</option>
                                            ))}
                                        </select>
                                        {errors.unit_id && <div className="invalid-feedback">{errors.unit_id}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Icon</label>
                                        <input type="text" className={`form-control ${errors.icon ? "is-invalid" : ""}`} name="icon" value={newCheckParameter.icon} onChange={handleInputChange} placeholder="Enter Icon URL" />
                                        {errors.icon && <div className="invalid-feedback">{errors.icon}</div>}
                                    </div>
                                </div>
                                <div className="modal-footer d-block border-top-0">
                                    <div className="d-flex gap-2 mb-1 mt-2">
                                        <button type="button" className="btn btn-white flex-fill" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" className="btn btn-primary flex-fill">{editingCheckParameter ? "Update" : "Save"}</button>
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

export default CheckParameter;
