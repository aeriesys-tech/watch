import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar/Sidebar';
import axiosWrapper from '../utils/AxiosWrapper';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Loader from '../Components/LoaderAndSpinner/Loader';
import 'react-toastify/dist/ReactToastify.css';

function Permission() {
    const [permissions, setPermissions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [roleId, setRoleId] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRoles();
        if (roleId) {
            fetchPermissions();
        }
    }, [roleId]);

    const fetchRoles = async () => {
        try {
            const data = await axiosWrapper(`/roles/getRoles`, {}, navigate);
            setRoles(data.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const fetchPermissions = async () => {
        try {
            const data = await axiosWrapper(`/roleAbilities/getAbilities?role_id=${roleId}`, {}, navigate);
            setPermissions(data.data.data);
        } catch (error) {
            console.error('Error fetching permissions:', error);
        }
    };

    const handleChangeStatus = async (abilityId) => {
        setLoading(true);
        try {
            const response = await axiosWrapper(`/rolePermissions/togglePermissionForRole`, {
                data: JSON.stringify({
                    roleId: roleId,
                    abilityId: abilityId
                })
            }, navigate);
            toast.success(response.message);
            fetchPermissions();
        } catch (error) {
            console.error(error);
            toast.error('Error toggling permission');
        } finally {
            setLoading(false);
        }
    };

    // Function to handle "Add Permissions" button click
    const handleAddPermissions = async () => {
        if (!roleId) {
            toast.error('Please select a role before adding permissions');
            return;
        }

        setLoading(true);
        try {
            const response = await axiosWrapper(`/roleAbilities/importAbilities`, {
                data: JSON.stringify({
                    roleId: roleId
                })
            }, navigate);
            toast.success('Permissions added successfully');
            fetchPermissions();  // Refresh the permissions after adding
        } catch (error) {
            console.error('Error adding permissions:', error);
            toast.error('Error adding permissions');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Sidebar />
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
            <div className="main main-app p-3 p-lg-4">
                {loading && <Loader />}
                <div className="d-md-flex align-items-center justify-content-between mb-3">
                    <div>
                        <ol className="breadcrumb fs-sm mb-1">
                            <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Permissions</li>
                        </ol>
                        <h4 className="main-title mb-0">Permissions</h4>
                    </div>
                    <div className="d-flex gap-2 mt-3 mt-md-0">
                        <div>
                            <select
                                className="form-control"
                                value={roleId}
                                onChange={(e) => setRoleId(e.target.value)}
                            >
                                <option value="">Select Role</option>
                                {roles.map((role) => (
                                    <option key={role.role_id} value={role.role_id}>
                                        {role.role}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleAddPermissions} // Trigger the API call on click
                        >
                            Add Permissions
                        </button>
                    </div>
                </div>
                <div className="row g-3">
                    {permissions.length > 0 ? (
                        permissions.map((permission, index) => (
                            <div className="col-sm-6" key={index}>
                                <div className="table-responsive">
                                    <table className="table text-nowrap table-bordered mb-0">
                                        <thead>
                                            <tr>
                                                <th colSpan="4" className="bold text-primary">{permission.module_name}</th>
                                            </tr>
                                            <tr className="bg-light">
                                                <th className="text-center">#</th>
                                                <th>Ability</th>
                                                <th>Description</th>
                                                <th className="text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {permission.abilities.map((ability, idx) => (
                                                <tr key={idx}>
                                                    <td className="text-center">{idx + 1}</td>
                                                    <td>{ability.ability}</td>
                                                    <td>{ability.description}</td>
                                                    <td className="text-center">
                                                        <div className="form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                style={{ borderRadius: '100px' }}
                                                                type="checkbox"
                                                                checked={ability.status}
                                                                onChange={() => handleChangeStatus(ability._id)}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>No permissions available for the selected role.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Permission;
