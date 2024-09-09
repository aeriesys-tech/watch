import img6  from "../../Assets/img/icon/user_d.svg";
import img7  from "../../Assets/img/icon/arrow_outward.svg";
import img8  from "../../Assets/img/icon/watches_d.svg";
import img9  from "../../Assets/img/icon/arrow_outward.svg";
import img10  from "../../Assets/img/icon/transaction_d.svg";
import img11 from "../../Assets/img/icon/arrow_outward.svg";
import img12  from "../../Assets/img/wavelength-definition3.png";
import Sidebar1 from "../../Components/Sidebar/Sidebar1";
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosWrapper from '../../../src/utils/AxiosWrapper';

export default function Dashbord1() {

  const [sosAlerts, setSosAlerts] = useState({})
  const [loading, setLoading] = useState(true);
  const [dashboardDetails, setdashboardDetails] = useState({})

  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  
  useEffect(() => {
    const fetchData = async () => {
        try {
            await Promise.all([
                getSOSAlerts(),
                getdashboardDetails(),
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

  const getdashboardDetails = async () => {
    setLoading(true);
    try {
      const data = await axiosWrapper(`/client/dashboardDetails`, {
          data: { client_id: user?.clientUserInfo?.client_id }
      }, navigate);
      setdashboardDetails(data.data);
      setLoading(false);

    } catch (error) {
      // toast.error('Error fetching SOS Alerts');
      setdashboardDetails([]);
      setLoading(false);
    }
  }

  return (
    <>
    <Sidebar1 />
    <div className="height-100 bg-light my-3">        
        <div className="container-fluid mt-5">
          <div className="row">
            <div className="col">
              <h5 className="text-uppercase rate-short-symbol card_title_evry">Dashboard</h5>
            </div>
          </div>
          <div className="row gy-3">
            <div className="col-md-3 common-column-padding">
              <div className="card card_parameter bg-profile card_dash text-white">
                <div className="card-header bg-transparent p-0 mb-2">
                  <div className="d-flex flex-row justify-content-between">
                    <div><img className="img-fluid" src={img6}  alt="custom-magnifier"/></div>
                  </div>
                </div>
                <div className="card-body card_body_dash">
                  <h3 className="card-text my-0 fw-bold common_extra_spaces ">{dashboardDetails.SubscribersCount}</h3>
                  <p className="my-0 common_extra_spaces">Total Users</p>
                </div>
                <div className="card-footer bg-transparent border-success p-0 lh-lg">
                  <div className="d-flex flex-row justify-content-between text-white align-items-end">
                    {/* <div> <small className="fs-xs">-5% from last month</small></div> */}
                    {/* <div className="dash_icon"> 
                      <img className="img-fluid p-1" src={img7} width="40"  alt="custom-magnifier"/>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 common-column-padding">
              <div className="card card_parameter bg-profile card_dash text-white">
                <div className="card-header bg-transparent p-0 mb-2">
                  <div className="d-flex flex-row justify-content-between">
                    <div><img className="img-fluid" src={img8}  alt="custom-magnifier"/></div>
                  </div>
                </div>
                <div className="card-body card_body_dash">
                  <h3 className="card-text my-0 fw-bold common_extra_spaces ">{dashboardDetails.DeviceCount}</h3>
                  <p className="my-0 common_extra_spaces">Total Watches</p>
                </div>
                <div className="card-footer bg-transparent border-success p-0 lh-lg">
                  <div className="d-flex flex-row justify-content-between text-white align-items-end">
                    {/* <div> <small className="fs-xs">-5% from last month</small></div> */}
                    {/* <div className="dash_icon"> 
                      <img className="img-fluid p-1" src={img9} width="40"  alt="custom-magnifier"/>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 common-column-padding">
              <div className="card card_parameter bg-profile card_dash text-white">
                <div className="card-header bg-transparent p-0 mb-2">
                  <div className="d-flex flex-row justify-content-between">
                    <div><img className="img-fluid" src={img10}  alt="custom-magnifier"/></div>
                  </div>
                </div>
                <div className="card-body card_body_dash">
                  <h3 className="card-text my-0 fw-bold common_extra_spaces ">{dashboardDetails.TransactionCount}</h3>
                  <p className="my-0 common_extra_spaces">Total Transactions</p>
                </div>
                <div className="card-footer bg-transparent border-success p-0 lh-lg">
                  <div className="d-flex flex-row justify-content-between text-white align-items-end">
                    {/* <div> <small className="fs-xs">-5% from last month</small></div> */}
                    {/* <div className="dash_icon"> 
                      <img className="img-fluid p-1" src={img11} width="40"  alt="custom-magnifier"/>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            {user?.clientUserInfo?.client_id && (
              <div className="col-md-3 common-column-padding">
                <div className="card card_parameter bg-profile card_dash text-white">
                  <div className="card-header bg-transparent p-0 mb-2">
                    <div className="d-flex flex-row justify-content-between">
                      {/* <div> */}
                        {/* <img className="img-fluid" src={img10}  alt="custom-magnifier"/> */}
                        <i className="ri-alarm-warning-fill blink img-fluid" style={{fontSize: '26px', color: 'red'}}></i> 
                      {/* </div> */}
                    </div>
                  </div>
                  <div className="card-body card_body_dash">
                    <h3 className="card-text my-0 fw-bold common_extra_spaces ">{sosAlerts.count}</h3>
                    <p className="my-0 common_extra_spaces">Total Alerts</p>
                  </div>
                  <div className="card-footer bg-transparent border-success p-0 lh-lg">
                    <div className="d-flex flex-row justify-content-between text-white align-items-end">
                      {/* <div> <small className="fs-xs">-5% from last month</small></div> */}
                      {/* <div className="dash_icon"> 
                        <Link to={`/subscribers/Alerts/${user?.clientUserInfo?.client_id}`}>
                          <img className="img-fluid p-1" src={img11} width="40"  alt="custom-magnifier"/>
                        </Link>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <hr className="border-0 bg-transparent"/>
        <div className="container-fluid pt-3">
          <div className="row">
            <div className="col-sm-7 common-column-padding">
              <hr className="d-sm-none"/>
              <h5 className="text-uppercase rate-short-symbol card_title_evry">Watch Location</h5>                       
              <div className="iframe-container">
                <iframe className="my-common-radius-card" width="100%" height="350" 
                  frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" 
                  src="http://www.openstreetmap.org/export/embed.html?bbox=-102.72216796875%2C16.825574258731496%2C-73.71826171874999%2C34.397844946449865&amp;layer=mapnik" 
                  style={{border: "1px solid black"}}>                    
                </iframe>
              </div>
            </div>
            <div className="col-sm-5 col-lg-5 mb-2 d-flex align-items-stretch common-column-padding">
              <div className="rside w-100">
                <div className="centerVertHoriz">
                  <h5 className="text-uppercase rate-short-symbol card_title_evry">Analytics</h5>
                </div>
                <div className="selectedcenterVertHoriz"> 
                  <div className="bg-parameters my-common-radius-card border h-100">
                    <div className="row">
                      <div className="col-md-8">
                        <h4 className="">
                          <select className="form-select select-rate mx-auto float-sm-start" style={{maxWidth: "150px"}}>
                            <option value="all">Heart Rate</option>
                            <option value="SLTA">Blood Pressure</option>
                            <option value="Diploma">SPO2</option>
                            <option value="Bachelor">Blood Sugar</option>
                            <option value="Master">Body Temperature</option>
                            <option value="Master">Sleep</option>
                            <option value="Master">Panic Alert</option>
                            <option value="Master">Fall Detect</option>
                          </select>
                        </h4>
                      </div>
                      <div className="col-md-4 text-center text-sm-end">
                        <div className="row g-1">
                          <div className="col-md-4">
                            <button className="btn  btn-outline-success bg-white mx-auto float-sm-end">Export</button>
                          </div>
                          <div className="col-md-7">
                            <select className="form-select mx-auto float-sm-end" style={{maxWidth: "150px"}}>
                              <option value="all">Hourly</option>
                              <option value="all">Daily</option>
                              <option value="all">Weekly</option>
                              <option value="all">Monthly</option>
                            </select>
                          </div>
                        </div>    
                      </div>
                    </div>
                    <img src={img12} className="img-fluid" width="340"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>   
    </>
  )
}
