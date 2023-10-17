import './register.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import logo from '../../src/assets/images/unitee.png';
import 'react-toastify/dist/ReactToastify.css';

type ValidationErrors = {
  IDNumber?: string;
  firstName?: string;
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
  const [IDNumber, setIDNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState(null);
  const [bir, setImageBIR] = useState(null);
  const [cityPermit, setCityPermit] = useState(null);
  const [schoolPermit, setSchoolPermit] = useState(null);
  const navigate = useNavigate();

  const handleIDnumber = (value: string) => {
    setIDNumber(value);
  };

  const handleFirstName = (value: string) => {
    setFirstName(value);
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
    } else {
      toast.error('Phone Number must contain only numbers.');
    }
  };

  const handlePassword = (value: string) => {
    setPassword(value);
  };

  const handleConfirmPassword = (value: string) => {
    setConfirmPassword(value);
  };

  const handleImageProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleImageBirChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageBIR(e.target.files[0]);
    }
  };

  const handleImageCityPermit = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCityPermit(e.target.files[0]);
    }
  };

  const handleImageSchoolPermit = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSchoolPermit(e.target.files[0]);
    }
  };

  // Handle Register
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const errors: ValidationErrors = validateForm();

    if (Object.keys(errors).length === 0) {
      const formData = new FormData();

      formData.append('Id', IDNumber);
      formData.append('FirstName', firstName);
      formData.append('Address', address);
      formData.append('Email', email);
      formData.append('PhoneNumber', phoneNumber);
      formData.append('Password', password);
      formData.append('Image', image);
      formData.append('BIR', bir);
      formData.append('CityPermit', cityPermit);
      formData.append('SchoolPermit', schoolPermit);

      try {
        const response = await axios.post(
          'https://localhost:7017/Supplier/registerSupplier',
          formData
        );
        if (response.data) {
          toast.success('Successfully registered.');
          navigate('/');
        } else {
          alert(response.data);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to register. Please try again later.');
      }
    }
  };

  const validateForm = (): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!IDNumber) {
      errors.IDNumber = 'Store ID is required.';
      toast.error(errors.IDNumber);
    }

    if (!firstName) {
      errors.firstName = 'Shop Name is required.';
      toast.error(errors.firstName);
    }

    if (!address) {
      errors.address = 'Address is required.';
      toast.error(errors.address);
    }

    if (!email) {
      errors.email = 'Email is required.';
      toast.error(errors.email);
    }

    if (!phoneNumber) {
      errors.phoneNumber = 'Phone Number is required.';
      toast.error(errors.phoneNumber);
    } else if (phoneNumber.length !== 11 || !/^\d+$/.test(phoneNumber)) {
      errors.phoneNumber = 'Phone Number must be exactly 11 numeric characters.';
      toast.error(errors.phoneNumber);
    }

    if (!password) {
      errors.password = 'Password is required.';
      toast.error(errors.password);
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
      toast.error(errors.password);
    } else if (/^[a-zA-Z0-9]*$/.test(password)) {
      errors.password = 'Password must be alpha numeric.';
      toast.error(errors.password);
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords did not match.';
      toast.error(errors.confirmPassword);
    }

    if (!image) {
      errors.image = 'Please upload a Profile Picture.';
      toast.error(errors.image);
    }

    if (!bir) {
      errors.bir = 'Please upload a BIR Permit.';
      toast.error(errors.bir);
    }

    if (!cityPermit) {
      errors.cityPermit = 'Please upload a City Permit.';
      toast.error(errors.cityPermit);
    }

    if (!schoolPermit) {
      errors.schoolPermit = 'Please upload a School Permit.';
      toast.error(errors.schoolPermit);
    }

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
                display: 'flex',
                padding: '50px',
                gap: '5px',
                justifyContent: 'center',
              }}
            >
              <input
                className="col-md-5 input-register"
                type="text"
                placeholder="Store ID"
                onChange={(e) => handleIDnumber(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key < '0' || e.key > '9') {
                      e.preventDefault();
                    }
                  }}
              />
              <input
                className="col-md-5 input-register"
                type="text"
                placeholder="Shop Name"
                onChange={(e) => handleFirstName(e.target.value)}
              />
              <input
                className="col-md-5 input-register"
                type="text"
                placeholder="Address"
                onChange={(e) => handleAddress(e.target.value)}
              />
              <input
                className="col-md-5 input-register"
                type="email"
                placeholder="Email"
                onChange={(e) => handleEmail(e.target.value)}
              />
              <input
                className="col-md-5 input-register"
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => handlePhoneNumber(e.target.value)}
                maxLength={11}
              />
              <input
                className="col-md-5 input-register"
                type="password"
                placeholder="Password (at least 6 characters long)"
                onChange={(e) => handlePassword(e.target.value)}
              />
              <input
                className="col-md-5 input-register"
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => handleConfirmPassword(e.target.value)}
              />
              <div className="col-md-5 profile-pic-register-container">
                <span className="col-md-4 uploadImage-register-label">
                  Profile Picture
                </span>
                <input type="file" onChange={handleImageProfile} />
              </div>
              <div className="col-md-5 birPermit-pic-register-container">
                <span className="col-md-4 uploadImage-register-label">BIR Permit</span>
                <input type="file" onChange={handleImageBirChange} />
              </div>
              <div className="col-md-5 cityPermit-pic-register-container">
                <span className="col-md-4 uploadImage-register-label">City Permit</span>
                <input type="file" onChange={handleImageCityPermit} />
              </div>
              <div
                className="col-md-10 schoolPermit-pic-register-container"
                style={{ marginRight: '10px' }}
              >
                <span className="col-md-1 uploadImage-register-label">
                  School Permit
                </span>
                <input type="file" onChange={handleImageSchoolPermit} />
              </div>
              <div className="col-md-10 register-supplier-btn-container">
                <button className="col-md-4 btn btn-lg btn-primary" type="submit">
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
