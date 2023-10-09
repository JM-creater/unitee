import './register.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import logo from "../../src/assets/images/unitee.png"
import 'react-toastify/dist/ReactToastify.css';


function Register() {

    // interface Department {
    //     departmentId: number;
    //     department_Name: string;
    // }

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

    const [IDNumber, setIDNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState('');
    const [departments, setDepartments] = useState([]);
    const [departmentId, setSelectedDepartment] = useState('');
    const [image, setImage] = useState(null);
    const [studyLoad, setStudyLoad] = useState(null)
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const navigate = useNavigate();

    const handleIDnumber = (value) => {
        setIDNumber(value);
    }

    const handleFirstName = (value) => {
        setFirstName(value);
    }

    const handleLastName = (value) => {
        setLastName(value);
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

    const handleGender = (value) => {
        setGender(value);
    }

    const handleImage = (e) => {
        setImage(e.target.files[0]);
    }

    const handleStudyLoad = (e) => {
        setStudyLoad(e.target.files[0]);
    }

    // Handle Register
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const errors = validateForm();
        
        // Check if the fields are empty or not 
        if (
            !IDNumber ||
            !departmentId ||
            !firstName ||
            !lastName ||
            !email ||
            !phoneNumber ||
            !password ||
            !confirmPassword ||
            !gender ||
            !image ||
            !studyLoad
        ) {
            toast.error("Please fill up the required fields.");
            return;
        }
    
        if (Object.keys(errors).length === 0) {
            const formData = new FormData();
    
            formData.append('Id', IDNumber);
            formData.append('DepartmentId', departmentId);
            formData.append('FirstName', firstName);
            formData.append('LastName', lastName);
            formData.append('Email', email);
            formData.append('PhoneNumber', phoneNumber);
            formData.append('Password', password);
            formData.append('Gender', gender);
            formData.append('Image', image);
            formData.append('StudyLoad', studyLoad);
    
            try {
                const response = await axios.post('https://localhost:7017/Users/register', formData);
                if (response.data) {
                    toast.success('Successfully registered.');
                    navigate('/');
                } else {
                    toast.error(response.data); 
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to register. Please try again later.");
            }
        }
    };

     // Validation 
    const validateForm = () => {
        const errors: ValidationErrors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    
        if (!IDNumber || !/^\d+$/.test(IDNumber)) {
            errors.IDNumber = 'ID Number must be a valid number.';
        } 
        
        if (!firstName) {
            errors.firstName = 'First Name is required.';
        }
    
        if (!lastName) {
            errors.lastName = 'Last Name is required.';
        }
    
        if (!email) {
            errors.email = "Email is required";
        } else if (!regex.test(email)) {
            errors.email = "This is not a valid email format";
        }
    
        if (!phoneNumber || !/^\d+$/.test(phoneNumber)) {
            errors.phoneNumber = 'Phone Number must be a valid number.';
        }
    
        if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters long.';
        }
    
        if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match.';
        }
    
        if (!image) { 
            errors.image = 'Please upload an image';
        }
    
        if (!gender) {
            errors.gender = 'Please select a gender.';
        }
    
        if (!departmentId) {
            errors.departmentId = 'Please select a department.';
        }

        if (!image) { 
            errors.studyLoad = 'Please upload an image';
        }
    
        setValidationErrors(errors);

        return errors;
    };

    //Read All Departments
    useEffect(() => {
        axios.get('https://localhost:7017/Department')
            .then(res => {
                setDepartments(res.data);
            })
            .catch((err) => {console.error(err)
        });
    }, []);

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
                            placeholder='ID Number'
                            onChange={(e) => handleIDnumber(e.target.value)}/>
                        <select className="col-md-5" style={{ padding:'10px', border: '2px solid white' }}   value={departmentId} onChange={(e) => setSelectedDepartment(e.target.value)}>
                            <option>Select Department*</option>
                                {departments.map((department) => 
                                    <option key={department.departmentId} value={department.departmentId}>
                                        {department.department_Name}
                                    </option>
                            )}
                        </select>
                        <input className='col-md-5 input-register' 
                            type="text" 
                            placeholder='First Name'
                            onChange={(e) => handleFirstName(e.target.value)}/>
                        <input className='col-md-5 input-register' 
                            type="text" 
                            placeholder='Last Name'
                            onChange={(e) => handleLastName(e.target.value)}/>
                        
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
                            placeholder='Password'
                            onChange={(e) => handlePassword(e.target.value)}/>
                        <input className='col-md-5 input-register' 
                            type="password" 
                            placeholder='Confirm Password'
                            onChange={(e) => handleConfirmPassword(e.target.value)}/>
                        <div className='col-md-5 register-gender-radio'>
                            {validationErrors.gender && <div className="error">{validationErrors.gender}</div>}
                            <span className='gender-text-register'>Gender:</span>
                            <label>
                                <input 
                                type='radio'
                                name="radio"
                                value="Male"
                                checked={gender === 'Male'}
                                onChange={(e) => handleGender(e.target.value)}
                            />
                                <span className='gender-label-register'>Male</span>
                            </label>
                            <label>
                                <input 
                                    type='radio'
                                    name='radio'
                                    value="Female"
                                    checked={gender === 'Female'}
                                    onChange={(e) => handleGender(e.target.value)}
                                />
                                <span className='gender-label-register'>Female</span>
                            </label>
                        </div>
            
                        <div className='col-md-5 profile-pic-register-container'>
                            <span className='col-md-4 uploadImage-register-label'>Profile Picture</span>
                            <input type="file" onChange={handleImage}/>
                        </div>

                        <div className='col-md-10 studyLoad-pic-register-container'>
                            <span className='col-md-2 uploadImage-register-label'>Study Load</span>
                            <input type="file" onChange={handleStudyLoad}/>
                        </div>

                        <div className='col-md-10 register-customer-btn-container'>
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