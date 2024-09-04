import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../Components/Sidebar/Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import axiosWrapper from '../../src/utils/AxiosWrapper'; // Import the axiosWrapper function
import { useSelector } from "react-redux";

function SubscribersDetails()  {
    const user = useSelector((state) => state.user.user);
    const { subscriber_id } = useParams();
    const [subscriber, setSubscriber] = useState();
    const navigate = useNavigate();  

    useEffect(() => {
        getSubscribers();
    }, []);

    const getSubscribers = async () => {       
        try {
            const data = await axiosWrapper(`/subscriber/getSubscriber`, {
                data: {subscriber_id: subscriber_id, client_id: user?.clientUserInfo?.client_id}
            }, navigate);
            console.log('data.data.sub:----', data.data)
            setSubscriber(data.data)
        } catch (error) {
            toast.error('Error fetching Subscribers');
            setSubscriber([]);
        }
    }


    return(
        <div>
            <Sidebar />
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
            
            <div className="main main-app p-3 p-lg-4">
                <div className="row">
                    <div className="card card-body mt-4 col-md-4">

                    </div>

                    <div className="card card-body mt-4 col-md-8">

                    </div>
                    
                </div>
            </div>
        </div>
    )
}


export default SubscribersDetails;