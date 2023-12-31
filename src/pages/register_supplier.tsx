import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import logo from "../../src/assets/images/unitee.png";
import "react-toastify/dist/ReactToastify.css";
import registerUsersEventEmitter from "../helpers/RegisterUsersEmitter";

type ValidationErrors = {
  IDNumber?: string;
  shopName?: string;
  address?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
  image?: string | null;
  bir?: string | null;
  cityPermit?: string | null;
  schoolPermit?: string | null;
};

function Register() {
  const [IDNumber, setIDNumber] = useState("");
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);
  const [bir, setImageBIR] = useState(null);
  const [cityPermit, setCityPermit] = useState(null);
  const [schoolPermit, setSchoolPermit] = useState(null);
  //const [lastErrorMessage, setLastErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const navigate = useNavigate();

  // * Get the Generated ID number for Supplier
  useEffect(() => {
    const fetchedID = localStorage.getItem("generatedSupplierID");
    if (fetchedID) {
      setIDNumber(fetchedID);
      localStorage.removeItem("generatedSupplierID");
    }
  }, []);

  const handleIDnumber = (value) => {
    if (/^[0-9]*$/.test(value)) {
      setIDNumber(value);
    } else {
      toast.error("Store ID must contain only numbers.");
    }
  };

  const handleShopName = (value) => {
    setShopName(value);
  };

  const handleAddress = (value: string) => {
    setAddress(value);
  };

  const handleEmail = (value: string) => {
    setEmail(value);
  };

  const handlePhoneNumber = (value) => {
    if (/^[0-9]*$/.test(value)) {
      setPhoneNumber(value);
      setValidationErrors((prevErrors) => ({ ...prevErrors, phoneNumber: "" }));
    } else {
      setValidationErrors((prevErrors) => ({ ...prevErrors, phoneNumber: "Phone Number must contain only numbers." }));
    }
  };

  const handlePassword = (value: string) => {
    setPassword(value);
  };

  const handleConfirmPassword = (value: string) => {
    setConfirmPassword(value);
  };

  const handleImageProfile = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImageBirChange = (e) => {
    setImageBIR(e.target.files[0]);
  };

  const handleImageCityPermit = (e) => {
    setCityPermit(e.target.files[0]);
  };

  const handleImageSchoolPermit = (e) => {
    setSchoolPermit(e.target.files[0]);
  };

  // * Handle Register Supplier
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const errors: ValidationErrors = validateForm();

    if (Object.keys(errors).length === 0) {
      const formData = new FormData();

      formData.append("Id", IDNumber);
      formData.append("ShopName", shopName);
      formData.append("Address", address);
      formData.append("Email", email);
      formData.append("PhoneNumber", phoneNumber);
      formData.append("Password", password);
      formData.append("Image", image);
      formData.append("BIR", bir);
      formData.append("CityPermit", cityPermit);
      formData.append("SchoolPermit", schoolPermit);

      try {
        const response = await axios.post(
          "https://localhost:7017/Users/registerSupplier",
          formData
        );
        if (response.data) {
          registerUsersEventEmitter.emit("registerSupplier");
          toast.success("Successfully registered.", {
            onClose: () => navigate("/confirmation_email"),
          });
          localStorage.setItem("showSupplierIDModal", "true");
          localStorage.setItem("generatedSupplierID", IDNumber);
        } else {
          toast.error(response.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      }
    }
  };

  const validateForm = (): ValidationErrors => {
    const errors: ValidationErrors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!IDNumber) {
      errors.IDNumber = "Store ID is required.";
    } else if (!/^\d+$/.test(IDNumber) || IDNumber.length !== 8) {
      errors.IDNumber = "Store ID must be 8 numeric characters.";
    }

    if (!shopName) {
      errors.shopName = "Shop Name is required.";
    }

    if (!address) {
      errors.address = "Address is required.";
    }

    if (!email) {
      errors.email = "Email is required";
    } else if (!regex.test(email)) {
      errors.email = "This is not a valid email format";
    }

    if (!phoneNumber) {
      errors.phoneNumber = "Phone Number is required.";
    } else if (phoneNumber.length !== 11 || !/^\d+$/.test(phoneNumber)) {
      errors.phoneNumber = "Phone Number must be exactly 11 numeric characters.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    } else if (/^[a-zA-Z0-9]*$/.test(password)) {
      errors.password = "Password must be alpha numeric.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords did not match.";
    }

    if (!image) {
      errors.image = "Please upload a Profile Picture.";
    }

    if (!bir) {
      errors.bir = "Please upload a BIR Permit.";
    }

    if (!cityPermit) {
      errors.cityPermit = "Please upload a City Permit.";
    }

    if (!schoolPermit) {
      errors.schoolPermit = "Please upload a School Permit.";
    }
    setValidationErrors(errors);
    return errors;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="col-md-12 registerCustomer-main-container">
        <div className="col-md-8 registerCustomer-1">
          <h1 className="loginText-1">Let's Get Started!</h1>
          <h5>Create an account using your credentials</h5>
          <div>
            <div
              className="row"
              style={{
                display: "flex",
                padding: "50px",
                gap: "5px",
                justifyContent: "center",
              }}
            >
              <div className="inputs-container">
                <div className='col-md-5 input-container-withErrorMessage' style={{ marginLeft:'45px' }}>
                  <span>This is your ID Number:</span>
                  <input
                    className="input-register"
                    type="text"
                    placeholder="Store ID"
                    onChange={(e) => handleIDnumber(e.target.value)}
                    value={IDNumber}
                    disabled
                  />
                </div>
                <div className='col-md-5 input-container-withErrorMessage'>
                  <div className={`error-message-container ${validationErrors.shopName ? 'error-message' : 'hidden'}`}>
                    {validationErrors.shopName}
                  </div>
                  <input
                    className="input-register"
                    type="text"
                    placeholder="Shop Name"
                    onChange={(e) => handleShopName(e.target.value)}
                    value={shopName}
                  />
                </div>
              </div>
            
              <div className="inputs-container">
                <div className='col-md-5 input-container-withErrorMessage' style={{ marginLeft:'45px' }}>
                  <div className={`error-message-container ${validationErrors.address ? 'error-message' : 'hidden'}`}>
                    {validationErrors.address}
                  </div>
                  <input
                      className="input-register"
                      type="text"
                      placeholder="Address"
                      onChange={(e) => handleAddress(e.target.value)}
                      value={address}
                    />
                </div>
                <div className='col-md-5 input-container-withErrorMessage'>
                  <div className={`error-message-container ${validationErrors.email ? 'error-message' : 'hidden'}`}>
                    {validationErrors.email}
                  </div>
                  <input
                    className="input-register"
                    type="email"
                    placeholder="Email"
                    onChange={(e) => handleEmail(e.target.value)}
                    value={email}
                  />
                </div>
              </div>

              <div className="inputs-container">
                <div className='col-md-5 input-container-withErrorMessage' style={{ marginLeft:'45px' }}>
                    <div className={`error-message-container ${validationErrors.phoneNumber ? 'error-message' : 'hidden'}`}>
                      {validationErrors.phoneNumber && (
                        <div className="error-message-container">
                          {validationErrors.phoneNumber}
                        </div>
                      )}
                    </div>
                  <input
                    className="input-register"
                    type="text"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneNumber(e.target.value)}
                    maxLength={11}
                  />
                </div>
                <div className='col-md-5 input-container-withErrorMessage'>
                  <div className={`error-message-container ${validationErrors.password ? 'error-message' : 'hidden'}`}>
                    {validationErrors.password}
                  </div>
                  <input
                    className="input-register"
                    type="password"
                    placeholder="Password (at least 6 characters long)"
                    onChange={(e) => handlePassword(e.target.value)}
                    value={password}
                  />
                </div>
              </div>
              
              <div className="inputs-container">
                <div className='col-md-5 input-container-withErrorMessage' style={{ marginLeft:'45px' }}>
                  <div className={`error-message-container ${validationErrors.confirmPassword ? 'error-message' : 'hidden'}`}>
                    {validationErrors.confirmPassword}
                  </div>
                  <input
                      className="input-register"
                      type="password"
                      placeholder="Confirm Password"
                      onChange={(e) => handleConfirmPassword(e.target.value)}
                      value={confirmPassword}
                    />
                </div>
                <div className='col-md-5 input-container-withErrorMessage'>
                  <div className={`error-message-container ${validationErrors.image ? 'error-message' : 'hidden'}`}>
                    {validationErrors.image}
                  </div>
                  <div className="profile-pic-register-container">
                    <span className="col-md-5 uploadImage-register-label">
                      Profile Picture
                    </span>
                    <input type="file" onChange={handleImageProfile} />
                  </div>
                </div>
              </div>
              
              <div className="inputs-container">
                <div className='col-md-5 input-container-withErrorMessage' style={{ marginLeft:'45px' }}>
                  <div className={`error-message-container ${validationErrors.bir ? 'error-message' : 'hidden'}`}>
                    {validationErrors.bir}
                  </div>
                  <div className="birPermit-pic-register-container">
                    <span className="col-md-5 uploadImage-register-label">
                      BIR Permit
                    </span>
                    <input type="file" onChange={handleImageBirChange} />
                  </div>
                </div>
                
                <div className='col-md-5 input-container-withErrorMessage'>
                  <div className={`error-message-container ${validationErrors.cityPermit ? 'error-message' : 'hidden'}`}>
                    {validationErrors.cityPermit}
                  </div>
                  <div className="cityPermit-pic-register-container">
                    <span className="col-md-5 uploadImage-register-label">
                      City Permit
                    </span>
                    <input type="file" onChange={handleImageCityPermit} />
                  </div>
                </div>
              </div>

              <div className="inputs-container">
                <div className='col-md-5 input-container-withErrorMessage' style={{ marginLeft:'45px' }}>
                  <div className={`error-message-container ${validationErrors.schoolPermit ? 'error-message' : 'hidden'}`}>
                    {validationErrors.schoolPermit}
                  </div>
                  <div className="schoolPermit-pic-register-container">
                    <span className="col-md-5 uploadImage-register-label">
                      School Permit
                    </span>
                    <input type="file" onChange={handleImageSchoolPermit} />
                  </div>
                </div>
              </div>
              
              <div className="col-md-10 register-supplier-btn-container">
                <button className="col-md-4 btn btn-lg btn-primary" style={{ borderRadius: "20px" }} type="submit">
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 registerCustomer-2">
          <img className="logoRegister" src={logo} alt="" />
          <Link className="register-to-login" to="/">
            <h1 className="registerText-2">Already have an account?</h1>
            <div className="col-md-12 back-to-login-btn-container">
              <button className="col-md-6 back-to-loginBTN">Log In</button>
            </div>
          </Link>
        </div>
      </div>
    </form>
  );
}

export default Register;
