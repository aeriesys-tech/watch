import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../Components/Sidebar/Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import axiosWrapper from '../../src/utils/AxiosWrapper'; // Import the axiosWrapper function
import { useSelector } from "react-redux";

import 'primereact/resources/themes/saga-blue/theme.css';  // Use the theme you prefer
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { MultiSelect } from 'primereact/multiselect';


function SubscribersDetails()  {
    const user = useSelector((state) => state.user.user);
    // console.log('userlog:---', user)
    const { subscriber_id } = useParams();
    const [subscriber, setSubscriber] = useState();
    const [devices, setDevices] = useState();
    const [checkParameters, setCheckParameters] = useState();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();  

    const [NewDevice, setNewDevice] = useState({        
        client_id:'',
        device_id:'',
        user_id: '',
        status: true,
        check_parameter_ids: [],
    });

    useEffect(() => {
        getSubscribers();
        getDevice();
        getCheckParameters();
    }, []);

    const getSubscribers = async () => {       
        setLoading(true);
        try {            
            const data = await axiosWrapper(`/subscriber/getSubscriber`, {
                data: {subscriber_id: subscriber_id, client_id: user?.clientUserInfo?.client_id}
            }, navigate);
            // console.log('data.data.sub:----', data.data)
            setSubscriber(data.data)
            setLoading(false);
        } catch (error) {
            toast.error('Error fetching Subscribers');
            setSubscriber([]);
            setLoading(false);
        }
    }

    const getDevice = async () => {
        setLoading(true);
        try {            
            const data = await axiosWrapper(`/device/getClientDevices`, {
                data: {client_id: user?.clientUserInfo?.client_id}
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
            const data = await axiosWrapper(`/deviceUser/addDeviceUserWithCheckParameters`, {data: NewDevice}, navigate);
            // console.log('data.data.addDeviceUserWithCheckParameters:----', data.data)
            toast.success(data.message);            
            setLoading(false);
            closeModal();
        } catch (error) {
            toast.error('Error Adding Device User and CheckParameters');
            setLoading(false);
            closeModal();
        }
        finally{
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
        for (let i = 0; i < elements.length; i++) {
            elements[i].className = ''; 
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDevice((prevUser) => ({ ...prevUser, [name]: value }));
        setNewDevice(prevState => ({...prevState,  ['client_id']: user?.clientUserInfo?.client_id }));        
        setNewDevice(prevState => ({...prevState,  ['user_id']: user?.user_id }));
    };

    const handleMultiSelectChange = (e) => {
        const { value } = e.target;
        setNewDevice((prev) => ({ ...prev, check_parameter_ids: value }));
    };
    
    
    return(
        <>
            <ToastContainer position="top-right" autoClose={4000} theme="colored" />
            <Sidebar />
            <div className="main main-app p-3 p-lg-4">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        <div className="d-md-flex align-items-center justify-content-between mb-3">
                            <div>
                                <ol className="breadcrumb fs-sm mb-1">
                                <li className="breadcrumb-item">
                                    <a href="#">Subscribers</a>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    Profile
                                </li>
                                </ol>
                                <h4 className="main-title mb-0">Profile</h4>
                            </div>
                            <div className="mt-3 mt-md-0">
                                { Array.isArray(subscriber?.deviceUsers)  && subscriber?.deviceUsers?.length > 0 ? (
                                    subscriber?.deviceUsers?.map((device, index) => (
                                        device.status ? (
                                            <button type="button" className="btn btn-primary d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#assignDeviceModal">
                                                Activate Device
                                            </button>
                                        ) : (
                                            <button type="button" className="btn btn-danger d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#assignDeviceModal">
                                                Deactivate Device
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

                        <div className="row g-3">
                            <div className="col-md-3 align-item-center">
                                <div className="card card-one" style={{alignItems:'center'}}>
                                    <div className="card-header">
                                        <h6 className="card-title">Subscriber</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="text-center">
                                            <img
                                                height="100"
                                                alt="subscriber"
                                                className="rounded-circle" 
                                                // src={`${process.env.REACT_APP_BASE_API_URL}/uploads/avatars/${avatar}`}
                                                src={`${process.env.REACT_APP_BASE_API_URL}/uploads/avatars/1724239740127-avatar1.jpg`}
                                            />
                                        </div>
                                        <div className="form-group pt-3 text-center">
                                            <p>
                                                <span style={{fontSize:'16px'}}>Name: </span>
                                                {subscriber?.name}
                                            </p>
                                            <p>
                                                <span  style={{fontSize:'16px'}}>Email: </span>
                                                {subscriber?.email}
                                            </p>
                                            <p>
                                                <span  style={{fontSize:'16px'}}>Mobile Number: </span>
                                                {subscriber?.mobile_no}
                                            </p>
                                            { Array.isArray(subscriber?.deviceUsers)  && subscriber?.deviceUsers?.length > 0 ? (
                                                subscriber?.deviceUsers?.map((device, index) => (
                                                    // {device.from_date_time}
                                                    <p>
                                                        <span  style={{fontSize:'16px'}}>Device: Device Assigned</span>                                                        
                                                    </p>
                                                ))
                                            ) : (
                                                <p>
                                                    <span  style={{fontSize:'16px'}}>Device: </span>
                                                    No Device Assigned
                                                </p>) 
                                            }
                                                
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal fade" id="assignDeviceModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header bg-primary text-white">
                                        <h5 className="modal-title" id="exampleModalLabel">Assign Device</h5>
                                        <button type="button" className="btn-close modal_close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body" style={{overflow: 'visible'}}>
                                        <form onSubmit={assignDevice} autoComplete="off">
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">Devices <span className="text-danger">*</span></label>
                                                    <select className="form-control" name="device_id" value={NewDevice.device_id} onChange={handleInputChange}>
                                                        <option value="">Select Device</option>
                                                        {devices?.map(device => (
                                                            <option key={device.device_id} value={device.device_id}>{device?.deviceType?.device_type} :: {device?.serial_no}</option>
                                                        ))}
                                                    </select>
                                                </div>
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
                                                                className="w-full md:w-20rem"
                                                                appendTo={document.body} 
                                                                maxSelectedLabels="2"
                                                                filter={false}
                                                                style={{ width: '100%',
                                                                    fontSize: '0.875rem',
                                                                    fontWeight: '400',
                                                                    lineHeight: '1.5',
                                                                    color: '#41505f',
                                                                    backgroundColor: '#fff',
                                                                    backgroundClip: 'padding-box',
                                                                    border: '1px solid #ccd2da',
                                                                    appearance: 'none',
                                                                    borderRadius: '.25rem' }}
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
                    </>
                )}
            </div>
        </>
    )
}


export default SubscribersDetails;