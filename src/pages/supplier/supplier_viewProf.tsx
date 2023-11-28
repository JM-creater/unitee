import editProfIcon from "../../assets/images/icons/editing.png";
import emailIcon from "../../assets/images/icons/mail-2.png";
import phoneIcon from "../../assets/images/icons/smartphone-call.png";
import "./supplier_viewProf.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

type ValidationErrors = {
  shopName?: string;
  address?: string;
  email?: string;
  phoneNumber?: string;
};

type SupplierProfileType = {
  firstName: string;
  lastName: string;
  shopName: string;
  email: string;
  phoneNumber: string;
  password: string;
  gender: string;
  image: string;
};

function Supplier_ViewProf() {
  const [UserProfile, setUserProfile] = useState<SupplierProfileType | null>(
    null
  );
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  //const [password, setPassword] = useState('');
  const { id } = useParams();

  // * For Delay
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // * Handle for Keypress
  const handlePhoneNumber = (value) => {
    if (/^[0-9]*$/.test(value)) {
      setPhoneNumber(value);
    } else {
      toast.error("Phone Number must contain only numbers.");
    }
  };

  // * Fetch User Data
  useEffect(() => {
    axios
      .get(`https://localhost:7017/Users/${id}`)
      .then((res) => {
        setUserProfile(res.data);
        setShopName(res.data.shopName);
        setAddress(res.data.address);
        setEmail(res.data.email);
        setPhoneNumber(res.data.phoneNumber);
        //setPassword(res.data.password)
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  // * Validation Trappings
  const validateForm = (): ValidationErrors => {
    const errors: ValidationErrors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!shopName) {
      errors.shopName = "Shop Name is required.";
      toast.error(errors.shopName);
    }

    if (!address) {
      errors.address = "Address is required.";
      toast.error(errors.address);
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
      formData.append("shopName", shopName);
      formData.append("address", address);
      formData.append("email", email);
      formData.append("phoneNumber", phoneNumber);

      try {
        const productResponse = await axios.put(
          `https://localhost:7017/Users/updateProfileSupplier/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json-patch+json",
            },
          }
        );

        if (productResponse.status == 200) {
          toast.success("Successfully Updated.");
          await sleep(1000);

          window.location.reload();
        } else {
          alert(productResponse.data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to Update. Please try again later.");
      }
    }
  };

  return (
    <div className="viewProfile-supplier-main-container">
      <div className="profile-details-container">
        {UserProfile && (
          <div className="user-details-viewProfile">
            <React.Fragment>
              <img
                className="profileImg"
                src={`https://localhost:7017/${UserProfile.image}`}
                alt=""
              />
            </React.Fragment>
            <div className="username-id-container">
              <h1 className="acc-name">{UserProfile.shopName}</h1>
              <p className="id-number-profile">#{id}</p>
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
              Shop Name
            </label>
            <input
              className="input-prof"
              type="text"
              id="profFirstName"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            ></input>

            <label className="profLabelEdit" htmlFor="profLastName">
              Address
            </label>
            <input
              className="input-prof"
              type="text"
              id="profLastName"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></input>

            <label className="profLabelEdit" htmlFor="profEmail">
              Email
            </label>
            <input
              className="input-prof"
              type="email"
              id="profEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>

          <div className="editProf-details-2">
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
            ></input>

            {/* <label className='profLabelEdit' htmlFor="editPass">Password</label>
                    <input className='input-prof' type="password" name="" id="editPass" disabled></input> */}
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
  );
}

export default Supplier_ViewProf;
