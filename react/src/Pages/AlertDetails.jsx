import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../Components/Sidebar/Sidebar1';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosWrapper from '../../src/utils/AxiosWrapper'; // Import the axiosWrapper function
import { useSelector } from "react-redux";

import img1 from '../Assets/img/icon/akar-icons_search.svg'
import img2 from '../Assets/img/icon/fluent_add-16-filled.svg'

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
                        {/* <h4 className="main-title mb-0">Alerts</h4> */}
                    </div>
                </div>
                <div className="container-fluid mt-28">
                    <div className="row">
                        <div className="col">
                        <h5 className="text-uppercase rate-short-symbol card_title_evry">Alerts</h5>
                        </div>
                    </div>
                </div>
                
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">  
                            <div className="card card_parameter">
                                <div className="card-body p-0 pb-3">
                                    <div className="container-fluid px-3 pb-3">
                                        {/* <div className="row g-2 g-lg-3 pt-3 user_row">
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
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                                <div className="table table-responsive mb-0">
                                    <table className="table table-bordered text-nowrap">
                                        <thead className="bg-light">
                                            <tr>
                                            <th className="text-center">#ID</th>
                                            <th className="w-24"> Subscriber</th>
                                            <th>Timestamp</th>
                                            <th className="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white p-3">
                                            {Array.isArray(sosAlerts.transactions) && sosAlerts.transactions.length > 0 ? sosAlerts.transactions.map((sos, index) => (
                                            <tr key={sos.id} style={{ opacity: user.status ? 1 : 0.5 }}>
                                                <td className="text-center">{index + 1}</td> {/* Serial number */}
                                                <td>{sos.user.name}</td>         
                                                <td>{sos.timestamp}</td>                               
                                                <td className="text-center">
                                                    <Link to={`/subscribers2/${sos?.user_id}`}>
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
                    </div>
                </div>


                {/* <div className="row">
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
                                        <td className="text-center">{index + 1}</td>
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
                </div> */}
            </div>
        </>
    )
}

export default SubscribersDetails;