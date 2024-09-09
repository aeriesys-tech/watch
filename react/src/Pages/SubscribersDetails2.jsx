import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../Components/Sidebar/Sidebar1';
import { useNavigate, useParams } from 'react-router-dom';
import axiosWrapper from '../../src/utils/AxiosWrapper'; // Import the axiosWrapper function
import { useSelector } from "react-redux";
import moment from 'moment';

import 'primereact/resources/themes/saga-blue/theme.css';  // Use the theme you prefer
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { MultiSelect } from 'primereact/multiselect';

import img1 from "../Assets/img/icon/arrow_back.svg"
import img2 from "../Assets/img/img.png"
import img3 from "../Assets/img/icon/mail.svg"
import img4 from "../Assets/img/icon/call.svg"
import img5 from "../Assets/img/icon/watch_alt_light.svg"
import img6 from "../Assets/img/icon/download.svg"
import img7 from "../Assets/img/wavelength-definition3.png"
import img8 from "../Assets/img/icon/heartrate-icon.svg"
import img9 from "../Assets/img/icon/bar_chart_4_bars.svg"
import img10 from "../Assets/img/icon/blood-pressure-icon.svg"
import img11 from "../Assets/img/icon/bar_chart_4_bars.svg"
import img12 from "../Assets/img/icon/spo2-icon.svg"
import img13 from "../Assets/img/icon/bar_chart_4_bars.svg"
import img14 from "../Assets/img/icon/blood-sugar-icon.svg"
import img15 from "../Assets/img/icon/bar_chart_4_bars.svg"
import img16 from "../Assets/img/icon/body-temp-icon.svg"
import img17 from "../Assets/img/icon/sleep-icon.svg"
import img18 from "../Assets/img/icon/panic-icon.svg"
import img19 from "../Assets/img/icon/fall-icon.svg"
import img20 from "../Assets/img/icon/trash-2 4.svg"
import defaultImg from "../Assets/img/icon/fall-icon.svg"







