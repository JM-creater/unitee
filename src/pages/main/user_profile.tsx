//import profile from "../../assets/images/imageprofile.jpeg"
//import edit from "../../assets/images/icons/edit.png"
import './user_profile.css'
import { useState, useEffect } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";

function User_Profile () {  
  
  interface Customer {
    firstName: string;
    lastName: string;
    departmentId: number;
    email: string;
    phoneNumber: string;
    gender: string;
    image: string;
  }

  const [customer, setCustomer] = useState<Customer | null>(null); 
  const [departments, setDepartments] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`https://localhost:7017/Users/${id}`)
      .then(response => {
        setCustomer(response.data);
      })
      .catch(error => {
        console.error(error);
      })
  }, [id]);

      useEffect(() => {
        axios.get('https://localhost:7017/Department')
            .then(res => {
                setDepartments(res.data);
            })
            .catch((err) => {console.error(err)
        });
    }, []);

    // Get Department Names
    const getDepartmentName = (departmentId) => {
      const department = departments.find(d => d.departmentId === departmentId);
      return department ? department.department_Name : 'Unknown Department';
  };

    return (
      <div className="container container-fluid my-profile-container">
            <h2 className="mt-5 ml-5">My Profile</h2>
            {customer ? ( 
              <div className="row justify-content-around mt-5 user-info">
                  <div className="col-12 col-md-3">
                      <figure className="avatar avatar-profile">
                        <img
                          className="rounded-circle img-fluid"
                          src={`https://localhost:7017/${customer.image}`}
                          alt=""
                          style={{
                            width: '200px',
                            height: '200px',
                            objectFit: 'cover', 
                            maxWidth: '100%', 
                          }}
                        />
                      </figure>
                      <a href="#" id="edit_profile" className="btn btn-primary btn-block my-5">
                          Edit Profile
                      </a>
                  </div>
                  <div className="col-12 col-md-5">
                      <h4>Full Name</h4>
                      <p>{customer.firstName} {customer.lastName}</p>

                      <h4>Department</h4>
                      <p>{getDepartmentName(customer.departmentId)}</p>

                      <h4>Email Address</h4>
                      <p>{customer.email}</p>

                      <h4>Phone Number</h4>
                      <p>{customer.phoneNumber}</p>

                      <h4>Gender</h4>
                      <p>{customer.gender}</p>

                      <a href={`/shop/${id}/cart`} className="btn btn-danger btn-block mt-5">
                          My Cart
                      </a>

                      <a href="#" className="btn btn-primary btn-block mt-3">
                          Change Password
                      </a>
                  </div>
              </div>
            ) : null}
        </div>
    )
}

export default User_Profile