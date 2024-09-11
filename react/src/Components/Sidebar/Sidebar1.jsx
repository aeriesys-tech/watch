import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import img1  from "../../Assets/img/Bespoke_logo_svg 1.png";
import img2  from "../../Assets/img/icon/Icon_dashboard.svg";
import img3  from "../../Assets/img/icon/Icon_configure.svg";
import img4  from "../../Assets/img/icon/group_black.svg";
import img5  from "../../Assets/img/icon/icon_report.svg";


import img6  from "../../Assets/img/Titan 1.svg";
import img7  from "../../Assets/img/icon/Group 3.svg";
import img8  from "../../Assets/img/icon/account_circle.svg";
import img9  from "../../Assets/img/icon/lock_reset.svg";
import img10  from "../../Assets/img/icon/move_item.svg";
import Bespoke_logo_tal_svg from "../../Assets/assets/img/TalwsLogo.svg"
import { clearUser } from "../../redux/user/UserSlice";
import authWrapper from "../../utils/AuthWrapper";
import { hasPermission } from "../../Services/authUtils";


export default function Sidebar1() {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [roleGroup, setRoleGroup] = useState("");
    // const [email, setEmail] = useState("");
    // const [username, setUsername] = useState("");
    // const [mobileNo, setMobileNo] = useState("");
    // const [address, setAddress] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [isSidebarHidden, setIsSidebarHidden] = useState(false);
    const [isDropdownOpen1, setIsDropdownOpen1] = useState(false); // State for Configure dropdown
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for User Management dropdown
    const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);

    // Toggle function to change the sidebar visibility state
  const toggleSidebar = () => {
    setIsSidebarHidden((prevState) => !prevState);
  };

  // Function to toggle "Configure" section dropdown
  const handleToggleDropdown1 = (event) => {
    event.preventDefault();
    setIsDropdownOpen1((prevState) => !prevState);
  };

  // Function to toggle "User Management" section dropdown
  const handleToggleDropdown = (event) => {
    event.preventDefault();
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleToggleDropdownHeader = (event) => {
    event.preventDefault();
    setIsDropdownOpen2((prevState) => !prevState);
  };

  useEffect(() => {
    const bodyElement = document.body;
    const navElement = document.getElementById('nav-bar');

    if (isSidebarHidden) {
      bodyElement.classList.add("body-pd");
      navElement.classList.add("show_sidebar");
    } else {
    //   bodyElement.classList.remove("body-pd");
    //   navElement.classList.remove("show_sidebar");
    bodyElement.classList.add("body-pd");
      navElement.classList.add("show_sidebar");
    }
  }, [isSidebarHidden]);


useEffect(() => {
    const navElement = document.getElementById('dropdown-menu');

    if (isDropdownOpen2) {
      navElement.classList.add("show");
    } else {
      navElement.classList.remove("show");
    }
  }, [isDropdownOpen2]);

  const handleLogout = async (event) => {
    event.preventDefault();

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Unable to logout.");
        return;
      }

      const response = await authWrapper(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        sessionStorage.removeItem("auth");
        sessionStorage.removeItem("token");
        dispatch(clearUser());
        toast.success("User Logged Out successful!");
        navigate("/auth/login");
        
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred during logout.");
    }
  };

  // Fetch user data from Redux store
  const fetchUserData = () => {
    if (user) {
      setName(user.name);
      // setEmail(user.email);
      // setUsername(user.username);
      // setMobileNo(user.mobile_no);
      // setAddress(user.address);
      setAvatar(user.avatar);
      setRole(user.role);
      setRoleGroup(user.role_group)
    } else {
      console.log("User data not found in Redux store");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  return (
    <>
    <div className="l-navbar" id="nav-bar">
        <nav className="nav" >
            {/* <div className="text-center"> 
                <a href="#" className="nav_logo justify-content-center" style={{display:'table-cell !important'}}> 
                    <img src={Bespoke_logo_tal_svg} className="img-fluid header_img_logo" alt="..." style={{width: '200px', height: '60px'}}/> 
                </a>
                <div className="nav_list"> 
                    <a href="#" className="nav_link active-li" > 
                        <img className="img-fluid dashboard" src={img2} width="24" id="dashboard"   alt="custom-magnifier"/>
                        <span className="nav_name">Dashboard</span> 
                    </a> 
                    <a href="#" className="nav_link active-li"> 
                        <img className="img-fluid configure" src={img3} width="24"  alt="custom-magnifier"/>
                        <span className="nav_name">Configure</span> 
                    </a> 
                    <a href="#" className="nav_link active-li"> 
                        <img className="img-fluid users" src={img4} width="24"  alt="custom-magnifier"/>
                        <span className="nav_name">Users</span> 
                    </a> 
                    <a href="#" className="nav_link active-li"> 
                        <img className="img-fluid reports" src={img5} width="24"  alt="custom-magnifier"/> 
                        <span className="nav_name">Reports</span> 
                    </a> 
                </div>
            </div> */}

            <div className="sidebar">
            <div className="sidebar-header text-center">
                <a href="#" className="nav_logo justify-content-center" style={{display:'table-cell !important'}}> 
                    <img src={Bespoke_logo_tal_svg} className="img-fluid header_img_logo" alt="..." style={{width: '200px', height: '60px'}}/> 
                </a>
            </div>

            <div className="nav_list"> 
                <div className="nav-group">
                    <Link to="/dashboard1" className="nav-label no_icon">
                    <img className="img-fluid dashboard" src={img2} width="24" id="dashboard"   alt="custom-magnifier"/> 
                    <span className="nav_name">Dashboard</span>
                    </Link>
                </div>
                {(hasPermission(["role_abilities.view"]) ||
                    hasPermission(["check_parameters.view"]) ||
                    hasPermission(["check_groups.view"]) ||
                    hasPermission(["units.view"]) ||
                    hasPermission(["device_types.view"])) && roleGroup == 'Admin' && (
                    <div className="nav-group">
                    <a href="#" className="nav-label no_icon" onClick={handleToggleDropdown1}>
                    <img className="img-fluid configure" src={img3} width="24"  alt="custom-magnifier"/>
                        <span className="nav_name">Configure</span>
                    </a>
                    <ul
                        className="nav nav-sidebar"
                        style={{ display: isDropdownOpen1 ? "block" : "none" }}
                    >
                        {hasPermission(["device_types.view"]) && (
                        <li className="nav-item">
                            <Link to="/deviceTypes" className="nav-link">
                            <i className="ri-pie-chart-2-line"></i>{" "}
                            <span className="nav_name">Device Types</span>
                            </Link>
                        </li>
                        )}

                        {hasPermission(["units.view"]) && (
                        <li className="nav-item">
                            <Link to="/units" className="nav-link">
                            <i className="ri-pie-chart-2-line"></i> <span className="nav_name">Units</span>
                            </Link>
                        </li>
                        )}

                        {hasPermission(["check_groups.view"]) && (
                        <li className="nav-item">
                            <Link to="/checkGroups" className="nav-link">
                            <i className="ri-pie-chart-2-line"></i>{" "}
                            <span className="nav_name">Check Groups</span>
                            </Link>
                        </li>
                        )}

                        {hasPermission(["check_parameters.view"]) && (
                        <li className="nav-item">
                            <Link to="/checkParameters" className="nav-link">
                            <i className="ri-pie-chart-2-line"></i>{" "}
                            <span className="nav_name">Check Parameters</span>
                            </Link>
                        </li>
                        )}

                        {hasPermission(["role_abilities.view"]) && (
                        <li className="nav-item">
                            <Link to="/permissions" className="nav-link">
                            <i className="ri-pie-chart-2-line"></i>{" "}
                            <span className="nav_name">Permissions</span>
                            </Link>
                        </li>
                        )}
                    </ul>
                    </div>
                )}

                {hasPermission(["clients.view"]) && roleGroup == 'Admin'  && (
                    <div className="nav-group">
                    <Link to="/clients" className="nav-label no_icon">
                        <img className="img-fluid users" src={img4} width="24"  alt="custom-magnifier"/>
                        <span className="nav_name">Clients</span>
                    </Link>
                    </div>
                )}

                {(hasPermission(["roles.view"]) || hasPermission(["users.view"]))  && roleGroup == 'Admin'  && (
                    <div className="nav-group">
                    <a href="#" className="nav-label no_icon" onClick={handleToggleDropdown}>
                    <img className="img-fluid users" src={img4} width="24"  alt="custom-magnifier"/>
                        <span className="nav_name">User Management</span>
                    </a>
                    <ul
                        className="nav nav-sidebar"
                        style={{ display: isDropdownOpen ? "block" : "none" }}
                    >
                        {hasPermission(["roles.view"]) && (
                        <li className="nav-item">
                            <Link to="/roles" className="nav-link">
                            <i className="ri-pie-chart-2-line"></i>
                            <span className="nav_name">Roles</span>
                            </Link>
                        </li>
                        )}

                        {hasPermission(["users.view"]) && (
                        <li className="nav-item">
                            <Link to="/users" className="nav-link">
                            <i className="ri-pie-chart-2-line"></i>
                            <span className="nav_name">Users</span>
                            </Link>
                        </li>
                        )}
                    </ul>
                    </div>
                )}
                {roleGroup == 'Client'  && (
                    <div className="nav-group">
                    <Link to="/subscribers" className="nav-label no_icon">
                    <img className="img-fluid users" src={img4} width="24"  alt="custom-magnifier"/>
                     <span className="nav_name">Subscribers</span>
                    </Link>
                    </div>
                )}
                </div>
            </div>
        </nav>
    </div>

    <div className="container-fluid d-grid gap-3 bg-light my-3">
            <div className="row gy-5">
                <div className="col">
                    <div className="header p-1 bg-white rounded" id="header">
                        <div className="header_toggle col-1 d-flex" onClick={toggleSidebar}> 
                            <i className="bx bx-menu" id="header-toggle"></i> 
                            {/* <img src={img6} className="img-fluid header_img_logo" alt="..."/> */}
                        </div>
                        {/* <div className="">
                            <img src={img6} className="img-fluid header_img_logo" alt="..."/>
                        </div> */}
                        <div className="display-inline-flex text-end">
                            <img src={img7} className="img-fluid" alt="..."/>
                            <a className="nav-link dropdown-toggle border border rounded-pill nav_link_drop
                           border-secondary p-2 ms-2" onClick={handleToggleDropdownHeader} href="#" id="navbarDropdown" style={{padding: '6px !important'}} role="button" data-bs-toggle="dropdown" aria-expanded="false" data-md-offset="10,20">
                                <div className="profile-pic me-1">
                                    {/* <img src="https://i.imgur.com/hczKIze.jpg" alt="Profile Picture"/> */}
                                    <img
                                        src={`${process.env.REACT_APP_BASE_API_URL}/uploads/avatars/${avatar}`}
                                        alt="User Avatar"
                                    />
                                </div>
                                <span id="fixed-sidebar" className="me-4 align-middle">{name}</span>
                            </a>
                            <ul className="dropdown-menu" id="dropdown-menu" aria-labelledby="dropdownMenuOffset" >
                                <li>
                                    {/* <a className="dropdown-item" href="#"> */}
                                    <Link to="/profile" className="dropdown-item" > 
                                        <span className="input-group-addon">
                                            <img className="img-fluid px-2" src={img8} alt="custom-magnifier"/>
                                            <span className="hidden-xs text-upper-style"> My Profile</span>
                                        </span>
                                    </Link>
                                    {/* </a> */}
                                </li>
                                {/* <li>
                                    <a className="dropdown-item" href="#"> 
                                        <span className="input-group-addon">
                                            <img className="img-fluid px-2" src={img9} alt="custom-magnifier"/>
                                            <span className="hidden-xs text-upper-style"> Change Password</span>
                                        </span>
                                    </a>
                                </li> */}
                                <li><hr className="dropdown-divider"/></li>
                                <li>
                                    <a className="dropdown-item" href="#" onClick={handleLogout}> 
                                        <span className="input-group-addon">
                                            <img className="img-fluid px-2" src={img10} alt="custom-magnifier"/>
                                            <span className="hidden-xs text-upper-style"> Logout</span>
                                        </span>
                                    </a>
                                </li>
                            </ul> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}