function SubscribersDetails2() {
    const user = useSelector((state) => state.user.user);
    // console.log('userlog:---', user)
    const { subscriber_id } = useParams();
    const [subscriber, setSubscriber] = useState();
    const [devices, setDevices] = useState();
    const [checkParameters, setCheckParameters] = useState();
    const [loading, setLoading] = useState(true);
    const [subscribersChecks, setSubscribersChecks] = useState()
    const [deviceUserId, setdeviceUserId] = useState({})
    const [editingChecks, seteditingChecks] = useState(null);
    const [sosAlerts, setSosAlerts] = useState({})
    const [sosAlertsStatus, setSosAlertsStatus] = useState(false)
    const navigate = useNavigate();

    const modalRef = useRef(null);
    const modalRefDea = useRef(null);

    const [NewDevice, setNewDevice] = useState({
        client_id: '',
        device_id: '',
        user_id: '',
        status: true,
        check_parameter_ids: [],
    });

    // useEffect(() => {
    //     getSubscribers();
    //     getDevice();
    //     getCheckParameters();
    // }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    getSubscribers(),
                    getDevice(),
                    getCheckParameters(),
                ]);
            } catch (error) {
                console.error('Error fetching initial data:', error);
            }
        };

        fetchData();
    }, [subscriber_id]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (deviceUserId.length > 0) {
                // console.log('Updated device_user_ids:----', deviceUserId);
                getSubscribersCheccks();
                getSOSAlerts();

            }
        }, 60000);

        return () => clearInterval(interval);
    }, [subscriber_id]);


    useEffect(() => {
        if (user?.clientUserInfo?.client_id) {
            getSOSAlerts(); // Fetch alerts when component mounts or client_id changes
        }
    }, [deviceUserId]);

    const getSOSAlerts = async () => {
        setLoading(true);
        let payload = { client_id: user?.clientUserInfo?.client_id,  device_user_id: deviceUserId[0] }
        console.log('payload:----',)
        try {
            const data = await axiosWrapper(`/client/getPanicAlertTransactionsByDeviceUserId`, {
                data: payload
            }, navigate);
            setSosAlerts(data.data);
            console.log('modalRef.current:---', modalRef.current)
            setTimeout(() => {
                if (modalRef.current && data?.data?.transactions?.length > 0) {
                    const modalInstance = new window.bootstrap.Modal(modalRef.current);
                    modalInstance.show();
                    setSosAlertsStatus(true)
                }
            }, 500); // 

            //   openModal();
            //   const modal = new window.bootstrap.Modal(modalRef.current);
            //   modal.show(); // Use Bootstrap's modal method to show the modal

            //   const model_id = document.getElementById('alertModal').click()
            setLoading(false);

        } catch (error) {
            console.log('error:---', error)
            //   toast.error('Error fetching SOS Alerts');
            setSosAlerts([]);
            setLoading(false);
        }
    }

    // useEffect to monitor deviceUserId updates
    useEffect(() => {
        if (deviceUserId.length > 0) {
            console.log('Updated device_user_ids:----', deviceUserId);
            getSubscribersCheccks(); // Now deviceUserId is updated and can be used
        }
    }, [deviceUserId, subscriber_id]);

    const getSubscribers = async () => {
        setLoading(true);
        try {
            const data = await axiosWrapper(`/subscriber/getSubscriber`, {
                data: { subscriber_id: subscriber_id, client_id: user?.clientUserInfo?.client_id }
            }, navigate);

            setSubscriber(data.data);
            setLoading(false);

            if (Array.isArray(data.data?.deviceUsers)) {
                const deviceUserIds = data.data.deviceUsers.map(user => user.device_user_id);
                setdeviceUserId(deviceUserIds); // Setting state asynchronously
            }
        } catch (error) {
            toast.error('Error fetching Subscribers');
            setSubscriber([]);
            setLoading(false);
        }
    };

    const getSubscribersCheccks = async () => {
        setLoading(true);
        try {
            const data = await axiosWrapper(`/userCheckParameter/getCheckParametersByDeviceUserId`, {
                data: { device_user_id: deviceUserId[0] }
            }, navigate);
            console.log('data.data.sub:----', data.data)
            setSubscribersChecks(data.data)
            setLoading(false);
        } catch (error) {
            toast.error('Error fetching Subscribers Checks');
            setSubscribersChecks([]);
            setLoading(false);
        }

    }

    const getDevice = async () => {
        setLoading(true);
        try {
            const data = await axiosWrapper(`/device/getClientDevices`, {
                data: { client_id: user?.clientUserInfo?.client_id }
            }, navigate);
            // console.log('data.data.setDevices:----', data.data)
            setDevices(data.data)
            setLoading(false);
        } catch (error) {
            toast.error('Error fetching Client Devices');
            setDevices([]);
            setLoading(false);
        }
    }

    const getCheckParameters = async () => {
        setLoading(true);
        try {
            const data = await axiosWrapper(`/checkParamter/getCheckParameters`, {}, navigate);
            // console.log('data.data.CheckParameter:----', data.data)
            // setCheckParameters(data.data)
            const parameters = data.data;
            const options = parameters?.map(param => ({
                label: param.parameter_name,
                value: param.check_parameter_id
            }));

            console.log(options);
            setCheckParameters(options)
            setLoading(false);
        } catch (error) {
            toast.error('Error fetching Client Devices');
            setCheckParameters([]);
            setLoading(false);
        }
    }

    const assignDevice = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await axiosWrapper(`/deviceUser/addDeviceUserWithCheckParameters`, { data: NewDevice }, navigate);
            // console.log('data.data.addDeviceUserWithCheckParameters:----', data.data)
            toast.success(data.message);
            setLoading(false);
            closeModal();
            getSubscribers();
        } catch (error) {
            toast.error('Error Adding Device User and CheckParameters');
            setLoading(false);
            closeModal();
        }
        finally {
            closeModal();
        }
    }

    const handleEditChecks = (device) => {
        // setErrors({}); // Reset errors on new submission
        seteditingChecks(device);
        let check_parameter_ids = [];
        for (let i = 0; i < device?.userCheckParameters?.length; i++) {
            check_parameter_ids.push(device.userCheckParameters[i].check_parameter_id)
        }
        setNewDevice({
            device_user_id: device.device_user_id,
            check_parameter_ids: check_parameter_ids,
        });
    };

    const updatePanicAlerts = async (e) => {
        e.preventDefault();
        setLoading(true);
        const oneTransaction = sosAlerts.transactions[0];
        let data_check = {
            device_user_id: oneTransaction.device_user_id,
            check_parameter_id: oneTransaction.check_parameter_id
        }
        console.log('oneTransaction:---', oneTransaction)
        try {
            const data = await axiosWrapper(`/client/setSoSTransactionStatusToFalse`, { data: data_check }, navigate);
            // console.log('data.data.addDeviceUserWithCheckParameters:----', data.data)
            toast.success(data.message);
            setLoading(false);
            closeModal();
            getSubscribers();
            setSosAlertsStatus(false)
        } catch (error) {
            console.log('error:---', error)
            toast.error('Error Adding Device User and CheckParameters');
            setLoading(false);
            closeModal();
        }
        finally {
            closeModal();
        }
    }

    const handleUpdateDevice = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await axiosWrapper(`/deviceUser/updateDeviceUserWithCheckParameters`, { data: NewDevice }, navigate);
            // console.log('data.data.addDeviceUserWithCheckParameters:----', data.data)
            toast.success(data.message);
            setLoading(false);
            closeModal();
            getSubscribers();
        } catch (error) {
            toast.error('Error updating Device User and CheckParameters');
            setLoading(false);
            closeModal();
        }
        finally {
            closeModal();
        }
    }

    const deactivateDeviceUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await axiosWrapper(`/deviceUser/deleteDeviceUser`, { data: { device_user_id: deviceUserId[0] } }, navigate);
            // console.log('data.data.addDeviceUserWithCheckParameters:----', data.data)
            toast.success(data.message);
            setLoading(false);
            closeModal();
            getSubscribers();
        } catch (error) {
            toast.error('Error Deactivating Device');
            setLoading(false);
            closeModal();
        }
        finally {
            closeModal();
        }
    }

    // Function to close the modal
    const closeModal = () => {
        // setErrors({}); // Reset errors on new submission

        const modalElement = document.getElementById('assignDeviceModal');
        const modal = window.bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
        const elements = document.getElementsByClassName('modal-backdrop');
        // for (let i = 0; i < elements.length; i++) {
        //     console.log('elements:---', elements[i].classNameName)
        //     elements[i].classNameName = '';
        // }
        Array.from(elements).forEach(element => {
            element.remove();
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDevice((prevUser) => ({ ...prevUser, [name]: value }));
        // setNewDevice(prevState => ({...prevState,  ['client_id']: user?.clientUserInfo?.client_id }));        
        // setNewDevice(prevState => ({...prevState,  ['user_id']: user?.user_id }));
        console.log('subscriber_id:---', subscriber_id)
        setNewDevice(prevState => ({ ...prevState, client_id: user?.clientUserInfo?.client_id }));
        setNewDevice(prevState => ({ ...prevState, user_id: subscriber_id }));
    };

    const handleMultiSelectChange = (e) => {
        const { value } = e.target;
        setNewDevice((prev) => ({ ...prev, check_parameter_ids: value }));
    };


    const imgForParameter = (parameterName) => {
        switch (parameterName) {
            case 'Heart Rate': return img8;
            case 'Blood Pressure': return img10;
            case 'SPO2': return img12;
            case 'Blood Sugar': return img14;
            case 'Body Temperature': return img16;
            case 'Sleep': return img17;
            case 'Panic Alert': return img18;
            case 'Fall Detect': return img19;
            default: return defaultImg;
        }
    };

    const getParameterValue = (checks) => {
        if (checks?.checkParameter?.transaction?.length > 0) {
            return checks?.checkParameter?.transaction[0]?.value || 'N/A';
        }
        return 'N/A';
    };

    const getParameterTimeStamp = (checks) => {
        if (checks?.checkParameter?.transaction?.length > 0) {
            return checks?.checkParameter?.transaction[0]?.timestamp || 'N/A';
        }
        return 'N/A';
    };



    const getUnit = (parameterName) => {
        switch (parameterName) {
            case 'Heart Rate': return 'bpm';
            case 'Blood Pressure': return 'mmHg';
            case 'SPO2': return '%';
            case 'Blood Sugar': return 'mg/dL';
            case 'Body Temperature': return '°C';
            case 'Sleep': return 'Hours';
            case 'Panic Alert':
            case 'Fall Detect': return 'Times';
            default: return '';
        }
    };

    const formatDate = (dateStr) => {
        const date = moment(dateStr);
        const dateFormatted = date.format('DD-MMM-YYYY'); // Format date to dd-MMM-YYYY
        return `${dateFormatted}`;
    };
    const formatTime = (dateStr) => {
        const date = moment(dateStr);
        const timeFormatted = date.format('hh:mm A'); // Format time to HH:MM AM/PM
        return `${timeFormatted}`;
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={4000} theme="colored" />
            <Sidebar />
            <div classNameName="main main-app p-3 p-lg-4">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-6 text-center text-sm-end align-content-center">
                                    <span className="input-group-addon float-sm-start">
                                        <img className="img-fluid pe-2" src={img1} alt="custom-magnifier" />
                                        <span className="text-capitalize fw-bold">{subscriber?.name}</span>
                                    </span>
                                </div>
                                <div className="col-md-6 text-center text-sm-end d-flex" style={{justifyContent:'end'}}>
                                    {Array.isArray(subscriber?.deviceUsers) && subscriber?.deviceUsers?.length > 0 ? (
                                        subscriber?.deviceUsers?.map((device, index) => (
                                            device.status ? (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                                                    {
                                                        sosAlertsStatus &&
                                                        <div onClick={() => {
                                                            const modalInstance = new window.bootstrap.Modal(modalRef.current);
                                                            modalInstance.show();
                                                            setSosAlertsStatus(true);
                                                        }}>
                                                            <i className="ri-alarm-warning-fill blink" style={{ fontSize: '40px', color: 'red' }}></i>
                                                        </div>

                                                    }
                                                    &nbsp;&nbsp;&nbsp;
                                                    <div style={{ display: 'flex' }}>
                                                        <button type="button" onClick={() => handleEditChecks(device)} style={{ height: '40px' }} className="btn btn-primary d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#assignDeviceModal">
                                                            Update Checks
                                                        </button>
                                                        &nbsp;
                                                        <button type="button" className="btn btn-danger d-flex align-items-center gap-2" style={{ height: '40px' }} data-bs-toggle="modal" data-bs-target="#alertModal_deactivate">
                                                            Deactivate Device
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (

                                                <button type="button" className="btn btn-primary d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#assignDeviceModal">
                                                    Activate Device
                                                </button>
                                            )
                                        ))
                                    ) : (
                                        <button type="button" className="btn btn-primary d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#assignDeviceModal">
                                            Activate Device
                                        </button>)
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="container-fluid mt-36">


                            <div className="row">
                                <div className="col-sm-6 ">
                                    <h5 className="text-uppercase text-dark head_text">profile</h5>
                                    <div className="card bg-profile my-common-radius-card card_profile_bg_image  p-2-5 mb-4">
                                        <div className="row g-4">
                                            <div className="col-xl-4 col-lg-6 text-center text-sm-start">
                                                <img src={img2} className="../../Assets/img-fluid rounded-start" alt="..." />
                                            </div>
                                            <div className="col-xl-8 col-lg-6">
                                                <button className="btn btn-outline-success fs-xs float-end">Active</button>
                                                <div className="card-body text-white">
                                                    <h3 className=" card-title"> {subscriber?.name}

                                                    </h3>
                                                    <p className="card-text card-text-profile">
                                                        <span className="input-group-addon mb-1 d-block">
                                                            <img className="img-fluid pe-2" src={img3} alt="custom-magnifier" />
                                                            <span className="hidden-xs lh-sm fw-normal">  {subscriber?.email}</span>
                                                        </span>
                                                        <span className="input-group-addon fs-6 mb-1 d-block">
                                                            <img className="img-fluid pe-2" src={img4} alt="custom-magnifier" />
                                                            <span className="hidden-xs lh-sm fw-normal">  {subscriber?.mobile_no}</span>
                                                        </span>
                                                        <span className="input-group-addon fs-6 mb-1  d-block" >
                                                            <img className="img-fluid pe-2" src={img5} alt="custom-magnifier" />


                                                            {Array.isArray(subscriber?.deviceUsers) && subscriber?.deviceUsers?.length > 0 ? (
                                                                subscriber?.deviceUsers?.map((device, index) => (
                                                                    // {device.from_date_time}

                                                                    <span className="hidden-xs lh-sm fw-normal">{devices?.serial_no}</span>

                                                                ))
                                                            ) : (

                                                                <span className="hidden-xs lh-sm fw-normal">   No Device Assigned
                                                                </span>

                                                            )

                                                            }

                                                        </span>
                                                    </p>

                                                    <button className="btn btn-info bg-white my-common-radius fs-xs fw-500">Send message</button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="d-sm-none" />
                                    <h5 className="text-uppercase text-dark head_text">Statistics</h5>
                                    <div className="card my-common-radius-card mb-4">
                                        <div className="card-body p-2-5">
                                            <div className="row">


                                                <div className="col-md-12 main-nav text-center">



                                                </div>
                                                <div className="container-fluid">
                                                    <div className="row g-2">
                                                        <div className="col-md-6">
                                                            <select className="form-select select-rate d-block">
                                                                <option value="all">Heart Rate</option>
                                                                <option value="SLTA">Blood Pressure</option>
                                                                <option value="Diploma">SPO2</option>
                                                                <option value="Bachelor">Blood Sugar</option>
                                                                <option value="Master">Body Temperature</option>
                                                                <option value="Master">Sleep</option>
                                                                <option value="Master">Panic Alert</option>
                                                                <option value="Master">Fall Detect</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <button className="btn btnexport btn-outline-primary bg-white d-block fs-xs w-100">Export <img className="img-fluid" src={img6} alt="custom-magnifier" /></button>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <select className="form-select btnexport d-block fs-xs text-primary w-100">
                                                                <option value="all">Hourly</option>
                                                                <option value="all">Daily</option>
                                                                <option value="all">Weekly</option>
                                                                <option value="all">Monthly</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="my-0 fw-bold p-1 mx-auto text-center text-md-start">80
                                                    <span className="rate-short-symbol fw-normal">BPM <small className="text-muted fw-normal fs-xs ps-3">10 July 2024 10:25 AM</small></span>
                                                </h4>
                                            </div>
                                            <img src={img7} width="266" />
                                        </div>
                                    </div>
                                    <hr className="d-sm-none" />
                                    <h5 className="text-uppercase text-dark head_text">Watch Location</h5>
                                    <div className="iframe-container">
                                        <iframe className="my-common-radius-card" width="100%" height="300" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" src="http://www.openstreetmap.org/export/embed.html?bbox=-102.72216796875%2C16.825574258731496%2C-73.71826171874999%2C34.397844946449865&amp;layer=mapnik" style={{ border: "1px solid black" }}></iframe>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-lg-6 mb-2 d-flex align-items-stretch">
                                    <div className="rside" style={{width: "100%"}}>
                                        <div className="centerVertHoriz">
                                            <h5 className="text-uppercase text-dark head_text">Parameters</h5>
                                        </div>
                                        <div className="selectedcenterVertHoriz">
                                            <div className="bg-parameters my-common-radius-card border h-100">
                                                <div className="row">
                                                    {Array.isArray(subscribersChecks) && subscribersChecks.length > 0 ?
                                                        subscribersChecks.map((checks, index) => (
                                                            <div className="col-md-6" key={index}>
                                                                <div className="card card_parameter p-2 p-lg-3">
                                                                    <div className="card-header bg-transparent">
                                                                        <div className="d-flex flex-row justify-content-between">
                                                                            <div><img className="img-fluid" src={imgForParameter(checks?.checkParameter?.parameter_name)} width="40" alt={checks?.checkParameter?.parameter_name} /></div>

                                                                        </div>
                                                                    </div>
                                                                    <div className="card-body pb-2">

                                                                        <p className="card-text text-black my-0 fw-bold">{checks?.checkParameter?.parameter_name}</p>
                                                                        <h2 className="my-0 fw-bold">
                                                                            {getParameterValue(checks)} <span className="rate-short-symbol fw-normal">{getUnit(checks?.checkParameter?.parameter_name)}</span>
                                                                        </h2>
                                                                    </div>
                                                                    <div className="card-footer py-0 bg-transparent border-success">
                                                                        <div className="d-flex flex-row justify-content-between">
                                                                            <div><small className="text-muted fs-xs">{formatDate(getParameterTimeStamp(checks))}</small></div>
                                                                            <div><small className="text-muted fs-xs">{formatTime(getParameterTimeStamp(checks))}</small></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                        : <p>No data available</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>




                        </div>
                        <div className="modal fade" id="assignDeviceModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header bg-primary text-white">
                                        <h5 className="modal-title" id="exampleModalLabel">{editingChecks ? "Update checks" : "Assign Device"}</h5>
                                        <button type="button" className="btn-close modal_close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body" style={{ overflow: 'visible' }}>
                                        <form onSubmit={editingChecks ? handleUpdateDevice : assignDevice} autoComplete="off">
                                            <div className="row g-3">
                                                {!editingChecks &&
                                                    <div className="col-md-6">
                                                        <label className="form-label">Devices <span className="text-danger">*</span></label>
                                                        <select className="form-control" name="device_id" value={NewDevice.device_id} onChange={handleInputChange}>
                                                            <option value="">Select Device</option>
                                                            {devices?.map(device => (
                                                                <option key={device.device_id} value={device.device_id}>{device?.deviceType?.device_type} :: {device?.serial_no}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                }
                                                <div className="col-md-6">
                                                    <div className='row'>
                                                        <div className="col-md-12">
                                                            <label className="form-label">Check Parameters <span className="text-danger">*</span></label>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <MultiSelect
                                                                value={NewDevice.check_parameter_ids}
                                                                options={checkParameters}
                                                                name="check_parameter_ids"
                                                                onChange={(e) => handleMultiSelectChange(e)}
                                                                placeholder="Select Options"
                                                                display="chip"
                                                                className="w-full md:w-20rem form-control"
                                                                appendTo={document.body}
                                                                maxSelectedLabels="2"
                                                                filter={false}
                                                                style={{
                                                                    width: '100%',
                                                                    fontSize: '0.875rem',
                                                                    fontWeight: '400',
                                                                    lineHeight: '1.5',
                                                                    color: '#41505f',
                                                                    backgroundColor: '#fff',
                                                                    backgroundClip: 'padding-box',
                                                                    border: '1px solid #ccd2da',
                                                                    appearance: 'none',
                                                                    borderRadius: '.25rem',
                                                                    display: 'flex',
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal-footer d-block border-top-0">
                                                <div className="d-flex gap-2 mb-4">
                                                    <button type="button" className="btn btn-white flex-fill" data-bs-dismiss="modal">Close</button>
                                                    <button type="submit" className="btn btn-primary flex-fill">Save</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal fade" id="alertModal" ref={modalRef} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                            <form onSubmit={updatePanicAlerts} autoComplete="off">
                                <div className="modal-dialog modal-md">
                                    <div className="modal-content">
                                        <div className="modal-header bg-danger text-white">
                                            <h5 className="modal-title" id="exampleModalLabel">Alert</h5>
                                        </div>
                                        <div className="modal-body" style={{ overflow: 'visible', textAlign: 'center' }}>
                                            <i className="ri-alarm-warning-fill blink" style={{ fontSize: '60px', color: 'red' }}></i>
                                            <p style={{ fontSize: '20px', color: 'black', marginTop: '20px' }}>
                                                Attention! {sosAlerts.count > 0 ? `You have ${sosAlerts.count} new alerts.` : 'No alerts at the moment.'}
                                            </p>
                                        </div>
                                        <div className="modal-footer d-block border-top-0">
                                            <div className="d-flex gap-2 mb-4">
                                                <button type="button" className="btn btn-white flex-fill" data-bs-dismiss="modal">Close</button>
                                                <button type="submit" className="btn btn-primary flex-fill">Attain</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="modal fade" id="alertModal_deactivate" ref={modalRefDea} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                            <form onSubmit={deactivateDeviceUser} autoComplete="off">
                                <div className="modal-dialog modal-md">
                                    <div className="modal-content">
                                        <div className="modal-header bg-danger text-white">
                                            <h5 className="modal-title" id="exampleModalLabel">Deactivate</h5>
                                        </div>
                                        <div className="modal-body" style={{ overflow: 'visible', textAlign: 'center' }}>
                                            {/* <i className="ri-alarm-warning-fill blink" style={{ fontSize: '60px', color: 'red' }}></i> */}
                                            <p style={{ fontSize: '20px', color: 'black', marginTop: '20px' }}>
                                                Are you Sure You want to deactivte!
                                            </p>
                                        </div>
                                        <div className="modal-footer d-block border-top-0">
                                            <div className="d-flex gap-2 mb-4">
                                                <button type="button" className="btn btn-white flex-fill" data-bs-dismiss="modal">Close</button>
                                                <button type="submit" className="btn btn-primary flex-fill">Deactivate</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                    </>
                )}
            </div>
        </>






    )
}


export default SubscribersDetails2;