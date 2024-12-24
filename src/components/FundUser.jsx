import { useEffect, useRef, useState } from "react";
import { assets } from "../assets/assest";
import { useAuthContext } from "../context/auth-context";
import { MdDashboard } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import { MdOutlineMenuOpen } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { useParams } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";


const FundUser = () => {
  axios.defaults.withCredentials = true;
  const { userData } = useAuthContext();
  const [open, setOpen] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const { Id } = useParams();
  const [amount, setAmount] = useState(0)
  const [plan, setPlan] = useState('DBA')
  const [profit, setProfit] = useState(0);

  const baseUrl = import.meta.env.VITE_BASEURL;


  const handleFundingRequest = async (e) => {
      e.preventDefault()

    try {
      const response = await axios.post(`${baseUrl}/userFund/fund/${Id}`,{
        amount,plan
      },{
          withCredentials: true
      });

      if (response.status === 200) {
        toast.success("Funding request sent successfully");
        // setAmount(0)
        // setPlan('')
      }
  
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        toast.error(error?.response?.data);
    } else {
        toast.error("Error fetching users: ", error.message);
    }
    }
    
  }


  const handleProfitRequest = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        `${baseUrl}/transactions/profits/${Id}`,
        { profit },
        { withCredentials: true }
      );
  
      if (response.status === 200) {
        toast.success("Profit request sent successfully");
        setProfit(0); 
      }
    } catch (error) {
      if (error.response) {
        // The server responded with a status code outside of the 2xx range
        const statusCode = error.response.status;
  
        switch (statusCode) {
          case 400:
            toast.error("Bad Request: Please check the profit value.");
            break;
          case 403:
            toast.error("Forbidden: You do not have permission to perform this action.");
            break;
          case 404:
            toast.error("Not Found: The requested resource was not found.");
            break;
          case 500:
            toast.error("Server Error: Something went wrong on the server.");
            break;
          default:
            toast.error(`Error: ${error.response.data.message || 'An error occurred'}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response from server. Please try again later.");
      } else {
        // Something went wrong while setting up the request
        toast.error(`Request error: ${error.message}`);
      }
    }
  };
  

  
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
    return <div>Loading...</div>;
}
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

            <h1 className="font-bold text-2xl text-center font-playfair">Fund User</h1>

<form onSubmit={handleFundingRequest}>
          <div className="font-semibold text-xl mb-2 mt-9">Plan</div>
            <select name="" value={plan}
            onChange={(e) => setPlan(e.target.value)}
            id="" className="border-black border-2 w-60 md:w-96 py-2 pl-2 font-semibold bg-[#D9D9D9]">
              <option value="DBA">DBA</option>
              <option value="UBC">UBC</option>
              <option value="Legacy Builders">Legacy Builders</option>
              <option value="Click Bank">Click Bank</option>
              <option value="Amazon">Amazon</option>
            </select>

            <div className="font-semibold text-xl mb-2 mt-9">Amount</div>
            <div>
              <input className="border-2 w-60 md:w-96 py-2 pl-2 font-semibold bg-[#D9D9D9]"
              placeholder="$"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number" name="" id="" />
            </div>

                  <div className="mt-7 sm:ml-10 ml-5">
            <button 
            className="bg-[#FFBBB8] px-8 py-2 rounded-lg font-semibold"
            type="submit" >Submit</button>
            </div>
            </form>

            <div className="mt-10">
            <h1 className="font-bold text-2xl text-center font-playfair">Add Profit</h1>

            <div className="font-semibold text-xl mb-2 mt-9">Amount</div>
            <form onSubmit={handleProfitRequest}>
            <div>
              <input
              value={profit}
              onChange={(e) => setProfit(e.target.value)}
              className="border-2 w-60 md:w-96 py-2 pl-2 font-semibold bg-[#D9D9D9]"
              placeholder="$"
              type="number" name="" id="" />
            </div>

            
            <div className="mt-7 sm:ml-10 ml-5">
            <button 
            className="bg-[#FFBBB8] px-8 py-2 rounded-lg font-semibold"
            type="submit">Submit</button>
            </div>
            </form>
            </div>
          </div>
          </div>
        </>
      )}
   
    </div>
   
  );
};

export default FundUser;
