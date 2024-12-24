import { useEffect, useRef, useState } from "react";
import { assets } from "../assets/assest";
import { useAuthContext } from "../context/auth-context";
import { MdDashboard } from "react-icons/md";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import { MdOutlineMenuOpen } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { RxAvatar } from "react-icons/rx";
import { useParams } from "react-router-dom";

const UserDetails = () => {
 
  const { userData } = useAuthContext();
  const [open, setOpen] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const { Id } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [isApproved, setIsApproved] = useState("Approved")
  const [status, setStatus] = useState("active")
  const [transaction, setTransaction] = useState([])

  const baseUrl = import.meta.env.VITE_BASEURL;

  axios.defaults.withCredentials = true;

  const handleSelectChange =(e) => {
    setIsApproved(e.target.value)
  }
  
  const handleApprovedStatus = async () => {
    try {
        const response = await axios.patch(`${baseUrl}/auth/approvedStatus/${Id}`, 
            { isApproved },
            {
            withCredentials: true,
        })
        
        if (response.status === 201) {
          toast.success("User's Approval status has been updated");
          
        }

        setUserDetails((prevDetails) => ({
          ...prevDetails,
          isApproved: isApproved, // Update only the approval status
        }));

    } catch (error) {
        if (error instanceof axios.AxiosError) {
            toast.error(error?.response?.data);
        } else {
            toast.error("Error fetching users: ", error.message);
        }
    }     
  }

  const handleStatusUpdate = async () => {
    
    try {
      const response = await axios.patch(`${baseUrl}/auth/status/${Id}`,{
        status
      },{
        withCredentials: true,
      })

      if (response.status === 201) {
        toast.success("User's status has been updated");
        
      }
      
      setUserDetails((prevStatus) => ({
        ...prevStatus,
        status: status, // Update only the status
      }));
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        toast.error(error?.response?.data);
    } else {
        toast.error("Error fetching users: ", error.message);
    }
    }
  }

  useEffect(() => {
  const fetchTransaction = async () => {
      try {
        const response = await axios.get(`${baseUrl}/transactions/get-transactionAdmin/${Id}`,{
          withCredentials:true
        })

        setTransaction(response.data.data)
        console.log(transaction);
        
        
      } catch (error) {
        if (error instanceof axios.AxiosError) {
          toast.error(error?.response?.data);
      } else {
          toast.error("Error fetching users: ", error.message);
      }
      }
  }

  fetchTransaction();
  
  },[Id])



    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`${baseUrl}/auth/users/${Id}`, { withCredentials: true });
            setUserDetails(response.data.user);
            setLoading(false);
        } catch (error) {
            if (error instanceof axios.AxiosError) {
                toast.error(error?.response?.data);
            } else {
                toast.error("Error fetching users: ", error.message);
            }
        }
    }; 

    useEffect(() => {
        fetchUserDetails();
    },
 [Id, baseUrl]);

  useEffect(() => {
    // Ensure that userData exists and we can safely check for isAdmin
    if (userData !== null) {
        if (userData.isAdmin !== "ADMIN") {
            toast.error("Unauthorized Access");
            window.location.assign("/");
        } else {
            // If the user is an admin, stop loading
            setLoading(false);
        }
    }
}, [userData]); 


  const handleLogout = async (e) => {
    e.preventDefault();

    setLoggingOut(true);
    try {
      const response = await axios.post(
        `${baseUrl}/auth/logout`,
        {
          withCredentials: true,
        }
      );

      if (response?.data.success) {
        toast.success(response?.data?.message);
        window.location.assign("/");
      }
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.log("");
      }
      if (error === 404 || error) {
        const errorMessage = error.message;
        toast.error(errorMessage);
      }
    } finally{
      setLoggingOut(false);
    }
  };

  const menuitems = [
    {
      icons: <MdDashboard size={30} />,
      label: "Dashboard",
      url: "/admin-dashboard",
    },
    
    
  ];

  const [isNavActive, setIsNavActive] = useState(false);
  const mobileNavRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileNavRef.current && !mobileNavRef.current.contains(event.target)) {
        setIsNavActive(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsNavActive(!isNavActive);
  };
  
  if (loading) {
    return <div>Loading User details...</div>;
}

if (!userDetails) {
    return <div>User not found!</div>;
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
  return (
    <div className="md:flex">
      {userData && (
        <>
          {/* Sidebar for Desktop */}
          <nav
            className={`shadow-md p-2 bg-[#FFBBB8] hidden flex-col ${open ? `w-60` : `w-16`} md:flex duration-500 sticky top-0 h-screen`}
          >
            {/* Header */}
            <div className="px-3 py-2 h-20 flex justify-between items-center">
              <img src={assets.logo} alt="logo" className={`${open ? `w-10` : `w-0`} rounded-md`} />
              <div>
                <MdOutlineMenuOpen
                  size={34}
                  className={`duration-500 cursor-pointer ${!open && `rotate-180`}`}
                  onClick={() => setOpen(!open)}
                />
              </div>
            </div>

            {/* Body */}
            <ul className="flex-1">
              {menuitems.map((item, index) => (
                <li key={index} className="px-1 py-2 my-2 relative duration-300 flex gap-2 items-center group">
                  <a className=" hover:bg-white rounded-md cursor-pointer pt-1 pl-2 pr-32" href={item.url}>
                    <div>{item.icons}</div>
                    <p className={`${!open && `w-0 translate-x-24`} duration-500 overflow-hidden`}>
                      {item.label}
                    </p>
                  </a>
                  <p
                    className={`${open && "hidden"} absolute left-120 shadow-md rounded-md w-0 p-0 duration-300 overflow-hidden group-hover:w-fit group-hover:p-2 group-hover:left-16`}
                  >
                    {item.label}
                  </p>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="flex items-center gap-2 px-3 py-2">
              <div>
                {/* <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>WW</AvatarFallback>
                </Avatar> */}
              </div>
              <div className={`leading-5 ${!open && `w-0 translate-x-24`} duration-500 overflow-hidden`}>
                <p className="flex items-center mr-3">{userData?.username}</p>
                <p className="text-xs uppercase">{userData?.email}</p>

                
                <button 
                onClick={handleLogout} 
                className="flex items-center bg-red-600 rounded-md text-white p-1"
                disabled={loggingOut}
                >
                  
                  {loggingOut ? (
                    <div className="flex items-center space-x-2 justify-center">
                    <span className="animate-pulse">Logging Out</span>{" "}
                    <FaSpinner className=" animate-spin " />
                  </div>
                  ) : (
                    <div className="flex">
                  <p className="mr-1 font-bold">Logout</p>
                  <IoIosLogOut className="cursor-pointer" size={25} />
                  </div>
                )}
                </button>

              </div>
            </div>
          </nav>

          {/* Sidebar for Mobile */}
          <div className="md:hidden">
            <div className="m-6 cursor-pointer" onClick={handleToggle} ref={mobileNavRef}>
              <MdOutlineMenuOpen size={34} />
            </div>

            <div
              ref={mobileNavRef}
              className={`fixed top-0 right-0 w-64 h-full bg-[#FFBBB8] transform transition-all duration-500 ${isNavActive ? "translate-x-0" : "translate-x-full"}`}
            >
              <div className="ml-5 mt-4">
                <img src={assets.logo} alt="logo" className="w-14 rounded-md" />
              </div>

              <nav>
                <ul>
                  {menuitems.map((item, index) => (
                    <li key={index} className="p-5 hover:bg-white hover:rounded-md hover:m-2 cursor-pointer">
                      <a href={item.url}>
                        <div>{item.icons}</div>
                        <p>{item.label}</p>
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 pt-4 pl-4">
                  <div>
                    {/* <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>WW</AvatarFallback>
                    </Avatar> */}
                  </div>
                  <div className="leading-5">
                    <p className="flex items-center mr-3">{userData?.username}</p>
                    <p className="text-xs uppercase">{userData?.email}</p>

 
                    <button 
                onClick={handleLogout} 
                className="flex items-center bg-red-600 rounded-md text-white p-1"
                disabled={loggingOut}
                >
                  
                  {loggingOut ? (
                    <div className="flex items-center space-x-2 justify-center">
                    <span className="animate-pulse">Logging Out</span>{" "}
                    <FaSpinner className=" animate-spin " />
                  </div>
                  ) : (
                    <div className="flex">
                  <p className="mr-1 font-bold">Logout</p>
                  <IoIosLogOut className="cursor-pointer" size={25} />
                  </div>
                )}
                </button>
                  </div>
                </div>
              </nav>
            </div>
          </div>

          {/* Content area */}
          <div
            className={`flex-1 p-5 overflow-auto  md:max-h-screen transition-all duration-500 ${open ? "ml-4" : "ml-5"}`}
          >
        <div>
            <div className="flex items-center justify-center m-10">
            <RxAvatar size={69} />
            </div>

            <div className="flex flex-col gap-4 font-semibold text-xl">
                <p>Full Name: - {userDetails.fullname}</p>
                <p>UserName: - {userDetails.username}</p>
                <p>Email: - {userDetails.email}</p>
                <p>Phone Number: - {userDetails.phonenumber}</p>
                <p>Status: - {userDetails.status}</p>
                <p>IsApproved: - {userDetails.isApproved}</p>
                {/* I'd correct you later */}
                <p>Balance: - ${userDetails.balance}</p>
                <p>Profit: - ${userDetails.profit}</p>
            </div>

            <div className="flex justify-between ml-6 mr-8 mt-10">
            <label>Approve User</label>
            <label>Update User Status</label>
            </div>
            <div className="flex justify-between mx-6">
               
                <div>
                <select name="" value={isApproved}
                onChange={handleSelectChange}
                id=""
                 className="border px-4 py-2  rounded-md font-semibold text-xl">
                    <option value="Approved" className="font-semibold" >Approved</option>
                    <option value="Not Approved">Not Approved</option>
                </select>

                <div>
                    <button onClick={handleApprovedStatus} className="bg-[#14AE5C] px-5 py-2 mt-5 font-playfair font-semibold rounded-lg">Update</button>
                </div>
                </div>

             
                <div>
                <select value={status}
                 id=""
                 onChange={(e) => setStatus(e.target.value)}
                 className="border px-4 py-2  rounded-md font-semibold text-xl">
                    <option value="active" className="font-semibold" >Active</option>
                    <option value="blocked">Blocked</option>
                </select>

                <div>
                    <button onClick={handleStatusUpdate} className="bg-[#14AE5C] px-5 py-2 mt-5 font-playfair font-semibold rounded-lg">Update</button>
                </div>
                </div>
           
           
            </div>
        </div>

        <div className="mt-14">
          <p className="text-center font-playfair text-xl font-semibold">Transaction History</p>

          <div className="bg-[#FFE6E4] mt-9">
            <ol className="flex justify-between mx-2 sm:mx-9 font-playfair">
              <li>Date</li>
              <li>Status</li>
              <li>Amount</li>
              <li>Type</li>
            </ol>
          </div>

          <div>
            {transaction.length === 0 ? (
              <p>No Transaction Available</p>
            ) : (
              <div>
                {transaction.map((transactions, index) => (
                  <div key={index} className="flex justify-between mt-3 mx-2 sm:mx-9 font-playfair text-base sm:text-xl">
                      <p className="mb-3"> {formatDate(transactions.createdAt)}</p>
                      <p>{transactions.status}</p>
                      <p>${transactions.amount}</p>
                      <p>{transactions.type}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
          </div>
        </>
      )}
   
    </div>
   
  );
};

export default UserDetails;
