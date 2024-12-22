import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserDetail = () => {
    const { Id } = useParams(); // Get the userId from the URL
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const baseUrl = import.meta.env.VITE_BASEURL;

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${baseUrl}/auth/users/${Id}`, { withCredentials: true });
                setUserDetails(response.data.user);
                setLoading(false);
            } catch (error) {
                toast.error("Error fetching user details.");
                setLoading(false);
            }
        };
        fetchUserDetails();
    }, [Id, baseUrl]);

    if (loading) {
        return <div>Loading user details...</div>;
    }

    if (!userDetails) {
        return <div>User not found!</div>;
    }

    return (
        <div>
            <h2>User Details</h2>
            <p><strong>Username:</strong> {userDetails.username}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Role:</strong> {userDetails.role}</p>
            <p><strong>Joined:</strong> {new Date(userDetails.createdAt).toLocaleDateString()}</p>
            {/* Display more details if needed */}
        </div>
    );
};

export default UserDetail;
