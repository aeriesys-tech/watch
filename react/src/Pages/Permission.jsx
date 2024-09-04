import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import axiosWrapper from "../utils/AxiosWrapper";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../Components/LoaderAndSpinner/Loader";
import "react-toastify/dist/ReactToastify.css";
import { hasPermission } from "../Services/authUtils";

function Permission() {
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [roleId, setRoleId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [localToggledPermissions, setLocalToggledPermissions] = useState({});

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
      console.error("Error fetching roles:", error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const data = await axiosWrapper(
        `/roleAbilities/getAbilities?role_id=${roleId}`,
        {},
        navigate
      );
      setPermissions(data.data.data);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  const handleChangeStatus = (abilityId, currentStatus) => {
    setLocalToggledPermissions((prevState) => ({
      ...prevState,
      [abilityId]: !currentStatus,
    }));

    setPermissions((prevPermissions) =>
      prevPermissions.map((permission) => ({
        ...permission,
        abilities: permission.abilities.map((ability) =>
          ability._id === abilityId
            ? { ...ability, status: !currentStatus }
            : ability
        ),
      }))
    );
  };

  const handleAddPermissions = async () => {
    if (!roleId) {
      toast.error("Please select a role before adding permissions");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosWrapper(
        `/roleAbilities/importAbilities`,
        {
          data: JSON.stringify({
            roleId: roleId,
          }),
        },
        navigate
      );
      toast.success("Permissions added successfully");
      fetchPermissions(); // Refresh the permissions after adding
    } catch (error) {
      console.error("Error adding permissions:", error);
      toast.error("Error adding permissions");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitChanges = async () => {
    if (Object.keys(localToggledPermissions).length === 0) {
      toast.info("No changes to submit.");
      return;
    }

    setLoading(true);
    try {
      const changesArray = Object.entries(localToggledPermissions).map(
        ([abilityId, status]) => ({
          roleId: roleId,
          abilityId: abilityId,
          status: status,
        })
      );

      const response = await axiosWrapper(
        `/rolePermissions/togglePermissionForRole`,
        {
          method: "POST",
          data: changesArray,
        },
        navigate
      );

      toast.success(response.message || "Permissions updated successfully");
      setLocalToggledPermissions({});
      fetchPermissions(); // Refresh the permissions after successful update
    } catch (error) {
      console.error("Error submitting changes:", error);
      toast.error("Error submitting changes");
    } finally {
      setLoading(false);
    }
  };

  const groupRoles = () => {
    const groupedRoles = roles.reduce((acc, role) => {
      const group = role.group || "Other"; // Default group name if no group is defined
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(role);
      return acc;
    }, {});
    return groupedRoles;
  };

  const groupedRoles = groupRoles();

  return (
    <div>
      <Sidebar />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="main main-app p-3 p-lg-4">
        {loading && <Loader />}
        <div className="d-md-flex align-items-center justify-content-between mb-3">
          <div>
            <ol className="breadcrumb fs-sm mb-1">
              <li className="breadcrumb-item">
                <a href="#">Configuration</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Permissions
              </li>
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
                {Object.keys(groupedRoles).map((groupLabel) => (
                  <optgroup key={groupLabel} label={groupLabel}>
                    {groupedRoles[groupLabel].map((role) => (
                      <option key={role.role_id} value={role.role_id}>
                        {role.role}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            {hasPermission(["role_abilities.change"]) && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmitChanges}
              >
                Submit Changes
              </button>
            )}
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
                        <th colSpan="4" className="bold text-primary">
                          {permission.module_name}
                        </th>
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
                                style={{ borderRadius: "100px" }}
                                type="checkbox"
                                checked={ability.status}
                                onChange={() =>
                                  handleChangeStatus(
                                    ability._id,
                                    ability.status
                                  )
                                }
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
