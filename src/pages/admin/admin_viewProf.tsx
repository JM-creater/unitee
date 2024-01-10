import "./admin_viewProf.css";
import editProfIcon from "../../assets/images/icons/editing.png";
import emailIcon from "../../assets/images/icons/mail-2.png";
import phoneIcon from "../../assets/images/icons/smartphone-call.png";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import uploadimage from "../../assets/images/icons/uploadimage.png"
import LoadingGif from "../../assets/images/icons/loadingscreen.svg";
import React from "react";

type ValidationErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
};

type UserProfileType = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  image: string;
};

function Admin_viewProf() {
  const [UserProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  // * For Delay
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

   // * toggle input
   const toggleInput = () => {
    setIsDisabled(!isDisabled);
    setPassword(''); 
    setConfirmPassword('');
  }

  // * Show the inputs
  const handleEditProfileClick = () => {
    setIsEditing(!isEditing); 
  };

  // * Handle Upload Image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImageUrl = event.target?.result as string;
        setImagePreviewUrl(newImageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // * Handle Phone Number
  const handlePhoneNumber = (value) => {
    if (/^[0-9]*$/.test(value)) {
      setPhoneNumber(value);
    } else {
      toast.error("Phone Number must contain only numbers.");
    }
  };

  // * Fetch User Data
  useEffect(() => {
    setIsLoading(true);
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://localhost:7017/Users/${id}`);
        setUserProfile(response.data);
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setEmail(response.data.email);
        setPhoneNumber(response.data.phoneNumber);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [id]);

  // * Validation Trappings
  const validateForm = () => {
    const errors: ValidationErrors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!firstName) {
      errors.firstName = "First Name is required.";
      toast.error(errors.firstName);
    }

    if (!lastName) {
      errors.lastName = "Last Name is required.";
      toast.error(errors.lastName);
    }

    if (!email) {
      errors.email = "Email is required";
      toast.error(errors.email);
    } else if (!regex.test(email)) {
      errors.email = "This is not a valid email format";
      toast.error(errors.email);
    }

    if (!phoneNumber) {
      errors.phoneNumber = "Phone Number is required.";
      toast.error(errors.phoneNumber);
    } else if (phoneNumber.length !== 11 || !/^\d+$/.test(phoneNumber)) {
      errors.phoneNumber =
        "Phone Number must be exactly 11 numeric characters.";
      toast.error(errors.phoneNumber);
    }

    return errors;
  };

  // * Update Button Handler
  const HandleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    const errors: ValidationErrors = validateForm();

    if (Object.keys(errors).length === 0) {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phoneNumber", phoneNumber);
      formData.append("image", image);

      try {
        const response = await axios.put(
          `https://localhost:7017/Users/updateProfileAdmin/${id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status == 200) {
          toast.success("Successfully Updated.");
          await sleep(1000);

          window.location.reload();
        } else {
          toast.error(response.data);
        }
      } catch (error) {
        console.log(error);
        console.error("Network error or server not responding");
      }
    }
  };
  

  // * Handle update password
  const handleUpdatePassword = async () => {
    let errorFound = false;

    if (!password) {
      toast.error("Password is required.");
      errorFound = true;
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      errorFound = true;
    } else if (!/^[a-zA-Z0-9]*$/.test(password)) {
      toast.error("Password must be alphanumeric.");
      errorFound = true;
    }

    if (!confirmPassword) {
      toast.error("Confirm Password is required.");
      errorFound = true;
    } else if (password !== confirmPassword) {
      toast.error("Passwords did not match.");
      errorFound = true;
    }

    if (errorFound) return;

    try {
      const response = await axios.put(
        `https://localhost:7017/Users/updateAdminPassword/${id}`, { password: password }
      );

      if (response.status === 200) {
        await sleep(100);
        window.location.reload();
        toast.success('Password updated successfully.');
        setPassword(''); 
        setConfirmPassword(''); 
      } else {
        toast.error('Failed to update password. Please try again later.');
      }
    } catch (error) {
      console.log(error);
        console.error("Network error or server not responding");
    }
  };


  return (
    <React.Fragment>
      {isLoading ? (
        <div className="mainloading-screen">
          <img className="mainloading-bar" src={LoadingGif} alt="loading..." />
        </div>
      ) : (
        <div className="viewProfile-admin-main-container">
        <div className="profile-details-container">
          {UserProfile && (
            <div className="user-details-viewProfile">
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="imageUploadInput"
                  onChange={handleImageUpload}
                />
              )}
              <label htmlFor="imageUploadInput" style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  className='profileImg'
                  src={imagePreviewUrl || `https://localhost:7017/${UserProfile.image}`}
                  alt="Profile"
                  style={{ width: '200px', height: '200px'}}
                />
                {isEditing && (
                  <img 
                    src={uploadimage}
                    alt="Upload Icon" 
                    style={{ 
                      position: 'absolute', 
                      bottom: '-5px', 
                      right: '20px',
                      cursor: 'pointer',
                      width: '40px',
                      height: '40px'
                    }} 
                  />
                )}
              </label>
              <div className="username-id-container">
                <h1 className="acc-name">
                  {UserProfile.firstName + " " + UserProfile.lastName}
                </h1>
                <p className="id-number-profile">Admin ID: {id}</p>
              </div>
            </div>
          )}
  
          <button
            className="editProf-btn"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#editProfCollapse"
            aria-expanded="false"
            aria-controls="editProfCollapse"
            onClick={handleEditProfileClick}
          >
            <img className="editIconProf" src={editProfIcon} alt="" />
            Edit Profile
          </button>
        </div>
  
        {/* EDIT COLLAPSE */}
        <div
          className="collapse"
          id="editProfCollapse"
          style={{ padding: "40px" }}
        >
          <h1>Edit Profile Information</h1>
          <div
            className="card card-body"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <div className="editProf-details-1">
              <label className="profLabelEdit" htmlFor="profFirstName">
                First Name
              </label>
              <input
                className="input-prof"
                type="text"
                id="profFirstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isDisabled}
              ></input>
  
              <label className="profLabelEdit" htmlFor="profLastName">
                Last Name
              </label>
              <input
                className="input-prof"
                type="text"
                id="profLastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isDisabled}
              ></input>
            </div>
  
            <div className="editProf-details-2">
              <label className="profLabelEdit" htmlFor="profEmail">
                Email
              </label>
              <input
                className="input-prof"
                type="email"
                id="profEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isDisabled}
              ></input>
  
              <label className="profLabelEdit" htmlFor="profPhone">
                Phone Number
              </label>
              <input
                className="input-prof"
                type="text"
                id="profPhone"
                value={phoneNumber}
                onChange={(e) => handlePhoneNumber(e.target.value)}
                maxLength={11}
                disabled={isDisabled}
              ></input>
                <label className='profLabelEdit' htmlFor="editPass">Password</label>
                <button className='changePass-btn-prof' onClick={toggleInput}>
                  {isDisabled ? 'Hide Input Password' : 'Change Password'}
                </button>
                {isDisabled && (
                  <React.Fragment>
                    <label className='profLabelEdit' htmlFor="editPass">Current Password</label>
                    <input 
                      className='input-prof' 
                      type="password" 
                      name="" 
                      id="editPass" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    >
                    </input>
                    <label className='profLabelEdit' htmlFor="editPass">Confirm Password</label>
                    <input 
                      className='input-prof' 
                      type="password" 
                      name="" 
                      id="editPass" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    >
                    </input>
                    
                    <div className="updatePassword-btn-container" style={{ display: 'flex', justifyContent: 'center' }}>
                      <button className='editProf-save-btn' onClick={handleUpdatePassword}>Update</button>
                    </div>
                  </React.Fragment>
                )}    
            </div>
          </div>
          <div className="saveChanges-btn-container">
            <button className="editProf-save-btn" onClick={HandleUpdate}>
              Save Changes
            </button>
          </div>
        </div>
  
        <div className="about-user-container">
          <h3
            style={{
              borderBottom: "2px solid #f0f0f0",
            }}
          >
            About
          </h3>
          <div className="about-userInfo-container">
            <div>
              <h5 className="about-details-prof">
                <img className="aboutIcons" src={emailIcon} alt="" />
                Email
              </h5>
              <h5 className="about-details-prof">
                <img className="aboutIcons" src={phoneIcon} alt="" />
                Phone Number
              </h5>
            </div>
            {UserProfile && (
              <div>
                <h5 className="about-details-prof">{UserProfile.email}</h5>
                <h5 className="about-details-prof">{UserProfile.phoneNumber}</h5>
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </React.Fragment>
    
  );
}

export default Admin_viewProf;
