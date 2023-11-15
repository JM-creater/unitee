import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import illustration from '../../src/assets/images/loginPic.png';
import logo from '../../src/assets/images/unitee.png';
import forgotPass from '../../src/assets/images/icons/forgot.png'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from './common/LoadingScreen';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy  } from "@fortawesome/free-solid-svg-icons";

type ValidationErrors = {
  IDOrEmail?: string;
  Password?: string;
};

function Login() {
  
  const [IDOrEmail, setIDOrEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierID, setSupplierID] = useState('');
  const navigate = useNavigate();

  // * For Delay
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // * Generate Random Id for Supplier
  const generateRandomID = () => {
    const id = Math.floor(10000000 + Math.random() * 90000000).toString();
    localStorage.setItem('generatedSupplierID', id);
  };

  // * Toggle the Modal
  const toggleModal = useCallback(() => {
    setIsModalOpen(prevState => !prevState);
  }, []);

  // * Show the modal
  useEffect(() => {
    const fetchedID = localStorage.getItem('generatedSupplierID');
    const shouldShowModal = localStorage.getItem('showSupplierIDModal');
    if (shouldShowModal === 'true') {
      setSupplierID(fetchedID);
      toggleModal();
      localStorage.removeItem('showSupplierIDModal');
    }
  }, [toggleModal]);

  // * Close Modal
  const closeModal = () => {
    const modal = document.getElementById("IDNumberModal");
  modal.style.display = "none";
  }

  // * Copy ID Number 
  const copyToClipboard = (text) => {
    const copyClip = document.createElement("textarea");
    copyClip.value = text;
    document.body.appendChild(copyClip);
    copyClip.select();
    document.execCommand("copy");
    document.body.removeChild(copyClip);
    toast.success("Copied to clipboard: " + text);
  }
  
  const handleIDOrEmail = (value: string) => {
    setIDOrEmail(value);
  };

  const handlePassword = (value: string) => {
    setPassword(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  }

  // * Login Account
  const handleLogin = () => {
    const errors: ValidationErrors = {};

    if (!IDOrEmail) {
      errors.IDOrEmail = 'ID Number or Email is required.';
    }

    if (!Password) {
      errors.Password = 'Password is required.';
    }

    if (Object.keys(errors).length > 0) {
      for (const key in errors) {
        toast.error(errors[key]);
      }
      return;
    }

    let data;
    if (/^\d+$/.test(IDOrEmail)) {
      data = {
        Id: parseInt(IDOrEmail),
        Password: Password,
      };
    } else if (/@/.test(IDOrEmail)) {
      data = {
        Email: IDOrEmail,
        Password: Password,
      };
    } else {
      toast.error('Please provide a valid ID Number or Email.');
      return;
    }

    const url = 'https://localhost:7017/Users/login';
    axios
      .post(url, data)
      .then(async(result) => {
        
        if (result.status === 200) {
          switch (result.data.role) {
            case 'Customer':
              setIsLoading(true);
              await sleep(10000);
              navigate(`/shop/${result.data.user.id}`, { state: { userData: result.data.user } });
              break;
            case 'Supplier':
              setIsLoading(true);
              await sleep(10000);
              navigate(`/supplier_dashboard/${result.data.user.id}`, { state: { supplierData: result.data.user } });
              break;
            case 'Admin':
              setIsLoading(true);
              await sleep(10000);
              navigate(`/admin_dashboard/${result.data.user.id}`, { state: { adminData: result.data.user } });
              break;
            default:
              console.log('Unknown role');
              break;
          }
        } else {
          toast.error(result.data.message);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          if (error.response.data === 'Invalid user id.' || error.response.data === 'Invalid password.') {
            toast.error(error.response.data);
          } else if (error.response.data === 'Waiting for validation') {
            toast.info('Please Wait for Validation.');
          } else {
            toast.error('Wrong Credentials');
          }
        } else {
          toast.error('Unexpected Error');
        }
      });
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <React.Fragment>
          <LoadingScreen />
        </React.Fragment>
      ) : (
        <div className="col-md-12 main-container row">
        <div className="col-md-7 login-1-container">
          <img className="web-logo" src={logo} alt="" />
          <h3 className="text">Find clothes that suits you and your course.</h3>
          <img className="stud-img" src={illustration} alt="" />
        </div>
        <div className="col-md-5 login-2-container">
          <h1 className="login-title">Login</h1>
          <h4 className="login-text">Enter your valid credentials for logging in</h4>
          <input
            className="col-md-7 input-login"
            type="text"
            placeholder="ID Number or Email"
            value={IDOrEmail}
            onChange={(e) => handleIDOrEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <input
            className="col-md-7 input-login"
            type="password"
            placeholder="Password"
            value={Password}
            onChange={(e) => handlePassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <div className='col-md-7 forgot-pwd-container'>
            <Link to="/forgot_password">
              <button className='forgot-pwd-btn'>
                <img className='forgot-pwd-icon' src={ forgotPass }/>
                Forgot Password</button>
            </Link>
          </div>

          <button className="col-md-7 login-btn" onClick={() => handleLogin()}>
            Log In
          </button>

          <div className={`modal ${isModalOpen ? 'show' : ''}`} id="IDNumberModal" tabIndex={-1} style={{ display: isModalOpen ? 'block' : 'none' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="IDNumberModalLabel">Please copy your ID #:</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  <h5>Your Supplier ID: {supplierID}</h5>
                  <span
                    className="copy-icon"
                    onClick={() => copyToClipboard(supplierID)}
                  >
                    <FontAwesomeIcon icon={faCopy} />
                  </span>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-success" onClick={closeModal}>Proceed</button>
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                </div>
              </div>
            </div>
          </div>

          <h3 className="register-text">Don't have an account?</h3>
          <h5> Register as:</h5>

          <div className="register-btn-container">
            <Link className="register-link" to="/register">
              <button className="register-customer-btn">Customer</button>
            </Link>

            <Link className="register-link" to="/register_supplier">
              <button className="register-customer-btn" onClick={generateRandomID}> Supplier</button>
            </Link>
          </div>
        </div>
      </div>
      )}
    </React.Fragment>
  )
}

export default Login;
