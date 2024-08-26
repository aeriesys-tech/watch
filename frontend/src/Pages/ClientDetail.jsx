import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosWrapper from '../../src/utils/AxiosWrapper'; // Import your axios wrapper
import Sidebar from '../Components/Sidebar/Sidebar';

function ClientDetail() {
    const { client_id } = useParams(); // Get client_id from URL
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch client details based on client_id
    const fetchClientDetails = async () => {
        setLoading(true); // Set loading state
        try {
            // Make a POST request with client_id in the body
            const response = await axiosWrapper(
                `/client/viewClient`,
                { data: { client_id: client_id } }, // Sending client_id in the request body
                navigate
            );
            setClient(response.data); // Assuming response.data.data contains the client details
            console.log('Client Details:', response.data);
        } catch (error) {
            console.error('Error fetching client details:', error);
            toast.error('Error fetching client details');
        } finally {
            setLoading(false); // Stop loading once the request is complete
        }
    };

    useEffect(() => {
        fetchClientDetails(); // Fetch client details on component mount
    }, [client_id]);

    // Render loading message if data is still being fetched
    if (loading) {
        return <div>Loading...</div>;
    }

    // Render error message if client data is null (e.g., not found)
    if (!client) {
        return <div>Client not found</div>;
    }

    return (
        <div>
            <Sidebar />
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
            <div className="main main-app p-3 p-lg-4">
                <h2>Client Details</h2>
                <div className="card card-body">
                    <h3>{client.client_name}</h3>
                    <p><strong>Client Code:</strong> {client.client_code}</p>
                    <p><strong>Contact Person:</strong> {client.contact_person}</p>
                    <p><strong>Mobile No:</strong> {client.mobile_no}</p>
                    <p><strong>Email:</strong> {client.email}</p>
                    <p><strong>Address:</strong> {client.address}</p>
                    {client.logo && (
                        <div>
                            <p><strong>Logo:</strong></p>
                            <img src={client.logo} alt="Client Logo" style={{ width: '150px' }} />
                        </div>
                    )}
                    <p><strong>Status:</strong> {client.status ? 'Active' : 'Inactive'}</p>
                </div>
            </div>
        </div>
    );
}

export default ClientDetail;
