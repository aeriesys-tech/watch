import Bespoke_logo_svg from "../../Assets/assets/img/Bespoke_logo_svg 1.png";
import Sidebar from "../../Components/Sidebar/Sidebar";
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosWrapper from '../../../src/utils/AxiosWrapper';

function Dashboard() {

  const [sosAlerts, setSosAlerts] = useState({})
  const [loading, setLoading] = useState(true);


  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  
  useEffect(() => {
    const fetchData = async () => {
        try {
            await Promise.all([
                getSOSAlerts(),
            ]);
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    };

    fetchData();
  }, []);

  const getSOSAlerts = async () => {
    setLoading(true);
    try {
      const data = await axiosWrapper(`/client/getPanicAlertTransactions`, {
          data: { client_id: user?.clientUserInfo?.client_id }
      }, navigate);
      setSosAlerts(data.data);
      setLoading(false);

    } catch (error) {
      // toast.error('Error fetching SOS Alerts');
      setSosAlerts([]);
      setLoading(false);
    }
  }

  return (
    <>
      <Sidebar />

      <div className="main main-app p-3 p-lg-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <ol className="breadcrumb fs-sm mb-1">
              <li className="breadcrumb-item">
                <a href="s">Dashboard</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Website Analytics
              </li>
            </ol>
            <h4 className="main-title mb-0">Welcome to Dashboard</h4>
          </div>          
        </div>
        {user?.clientUserInfo?.client_id && (
          <div className="row g-3">
            <div className="col-xl-12">
              <div className="col-lg-3 col-6">
                <div className="card card-one" style={{alignItems:'center'}}>
                  <div className="card-header">
                      <h6 className="card-title">SOS Alerts</h6>
                  </div>
                  <div className="card-body">
                  <Link to={`/subscribers/Alerts/${user?.clientUserInfo?.client_id}`}>
                      <i className="ri-alarm-warning-fill blink" style={{fontSize: '40px', color: 'red'}}></i> 
                      &nbsp;&nbsp;&nbsp;
                      <span style={{fontSize: '40px'}}>{sosAlerts.count}</span>
                    </Link>                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}        
      </div>
    </>
  );
}

export default Dashboard;
