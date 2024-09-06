import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../Components/Sidebar/Sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosWrapper from '../../src/utils/AxiosWrapper'; // Import the axiosWrapper function
import { useSelector } from "react-redux";


function SubscribersDetails()  {
    const user = useSelector((state) => state.user.user);
    const { client_id } = useParams();
    const [sosAlerts, setSosAlerts] = useState({})
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();  
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
              data: { client_id: client_id }
          }, navigate);
          setSosAlerts(data.data);
          setLoading(false);
    
        } catch (error) {
          toast.error('Error fetching SOS Alerts');
          setSosAlerts([]);
          setLoading(false);
        }
      }
    return (
        <>
            <ToastContainer position="top-right" autoClose={4000} theme="colored" />
            <Sidebar />
            <div className="main main-app p-3 p-lg-4">
                <div className="d-md-flex align-items-center justify-content-between mb-3">
                    <div>
                        <ol className="breadcrumb fs-sm mb-1">
                        <li className="breadcrumb-item">
                            <a href="#">Subscribers</a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Alerts
                        </li>
                        </ol>
                        <h4 className="main-title mb-0">Alerts</h4>
                    </div>
                </div>

                <div className="row">
                    <div className="table-responsive">
                        <table className="table table-bordered text-nowrap">
                            <thead className="bg-light">
                                <tr>
                                    <th className="text-center">#ID</th>
                                    <th className="w-24"> Subscriber</th>
                                    <th>Timestamp</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(sosAlerts.transactions) && sosAlerts.transactions.length > 0 ? sosAlerts.transactions.map((sos, index) => (
                                    <tr key={sos.id} style={{ opacity: user.status ? 1 : 0.5 }}>
                                        <td className="text-center">{index + 1}</td> {/* Serial number */}
                                        <td>{sos.user.name}</td>         
                                        <td>{sos.timestamp}</td>                               
                                        <td className="text-center">
                                            <Link to={`/subscribers/${sos?.user_id}`}>
                                                <i class="ri-pencil-fill"></i>
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">No users found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SubscribersDetails;