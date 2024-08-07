import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../Components/Sidebar/Sidebar';

function User() {
    const [users, setUsers] = useState([]);

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState({
        field: "name",
        order: "asc",
    });
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);





    useEffect(() => {
        fetchUsers();
    }, [currentPage, itemsPerPage, searchQuery, sortField, sortOrder]);

    const fetchUsers = async () => {
        setLoading(true);
        const queryString = `?page=${page}&limit=${pageSize}&sortBy=${sortBy.field}&order=${sortBy.order}&search=${search}&status=${statusFilter}`;
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api//users/paginateUsers/${queryString}`, {
                page: currentPage,
                itemsPerPage: itemsPerPage,
                search: searchQuery,
                sortField: sortField,
                sortOrder: sortOrder
            });
            setUsers(response.data.data);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching data: ', error);
            toast.error('Failed to fetch users: ' + (error.response?.data.message || 'Server Error'));
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleItemsPerPageChange = (e) => {
        const newItemsPerPage = Number(e.target.value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleSort = (field) => {
        setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc");
        setSortField(field);
    };


    return (
        <div>
            <Sidebar />
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <div className="main main-app p-3 p-lg-4">
                <div className="d-md-flex align-items-center justify-content-between mb-3">
                    <div>
                        <ol className="breadcrumb fs-sm mb-1">
                            <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Users</li>
                        </ol>
                        <h4 className="main-title mb-0">All Users</h4>
                    </div>
                    <div className="mt-3 mt-md-0">
                        <button type="button" className="btn btn-primary d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#addUserModal"><i className="ri-add-line fs-18 lh-1"></i>Add New User</button>
                    </div>
                </div>
                <div className="row g-3">
                    <div className="col-xl-12">
                        <div className="card card-one">
                            <div className="card-body pb-3">
                                <div className="d-flex align-items-center mb-2">
                                    <span className="me-1">Show</span>
                                    <select className="form-select me-2 w-75" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="30">30</option>
                                    </select>
                                    <div className="form-search me-auto border py-0 shadow-none">
                                        <input type="text" className="form-control" placeholder="Search" value={searchQuery} onChange={handleSearchChange} />
                                        <i className="ri-search-line"></i>
                                    </div>
                                </div>
                                {loading ? (
                                    <div className="text-center">Loading...</div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-bordered text-nowrap">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th className="text-center"><input className="form-check-input" type="checkbox" /></th>
                                                    <th className="text-center">#ID</th>
                                                    <th onClick={() => handleSort("name")}>Name {sortField === "name" && (sortOrder === "asc" ? <i className="ri-arrow-up-fill"></i> : <i className="ri-arrow-down-fill"></i>)}</th>
                                                    <th onClick={() => handleSort("mobile_no")}>Mobile No {sortField === "mobile_no" && (sortOrder === "asc" ? <i className="ri-arrow-up-fill"></i> : <i className="ri-arrow-down-fill"></i>)}</th>
                                                    <th>Email</th>
                                                    <th>Device ID</th>
                                                    <th className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map(user => (
                                                    <tr key={user.user_id}>
                                                        <td className="text-center"><input className="form-check-input" type="checkbox" /></td>
                                                        <td className="text-center">{user.user_id}</td>
                                                        <td>{user.name}</td>
                                                        <td>{user.mobile_no}</td>
                                                        <td>{user.email}</td>
                                                        <td>{user.device_id}</td>
                                                        <td className="text-center">
                                                            <a href="#" className="text-secondary me-2"><i className="ri-eye-line fs-18 lh-1"></i></a>
                                                            <a href="#" className="text-success me-2"><i className="ri-pencil-line fs-18 lh-1"></i></a>
                                                            <a href="#" className="text-danger" data-bs-toggle="modal" data-bs-target="#deleteUserModal"><i className="ri-delete-bin-line fs-18 lh-1"></i></a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                            <div className="card-footer p-2">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span>Showing {users.length} of {totalPages * itemsPerPage} users</span>
                                    <nav aria-label="Page navigation example">
                                        <ul className="pagination mb-0">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                                            </li>
                                            {[...Array(totalPages).keys()].map(page => (
                                                <li key={page + 1} className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}>
                                                    <button className="page-link" onClick={() => handlePageChange(page + 1)}>{page + 1}</button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ADD MODAL*/}
            <div className="modal fade" id="addUserModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title" id="exampleModalLabel">Add New User</h5>
                            <button type="button" className="btn-close modal_close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Name <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" placeholder="Enter your name" />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Email <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" placeholder="Enter your email" />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Mobile No. <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" placeholder="Enter your mobile no." />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Role <span className="text-danger">*</span></label>
                                    <select className="form-control">
                                        <option value="">Select Role</option>
                                        <option>Admin</option>
                                        <option>User</option>
                                    </select>
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label">Permanent Address <span className="text-danger">*</span></label>
                                    <textarea rows="2" type="text" className="form-control" placeholder="Enter your address" ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer d-block border-top-0 ">
                            <div className="d-flex gap-2 mb-4">
                                <a href="" className="btn btn-white flex-fill" data-bs-dismiss="modal">Close</a>
                                <a href="" className="btn btn-primary flex-fill">Save</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* DELETE MODAL*/}
            <div className="modal fade" id="deleteUserModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header bg-danger text-white">
                            <h5 className="modal-title" id="exampleModalLabel">Delete User</h5>
                            <button type="button" className="btn-close modal_close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-center">
                            <div className="mb-1 text-danger ti--3"><i className="ri-delete-bin-line fs-40 lh-1"></i></div>
                            <h5 className="fw-semibold text-dark mb-1">Delete User</h5>
                            <p className="fs-md text-secondary">Are you sure you want to delete this user?</p>
                        </div>
                        <div className="modal-footer d-block border-top-0 pt-0">
                            <div className="d-flex gap-2 mb-4">
                                <a href="" className="btn btn-white flex-fill" data-bs-dismiss="modal">Close</a>
                                <a href="" className="btn btn-danger flex-fill">Delete</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default User;
