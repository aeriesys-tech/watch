import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Updated from useHistory to useNavigate
import { toast } from "react-toastify"; // Assuming you are using react-toastify for notifications
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../redux/user/UserSlice";
import Bespoke_logo_svg from "../../Assets/assets/img/Bespoke_logo_svg 1.png";
import authWrapper from "../../utils/AuthWrapper";

function Sidebar() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate(); // Updated from useHistory to useNavigate

  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false); // State to toggle "Configure" section
  const [isReportsOpen, setIsReportsOpen] = useState(false); // State to toggle "Reports" section

  // Fetch user data from Redux store
  const fetchUserData = () => {
    if (user) {
      console.log(">>>>>>>>>>>>>>>", user.name);
      setName(user.name);
      setEmail(user.email);
      setUsername(user.username);
      setMobileNo(user.mobile_no);
      setAddress(user.address);
      setAvatar(user.avatar);
      setRole(user.role);
    } else {
      toast.error("User data not found in Redux store");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const handleLogout = async (event) => {
    event.preventDefault();

    try {
      const token = sessionStorage.getItem("token"); // Retrieve the token from session storage
      console.log(token);
      if (!token) {
        toast.error("No token found. Unable to logout.");
        return;
      }

      const response = await authWrapper(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      if (response.status === 200) {
        // Clear session storage
        sessionStorage.removeItem("auth");
        sessionStorage.removeItem("token");

        // Clear Redux state
        dispatch(clearUser());
        console.log("Logout successful", response.data);

        // Redirect to login page
        navigate("/auth/login");
      } else {
        toast.error("Logout failed. Please try again.");
        console.error("Logout failed", response);
      }
    } catch (err) {
      toast.error("An unexpected error occurred during logout.");
      console.error("Logout error:", err);
    }
  };

  // Toggle function to change the sidebar visibility state
  const toggleSidebar = () => {
    setIsSidebarHidden((prevState) => !prevState);
  };

  useEffect(() => {
    const bodyElement = document.body;

    if (isSidebarHidden) {
      bodyElement.classList.add("sidebar-hide");
    } else {
      bodyElement.classList.remove("sidebar-hide");
    }
  }, [isSidebarHidden]);

  // Function to toggle "Configure" section
  const toggleConfig = () => {
    setIsConfigOpen((prevState) => !prevState);
  };

  // Function to toggle "Reports" section
  const toggleReports = () => {
    setIsReportsOpen((prevState) => !prevState);
  };

  return (
    <>
      <div class="sidebar">
        <div class="sidebar-header">
          <img src={Bespoke_logo_svg} />
        </div>

        <div id="sidebarMenu" class="sidebar-body">
          <div class="nav-group">
            <a href="/dashboard" class="nav-label no_icon">
              <i class="ri-dashboard-line"></i>
              <span>Dashboard</span>
            </a>
          </div>
          <div class="nav-group">
            <a href="#" class="nav-label">
              <i class="ri-user-settings-line"></i>
              <span>Configue</span>
            </a>
            <ul class="nav nav-sidebar">
              <li class="nav-item">
                <a href="../dashboard/finance.html" class="nav-link">
                  <i class="ri-pie-chart-2-line"></i>{" "}
                  <span>Finance Monitoring</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="../dashboard/events.html" class="nav-link">
                  <i class="ri-calendar-todo-line"></i>{" "}
                  <span>Events Management</span>
                </a>
              </li>
            </ul>
          </div>
          <div class="nav-group">
            <a href="Users.html" class="nav-label no_icon">
              <i class="ri-group-line"></i>
              <span>Users</span>
            </a>
          </div>
          <div class="nav-group">
            <a href="#" class="nav-label">
              <i class="ri-file-text-line"></i>
              <span>Reports</span>
            </a>
            <ul className="nav nav-sidebar" style={{ display: "block" }}>
              <li class="nav-item">
                <a href="../dashboard/finance.html" class="nav-link">
                  <i class="ri-pie-chart-2-line"></i>{" "}
                  <span>Finance Monitoring</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="../dashboard/events.html" class="nav-link">
                  <i class="ri-calendar-todo-line"></i>{" "}
                  <span>Events Management</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="header-main px-3 px-lg-4">
        <a
          id="menuSidebar"
          href="#"
          className="menu-link me-3 me-lg-4"
          onClick={toggleSidebar} // Attach the toggle function to the click event
        >
          <i className="ri-menu-2-fill"></i>
        </a>
        <div className="me-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="131"
            height="30"
            viewBox="0 0 141 40"
            fill="none"
          >
            <path
              d="M77.2272 15.8748H69.5273V30.7393H77.2272V15.8748Z"
              fill="#004381"
            />
            <path
              d="M66.9821 15.8757H48.6524L47.2017 18.1226V18.3065H53.9775V30.7394H61.6774V18.3065H68.4472V18.1226L66.9821 15.8757Z"
              fill="#004381"
            />
            <path
              d="M79.7727 15.8757H98.1024L99.551 18.1226V18.3065H92.7772V30.7394H85.0774V18.3065H78.3076V18.1226L79.7727 15.8757Z"
              fill="#004381"
            />
            <path
              d="M109.023 28.0307L110.486 30.7403H118.801V30.5536L110.747 15.8738H102.992L94.1641 30.5536V30.7403H99.401L100.841 28.0307H109.023ZM101.975 25.6697L105.008 19.9732L107.78 25.6697H101.975Z"
              fill="#004381"
            />
            <path
              d="M123.263 15.8757L135.305 23.7705V15.8757H139.587V30.7394H135.478L123.737 23.1209V30.7394H119.57V15.8757H123.263Z"
              fill="#004381"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.5008 11.6721C20.9394 9.49792 26.4169 8.0595 31.378 7.4834C31.697 7.73361 31.9808 8.01475 32.2791 8.28306C27.2974 9.16613 21.7459 10.7732 16.0853 13.0369C10.4081 15.3076 5.29886 17.9637 1.12793 20.7429C1.14436 20.3446 1.1608 19.9452 1.2021 19.5469C5.12187 16.5751 10.0501 13.8535 15.5008 11.6721Z"
              fill="#9C9D9F"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20.5259 23.389C26.9067 20.8362 32.977 18.2359 37.7096 16.0269C37.9359 16.7449 38.1294 17.4712 38.2653 18.2031C33.8249 20.883 27.9769 23.7229 21.7421 26.2179C15.5073 28.708 9.29318 30.6936 4.18799 31.833C3.7455 31.2232 3.34853 30.5754 2.98633 29.9149C7.92865 28.2501 14.1245 25.9477 20.5259 23.389Z"
              fill="#9C9D9F"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.5813 16.5202C23.8222 14.026 30.0363 12.0406 35.1333 10.9053C35.5758 11.5151 35.9708 12.1608 36.3328 12.8213C31.376 14.4921 25.1802 16.7944 18.7953 19.3472C12.4206 21.897 6.35252 24.4984 1.61163 26.7094C1.38323 25.9931 1.1919 25.2671 1.05811 24.5332C5.49642 21.8512 11.3486 19.0144 17.5813 16.5202Z"
              fill="#9C9D9F"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M25.5755 35.1535C29.1269 33.7331 32.483 31.9878 35.4666 30.0371C35.2403 30.4234 35.0284 30.8189 34.7711 31.1883C32.0755 33.0399 29.0959 34.6349 25.9004 35.9124C22.6966 37.1938 19.4289 38.0997 16.1778 38.63C15.7209 38.5425 15.2785 38.4085 14.8301 38.2883C18.3737 37.6308 22.024 36.5738 25.5755 35.1535Z"
              fill="#9C9D9F"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M23.2336 29.6992C28.9088 27.4316 34.0199 24.7744 38.1929 21.9873C38.1765 22.3866 38.16 22.787 38.1187 23.1863C34.1886 26.1642 29.2583 28.8877 23.82 31.065C18.3754 33.2412 12.8978 34.6815 7.9492 35.2566C7.63019 35.0072 7.34637 34.7242 7.0459 34.4559C12.0213 33.575 17.5709 31.9659 23.2336 29.6992Z"
              fill="#9C9D9F"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.4208 6.82486C16.6163 5.54755 19.888 4.64251 23.1535 4.10913C23.6042 4.19457 24.0446 4.32964 24.4889 4.44885C20.9539 5.10632 17.3034 6.16231 13.7459 7.58161C10.1923 9.00416 6.8383 10.7514 3.85449 12.7002C4.08079 12.3119 4.29698 11.9125 4.55614 11.5411C7.24349 9.6954 10.221 8.10522 13.4208 6.82486Z"
              fill="#9C9D9F"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M39.7381 8.75002C39.2525 8.09539 38.7278 7.47657 38.1682 6.89844C33.1496 7.66332 27.0937 9.34382 20.791 11.8649C14.4905 14.3829 8.97589 17.3329 4.8667 20.2155C4.89346 21.008 4.97774 21.8018 5.11154 22.5974C9.44303 19.9653 15.2849 17.0827 21.896 14.4396C28.5073 11.7973 34.7463 9.84668 39.7381 8.75002Z"
              fill="#004381"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M30.7361 35.0433C27.3183 36.4081 23.8943 37.3377 20.6001 37.8603C24.1393 38.4971 27.9006 38.1901 31.4708 36.7598C35.0451 35.3324 37.9298 32.9804 39.9669 30.1157C37.2547 31.9958 34.1519 33.6755 30.7361 35.0433Z"
              fill="#004381"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.4762 4.13905C20.894 2.77224 24.318 1.84462 27.6122 1.32202C24.0729 0.685295 20.3116 0.994298 16.7393 2.42255C13.1672 3.85182 10.2822 6.19996 8.24512 9.06358C10.9594 7.18637 14.0604 5.50587 17.4762 4.13905Z"
              fill="#004381"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M27.4212 27.3165C33.7199 24.7955 39.2343 21.8484 43.3456 18.9659C43.3188 18.1723 43.2345 17.3796 43.0986 16.584C38.7692 19.2161 32.9255 22.0986 26.3163 24.7409C19.7071 27.3841 13.4641 29.3349 8.47412 30.4316C8.9598 31.0862 9.48235 31.705 10.0441 32.2821C15.0608 31.515 21.1207 29.8374 27.4212 27.3165Z"
              fill="#004381"
            />
          </svg>
        </div>
        <div className="dropdown dropdown-notification ms-3 ms-xl-4">
          <a
            href="s"
            className="dropdown-link"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
          >
            <small>3</small>
            <i className="ri-notification-3-line"></i>
          </a>
          <div className="dropdown-menu dropdown-menu-end mt-10-f me--10-f">
            <div className="dropdown-menu-header">
              <h6 className="dropdown-menu-title">Notifications</h6>
            </div>
            <ul className="list-group">
              <li className="list-group-item">
                <div className="avatar online">
                  <img src="../assets/img/img10.jpg" alt="" />
                </div>
                <div className="list-group-body">
                  <p>
                    <strong>Dominador Manuel</strong> and{" "}
                    <strong>100 other people</strong> reacted to your comment
                    "Tell your partner that...
                  </p>
                  <span>Aug 20 08:55am</span>
                </div>
              </li>
              <li className="list-group-item">
                <div className="avatar online">
                  <img src="../assets/img/img11.jpg" alt="" />
                </div>
                <div className="list-group-body">
                  <p>
                    <strong>Angela Ighot</strong> tagged you and{" "}
                    <strong>9 others</strong> in a post.
                  </p>
                  <span>Aug 18 10:30am</span>
                </div>
              </li>
              <li className="list-group-item">
                <div className="avatar">
                  <span className="avatar-initial bg-primary">a</span>
                </div>
                <div className="list-group-body">
                  <p>
                    New listings were added that match your search alert{" "}
                    <strong>house for rent</strong>
                  </p>
                  <span>Aug 15 08:10pm</span>
                </div>
              </li>
              <li className="list-group-item">
                <div className="avatar online">
                  <img src="../assets/img/img14.jpg" alt="" />
                </div>
                <div className="list-group-body">
                  <p>
                    Reminder: <strong>Jerry Cuares</strong> invited you to like{" "}
                    <strong>Cuares Surveying Services</strong>. <br />
                    <a href="s">Accept</a> or <a href="s">Decline</a>
                  </p>
                  <span>Aug 14 11:50pm</span>
                </div>
              </li>
              <li className="list-group-item">
                <div className="avatar online">
                  <img src="../assets/img/img15.jpg" alt="" />
                </div>
                <div className="list-group-body">
                  <p>
                    <strong>Dyanne Aceron</strong> reacted to your post{" "}
                    <strong>King of the Bed</strong>.
                  </p>
                  <span>Aug 10 05:30am</span>
                </div>
              </li>
            </ul>
            <div className="dropdown-menu-footer">
              <a href="q">Show all Notifications</a>
            </div>
          </div>
        </div>
        <div className="dropdown dropdown-profile ms-3 ms-xl-4">
          <a
            href="#"
            className="dropdown-link"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
          >
            <div className="avatar online">
              <img
                src={`${process.env.REACT_APP_BASE_API_URL}/uploads/avatars/${avatar}`}
              />
            </div>
          </a>
          <div className="dropdown-menu dropdown-menu-end mt-10-f">
            <div className="dropdown-menu-body">
              <div className="avatar avatar-xl online mb-3">
                <img
                  src={`${process.env.REACT_APP_BASE_API_URL}/uploads/avatars/${avatar}`}
                />
              </div>
              <h5 className="mb-1 text-dark fw-semibold">{name}</h5>
              <h6 className="fs-sm text-secondary">{role}</h6>

              <nav className="nav">
                <Link to="/profile">
                  <i className="ri-edit-2-line"></i> Profile
                </Link>
              </nav>
              <hr />
              <nav className="nav">
                <a href="#" onClick={handleLogout}>
                  <i className="ri-logout-box-r-line"></i> Log Out
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
