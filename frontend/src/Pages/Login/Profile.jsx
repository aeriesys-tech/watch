import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import authWrapper from '../../utils/AuthWrapper';

function Profile() {
    // State management for password update
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordErrors, setPasswordErrors] = useState({});

    // State management for profile update
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [address, setAddress] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null); // File object for new avatar
    const [profileErrors, setProfileErrors] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch the user data from the /auth/me API
    const fetchUserData = async () => {
        setLoading(true);
        try {
            const response = await authWrapper('/auth/me', {}, true);
            if (response.status === 200) {
                const data = response.data.data;
                setName(data.name);
                setEmail(data.email);
                setUsername(data.username);
                setMobileNo(data.mobile_no);
                setAddress(data.address);
                setAvatar(data.avatar);
            } else {
                toast.error('Failed to load user profile data');
            }
        } catch (err) {
            toast.error('An error occurred while fetching user data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleFileChange = (e) => {
        setAvatarFile(e.target.files[0]);
    };

    const handleUpdatePassword = async (event) => {
        event.preventDefault();
        setPasswordErrors({}); // Reset errors on new submission

        if (newPassword !== confirmPassword) {
            toast.error("New Password and Confirm Password do not match");
            return;
        }

        const requestBody = {
            oldPassword: currentPassword,
            newPassword,
            confirmPassword,
        };

        try {
            const response = await authWrapper('/auth/updatePassword', requestBody, true);

            if (response.status === 200) {
                toast.success("Password updated successfully");
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.error(response.data.message || 'Password update failed');
            }
        } catch (err) {
            if (err.response && err.response.data.errors) {
                setPasswordErrors(err.response.data.errors);
                toast.error(err.response.data.message || 'An error occurred');
            } else {
                toast.error('An unexpected error occurred');
            }
            console.error("Password update error:", err);
        }
    };

    const handleUpdateProfile = async (event) => {
        event.preventDefault();
        setProfileErrors({}); // Reset errors on new submission

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('username', username);
        formData.append('mobile_no', mobileNo);
        formData.append('address', address);
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        try {
            const response = await authWrapper('/auth/updateProfile', formData, true);

            if (response.status === 200) {
                toast.success("Profile updated successfully");
                setAvatarFile(null);
                fetchUserData(); // Refresh user data
            } else {
                toast.error(response.data.message || 'Profile update failed');
            }
        } catch (err) {
            if (err.response && err.response.data.errors) {
                setProfileErrors(err.response.data.errors);
                toast.error(err.response.data.message || 'An error occurred');
            } else {
                toast.error('An unexpected error occurred');
            }
            console.error("Profile update error:", err);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={4000} theme="colored" />
            <Sidebar />
            <div className="main main-app p-3 p-lg-4">
                {loading ? <div>Loading...</div> : (
                    <>
                        <div className="d-md-flex align-items-center justify-content-between mb-3">
                            <div>
                                <ol className="breadcrumb fs-sm mb-1">
                                    <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">Profile</li>
                                </ol>
                                <h4 className="main-title mb-0">Profile</h4>
                            </div>
                        </div>
                        <div className="row g-3">
                            <div className="col-md-3">
                                <div className="card card-one">
                                    <div className="card-header">
                                        <h6 className="card-title">Update Avatar</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="text-center">
                                            <img height="100" alt="user image" src={avatar ? `${process.env.REACT_APP_BASE_API_URL1}/${avatar}` : "../assets/img/user.png"} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="customFile">Choose file</label>
                                            <input
                                                type="file"
                                                className={`form-control ${profileErrors.avatar ? "is-invalid" : ""}`}
                                                id="customFile"
                                                onChange={handleFileChange}
                                            />
                                            {profileErrors.avatar && <div className="invalid-feedback">{profileErrors.avatar}</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card card-one">
                                    <div className="card-header">
                                        <h6 className="card-title">Profile Details</h6>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handleUpdateProfile} className="needs-validation" noValidate autoComplete='on'>
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Name</label><span className="text-danger"> *</span>
                                                    <input
                                                        type="text"
                                                        placeholder="Name"
                                                        className={`form-control ${profileErrors.name ? "is-invalid" : ""}`}
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                    />
                                                    {profileErrors.name && <div className="invalid-feedback">{profileErrors.name}</div>}
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Email</label><span className="text-danger"> *</span>
                                                    <input
                                                        type="email"
                                                        placeholder="Email"
                                                        className={`form-control ${profileErrors.email ? "is-invalid" : ""}`}
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        disabled
                                                    />
                                                    {profileErrors.email && <div className="invalid-feedback">{profileErrors.email}</div>}
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Username</label><span className="text-danger"> *</span>
                                                    <input
                                                        type="text"
                                                        placeholder="Username"
                                                        className={`form-control ${profileErrors.username ? "is-invalid" : ""}`}
                                                        value={username}
                                                        onChange={(e) => setUsername(e.target.value)}
                                                    />
                                                    {profileErrors.username && <div className="invalid-feedback">{profileErrors.username}</div>}
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Mobile No.</label><span className="text-danger"> *</span>
                                                    <input
                                                        type="text"
                                                        placeholder="Phone No."
                                                        className={`form-control ${profileErrors.mobile_no ? "is-invalid" : ""}`}
                                                        value={mobileNo}
                                                        onChange={(e) => setMobileNo(e.target.value)}
                                                    />
                                                    {profileErrors.mobile_no && <div className="invalid-feedback">{profileErrors.mobile_no}</div>}
                                                </div>
                                                <div className="col-md-12 mb-3">
                                                    <label className="form-label">Address</label><span className="text-danger"> *</span>
                                                    <textarea
                                                        rows="2"
                                                        placeholder="Address"
                                                        className={`form-control ${profileErrors.address ? "is-invalid" : ""}`}
                                                        value={address}
                                                        onChange={(e) => setAddress(e.target.value)}
                                                    ></textarea>
                                                    {profileErrors.address && <div className="invalid-feedback">{profileErrors.address}</div>}
                                                </div>
                                            </div>
                                            <div className="card-footer d-flex justify-content-end gap-2">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary d-flex align-items-center gap-2"
                                                >
                                                    <i className="ri-save-line fs-18 lh-1"></i>Update
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card card-one">
                                    <div className="card-header">
                                        <h6 className="card-title">Update Password</h6>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handleUpdatePassword} className="needs-validation" noValidate autoComplete='on'>
                                            <div className="row">
                                                <div className="col-md-12 mb-3">
                                                    <label className="form-label">Current Password</label><span className="text-danger"> *</span>
                                                    <input
                                                        type="password"
                                                        placeholder="Current Password"
                                                        className={`form-control ${passwordErrors.oldPassword ? "is-invalid" : ""}`}
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                    />
                                                    {passwordErrors.oldPassword && <div className="invalid-feedback">{passwordErrors.oldPassword}</div>}
                                                </div>
                                                <div className="col-md-12 mb-3">
                                                    <label className="form-label">New Password</label><span className="text-danger"> *</span>
                                                    <input
                                                        type="password"
                                                        placeholder="New Password"
                                                        className={`form-control ${passwordErrors.newPassword ? "is-invalid" : ""}`}
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                    />
                                                    {passwordErrors.newPassword && <div className="invalid-feedback">{passwordErrors.newPassword}</div>}
                                                </div>
                                                <div className="col-md-12">
                                                    <label className="form-label">Confirm Password</label><span className="text-danger"> *</span>
                                                    <input
                                                        type="password"
                                                        placeholder="Confirm Password"
                                                        className={`form-control ${passwordErrors.confirmPassword ? "is-invalid" : ""}`}
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                    />
                                                    {passwordErrors.confirmPassword && <div className="invalid-feedback">{passwordErrors.confirmPassword}</div>}
                                                </div>
                                            </div>
                                            <div className="card-footer d-flex justify-content-end gap-2">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary d-flex align-items-center gap-2"
                                                >
                                                    <i className="ri-save-line fs-18 lh-1"></i>Update
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default Profile;
