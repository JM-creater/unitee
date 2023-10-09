import './register.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'
import { toast } from "react-toastify";
import logo from "../../src/assets/images/unitee.png"
import 'react-toastify/dist/ReactToastify.css';


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

    const handleIDnumber = (value) => {
        setIDNumber(value);
    }

    const handleFirstName = (value) => {
        setFirstName(value);
    }

    const handleAddress = (value) => {
        setAddress(value);
    }

    const handleEmail = (value) => {
        setEmail(value);
    }

    const handlePhoneNumber = (value) => {
        setPhoneNumber(value);
    }

    const handlePassword = (value) => {
        setPassword(value);
    }

    const handleConfirmPassword = (value) => {
        setConfirmPassword(value);
    }

    const handleImageProfile = (e) => {
        setImage(e.target.files[0]);
    }

    const handleImageBirChange = (e) => {
        setImageBIR(e.target.files[0]);
    }

    const handleImageCityPermit = (e) => {
        setCityPermit(e.target.files[0]);
    } 

    const handleImageSchoolPermit = (e) => {
        setSchoolPermit(e.target.files[0]);
    }

    // Handle Register
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Check if the fields are empty or not 
        if (
            !IDNumber ||
            !firstName ||
            !address ||
            !email ||
            !phoneNumber ||
            !password ||
            !confirmPassword ||
            !image ||
            !bir ||
            !cityPermit ||
            !schoolPermit
        ) {
            toast.error("Please fill up the required fields.");
            return;
        }
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
            const response = await axios.post('https://localhost:7017/Supplier/registerSupplier', formData);
            if (response.data) {
                toast.success('Successfully registered.');
                navigate('/');
            } else {
                alert(response.data); 
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to register. Please try again later.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <div className='col-md-12 registerCustomer-main-container'>
            <div className='col-md-8 registerCustomer-1'>
                <h1 className='loginText-1'>Let's Get Started!</h1>
                <h5>Create an account using your credentials</h5>
                <div>
                    <div className='row' style={{ display: 'flex', padding: '50px', gap: '5px', justifyContent: 'center' }}>
                    <input className='col-md-5 input-register' 
                            type="text" 
                            placeholder='Store ID'
                            onChange={(e) => handleIDnumber(e.target.value)}/>
                        <input className='col-md-5 input-register' 
                            type="text" 
                            placeholder='Shop Name'
                            onChange={(e) => handleFirstName(e.target.value)}/>
                        <input className='col-md-5 input-register' 
                            type="text" 
                            placeholder='Address'
                            onChange={(e) => handleAddress(e.target.value)}/>
                        <input className='col-md-5 input-register' 
                            type="email" 
                            placeholder='Email'
                            onChange={(e) => handleEmail(e.target.value)}/>
                        <input className='col-md-5 input-register' 
                            type="text" 
                            placeholder='Phone Number'
                            onChange={(e) => handlePhoneNumber(e.target.value)}/>
                        <input className='col-md-5 input-register' 
                            type="password" 
                            placeholder='Password (at least 6 characters long)'
                            onChange={(e) => handlePassword(e.target.value)}/>
                        <input className='col-md-5 input-register' 
                            type="password" 
                            placeholder='Confirm Password'
                            onChange={(e) => handleConfirmPassword(e.target.value)}/>
                        <div className='col-md-5 profile-pic-register-container'>
                            <span className='col-md-4 uploadImage-register-label'>Profile Picture</span>
                            <input type="file" onChange={handleImageProfile}/>
                        </div>
                        <div className='col-md-5 birPermit-pic-register-container'>
                            <span className='col-md-4 uploadImage-register-label'>BIR Permit</span>
                            <input type="file" onChange={handleImageBirChange}/>
                        </div>
                        <div className='col-md-5 cityPermit-pic-register-container'>
                            <span className='col-md-4 uploadImage-register-label'>City Permit</span>
                            <input type="file" onChange={handleImageCityPermit}/>
                        </div>
                        <div className='col-md-10 schoolPermit-pic-register-container' style={{ marginRight:'10px' }}>
                            <span className='col-md-1 uploadImage-register-label'>School Permit</span>
                            <input 
                                type="file" 
                                onChange={handleImageSchoolPermit}
                            />
                        </div>
                        <div className='col-md-10 register-supplier-btn-container'>
                            <button className='col-md-4 btn btn-lg btn-primary' type='submit'>Register</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='col-md-4 registerCustomer-2'>
                <img className='logoRegister' src={ logo } alt="" />
                <Link className='register-to-login' to='/'>
                    <h1 className='registerText-2'>Already have an account?</h1>
                    <div className='col-md-12 back-to-login-btn-container'>
                        <button className='col-md-6 back-to-loginBTN'>Log In</button>
                    </div>                       
                </Link>
            </div>
        </div>
        </form>
    )
}

export default Register