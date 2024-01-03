import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../src/assets/images/unitee.png";
import "./register.css";
import registerUsersEventEmitter from "../helpers/RegisterUsersEmitter";

function Register() {
  type ValidationErrors = {
    IDNumber?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    confirmPassword?: string;
    gender?: string;
    departmentId?: string;
    image?: string | null;
    studyLoad?: string | null;
  };

  const [IDNumber, setIDNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [departments, setDepartments] = useState([]);
  const [departmentId, setSelectedDepartment] = useState("");
  const [image, setImage] = useState(null);
  const [studyLoad, setStudyLoad] = useState(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const navigate = useNavigate();

  // * Get the departments
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axios.get("https://localhost:7017/Department");
        setDepartments(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchDepartment();
  }, []);

  // * For Delay
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const handleIDnumber = (value) => {
    if (/^[0-9]*$/.test(value)) {
      setIDNumber(value);
      setValidationErrors((prevErrors) => ({ ...prevErrors, IDNumber: ""}));
    } else {
      setValidationErrors((prevErrors) => ({ ...prevErrors, IDNumber: "ID Number must contain only numbers." }))
    }
  };

  const handleFirstName = (value) => {
    if (/^[a-zA-Z ]*$/.test(value)) {
      setFirstName(value);
      setValidationErrors((prevErrors) => ({ ...prevErrors, firstName: "" }));
    } else {
      setValidationErrors((prevErrors) => ({ ...prevErrors, firstName: "First Name must contain only letters." }));
    }
  };

  const handleLastName = (value) => {
    if (/^[a-zA-Z ]*$/.test(value)) {
      setLastName(value);
      setValidationErrors((prevErrors) => ({ ...prevErrors, lastName: "" }));
    } else {
      setValidationErrors((prevErrors) => ({ ...prevErrors, lastName: "Last Name must contain only letters." }));
    }
  };

  const handlePhoneNumber = (value) => {
    if (/^[0-9]*$/.test(value)) {
      setPhoneNumber(value);
      setValidationErrors((prevErrors) => ({ ...prevErrors, phoneNumber: "" }));
    } else {
      setValidationErrors((prevErrors) => ({ ...prevErrors, phoneNumber: "Phone Number must contain only numbers." }));
    }
  };

  const handleEmail = (value) => {
    setEmail(value);
  };

  const handlePassword = (value) => {
    setPassword(value);
  };

  const handleConfirmPassword = (value) => {
    setConfirmPassword(value);
  };

  const handleGender = (value) => {
    setGender(value);
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleStudyLoad = (e) => {
    setStudyLoad(e.target.files[0]);
  };

  // * Handle register customer
  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
      const formData = new FormData();

      formData.append("Id", IDNumber);
      formData.append("DepartmentId", departmentId);
      formData.append("FirstName", firstName);
      formData.append("LastName", lastName);
      formData.append("Email", email);
      formData.append("PhoneNumber", phoneNumber);
      formData.append("Password", password);
      formData.append("Gender", gender);
      formData.append("Image", image);
      formData.append("StudyLoad", studyLoad);

      try {
        const response = await axios.post(
          "https://localhost:7017/Users/register",
          formData
        );
        if (response.data) {
          localStorage.setItem('token', response.data.token);
          registerUsersEventEmitter.emit("registerCustomer");
          toast.success("Successfully registered.", {
            onClose: () => navigate("/confirmation_email"),
          });
          await sleep(1000);
        } else {
          toast.error(response.data);
          return;
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

  // * Validate Form
  const validateForm = () => {
    const errors: ValidationErrors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!IDNumber) {
      errors.IDNumber = "ID Number is required.";
    } else if (!/^\d+$/.test(IDNumber) || IDNumber.length !== 8) {
      errors.IDNumber = "ID Number must be 8 numeric characters.";
    }

    if (!firstName) {
      errors.firstName = "First Name is required.";
    }

    if (!lastName) {
      errors.lastName = "Last Name is required.";
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
      errors.confirmPassword = "Confirm Password is required.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords did not match.";
    }

    if (!image) {
      errors.image = "Please upload profile picture";
    }

    if (!gender) {
      errors.gender = "Please select a gender.";
    }

    if (!departmentId) {
      errors.departmentId = "Please select a department.";
    }

    if (!studyLoad) {
      errors.studyLoad = "Please upload study load.";
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
            <div className="row" 
            style={{
                marginTop: '55px',
                display: "flex",
                width: 'fit-content',
                justifyContent: 'center',
                alignItems: 'center',
              }}>

              {/* ID NUMBER AND DEPARTMENT */}
              <div className="inputs-container">
                <div className='col-md-5 input-container-withErrorMessage' style={{ marginLeft:'45px' }}>
                  <div className={`error-message-container ${validationErrors.IDNumber ? 'error-message' : 'hidden'}`}>
                    {validationErrors.IDNumber && (
                      <div className="error-message-container">
                        {validationErrors.IDNumber}
                      </div>
                    )}
                  </div>
                  <input className="input-register" type="text" placeholder="ID Number (8 digits)" value={IDNumber} onChange={(e) => handleIDnumber(e.target.value)} maxLength={8}/>
                </div>
                <div className='col-md-5 input-container-withErrorMessage'>
                <div className={`error-message-container ${validationErrors.departmentId ? 'error-message' : 'hidden'}`}>
                    {validationErrors.departmentId}
                  </div>
                  <select className="select-depa" style={{ padding: "10px", border: "2px solid white" }} value={departmentId} onChange={(e) => setSelectedDepartment(e.target.value)}>
                    <option value="" hidden selected disabled>Select Department</option>
                    {departments.map((department) => (
                      <option key={department.departmentId} value={department.departmentId}>
                        {department.department_Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* FIRST AND LAST NAME */}
              <div className="inputs-container">
                {/* ERROR MESSAGE */}
                <div className='col-md-5 input-container-withErrorMessage' style={{ marginLeft:'45px'}}>
                  <div className={`error-message-container ${validationErrors.firstName ? 'error-message' : 'hidden'}`}>
                    {validationErrors.firstName && (
                      <div className="error-message-container">
                        {validationErrors.firstName}
                      </div>
                    )}
                  </div>
                  <input className="input-register" type="text" placeholder="First Name" value={firstName} onChange={(e) => handleFirstName(e.target.value)}/>
                </div>
                <div className='col-md-5 input-container-withErrorMessage'>
                  <div className={`error-message-container ${validationErrors.lastName ? 'error-message' : 'hidden'}`}>
                    {validationErrors.lastName && (
                      <div className="error-message-container">
                        {validationErrors.lastName}
                      </div>
                    )}
                  </div>
                  <input className="input-register" type="text" placeholder="Last Name" value={lastName} onChange={(e) => handleLastName(e.target.value)}/>
                </div>
              </div>

              {/* EMAIL AND PHONE NUMBER */}
              <div className="inputs-container">
                <div className='col-md-5 input-container-withErrorMessage' style={{ marginLeft:'45px'}}>
                  <div className={`error-message-container ${validationErrors.email ? 'error-message' : 'hidden'}`}>
                    {validationErrors.email}
                  </div>
                  <input className="input-register" type="email" placeholder="Email" value={email} onChange={(e) => handleEmail(e.target.value)}/>
                </div>
                <div className='col-md-5 input-container-withErrorMessage'>
                  <div className={`error-message-container ${validationErrors.phoneNumber ? 'error-message' : 'hidden'}`}>
                    {validationErrors.phoneNumber && (
                      <div className="error-message-container">
                        {validationErrors.phoneNumber}
                      </div>
                    )}
                  </div>
                  <input className="input-register" type="text" placeholder="Phone Number (11 digits)" value={phoneNumber} onChange={(e) => handlePhoneNumber(e.target.value)}maxLength={11}/>
                </div>
              </div>

              {/* PASSWORD AND CONFIRM PASSWORD */}
              <div className="inputs-container">
                <div className='col-md-5 input-container-withErrorMessage' style={{ marginLeft:'45px'}}>
                  <div className={`error-message-container ${validationErrors.password ? 'error-message' : 'hidden'}`}>
                    {validationErrors.password}
                  </div>
                  <input className="input-register" type="password" placeholder="Password (Alphanumeric)" value={password} onChange={(e) => handlePassword(e.target.value)}/>
                </div>
                <div className='col-md-5 input-container-withErrorMessage'>
                  <div className={`error-message-container ${validationErrors.confirmPassword ? 'error-message' : 'hidden'}`}>
                    {validationErrors.confirmPassword}
                  </div>
                  <input className="input-register" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => handleConfirmPassword(e.target.value)}/>    
                </div>
              </div>

              {/* GENDER AND PROFILE PICTURE */}
              <div className="inputs-container">
                <div className='col-md-5 input-container-withErrorMessage' style={{ marginLeft:'45px'}}>
                  <div className={`error-message-container ${validationErrors.gender ? 'error-message' : 'hidden'}`}>
                    {validationErrors.gender}
                  </div>
                  <div className="register-gender-radio">
                    <span className="gender-text-register">Gender:</span>
                    <label>
                      <input type="radio" name="radio" value="Male" checked={gender === "Male"} onChange={(e) => handleGender(e.target.value)}/>
                      <span className="gender-label-register">Male</span>
                    </label>
                    <label>
                      <input type="radio" name="radio" value="Female" checked={gender === "Female"} onChange={(e) => handleGender(e.target.value)}/>
                      <span className="gender-label-register">Female</span>
                    </label>
                  </div>
                </div>
                <div className='col-md-5 input-container-withErrorMessage'>
                  <div className={`error-message-container ${validationErrors.image ? 'error-message' : 'hidden'}`}>
                    {validationErrors.image}
                  </div>
                  <div className="profile-pic-register-container">
                    <span className="col-md-5 uploadImage-register-label">
                      Profile Picture
                    </span>
                    <input type="file" onChange={handleImage} />
                  </div>
                </div>
              </div>

                {/* STUDY LOAD */}
                <div className='col-md-12 input-container-withErrorMessage' style={{ marginLeft: '89px'}}>
                  <div className={`error-message-container ${validationErrors.studyLoad ? 'error-message' : 'hidden'}`} style={{ marginLeft:'15px' }}>
                    {validationErrors.studyLoad}
                  </div>
                  <div className="studyLoad-pic-register-container">
                    <span className="col-md-2 uploadImage-register-label">
                      Study Load
                    </span>
                    <input type="file" onChange={handleStudyLoad} />
                  </div>
                </div>
              
              <div className="col-md-10 register-customer-btn-container">
                <button
                  className="col-md-4 btn btn-lg btn-primary"
                  style={{ borderRadius: "20px" }}
                  type="submit"
                >
                  Register
                </button>
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
