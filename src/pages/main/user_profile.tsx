//import profile from "../../assets/images/imageprofile.jpeg"
import edit from "../../assets/images/icons/edit.png"
import './user_profile.css'
import { useState, useEffect } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";

function User_Profile () {

  interface Customer {
    departmentId(departmentId: unknown): import("react").ReactNode;
    image: string;
    id: number;
    firstName: string;
    lastName: string;
    gender: string;
    department: string;
    phoneNumber: string;
    email: string;
    password: string;
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

    return <div className="user-profile-main-container">
        <div className="col-md-10 details-container">
          {customer ? (
              <>
                  <div className="col-md-3 user-img-container">
                      <img className="imgProfile" src={`https://localhost:7017/${customer.image}`} />
                  </div>
                  <div className="col-md-8 user-info-container">
                      <div className="col-md-4 info-1">
                          <h4 className="info-label">ID Number:</h4>
                          <h4 className="info-label">First Name:</h4>
                          <h4 className="info-label">Last Name:</h4>
                          <h4 className="info-label">Gender:</h4>
                          <h4 className="info-label">Department:</h4>
                          <h4 className="info-label">Phone Number:</h4>
                          <h4 className="info-label">Email:</h4>
                          <h4 className="info-label">Password:</h4>
                      </div>
                      <div className="col-md-7 info-2">
                          <h4 className="info-text">{customer.id}</h4>
                          <h4 className="info-text">{customer.firstName}</h4>
                          <h4 className="info-text">{customer.lastName}</h4>
                          <h4 className="info-text">{customer.gender}</h4>
                          <h4 className="info-text">{getDepartmentName(customer.departmentId)}</h4>
                          <h4 className="info-text">{customer.phoneNumber}</h4>
                          <h4 className="info-text">{customer.email}</h4>
                          <h4 className="info-text">{customer.password.replace(/./g, '*')}</h4>
                      </div>
                      <div className="col-md-3 edit-btn-container">
                          <button className="edit-prof-btn" data-bs-toggle="modal" data-bs-target="#editProfileModal">
                              <img src={edit} style={{ paddingRight:'5px', width:'100%', maxWidth:'20px' }}/>
                              Edit Profile
                          </button>
                      </div>
                  </div>
              </>
          ) : null}
        </div>

        <div className="edit-profile-modal modal fade" id="editProfileModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="editSupplierDetailsModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
    <div className="modal-content" style={{ backgroundColor:'#ffff' }}>
      <div className="modal-header">
        <h3 className='modal-supplier-title'>Edit User Details</h3>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className='col-md-12 row'>
      <div className="modal-body">
        <div style={{ display:'flex', flexFlow:'row' }}>
        <div className="col-md-12 supplier-details-container">
            <div className="col-md-3">
                <label className="form-label">ID Number</label>
                <input type="number" className="form-control" id="exampleFormControlInput1"/>
                <label className="form-label">First Name</label>
                <input type="text" className="form-control" id="exampleFormControlInput1"/>
                <label className="form-label">Last Name</label>
                <input type="text" className="form-control" id="exampleFormControlInput1"/>
                <label className="form-label">Phone Number</label>
                <input type="number" className="form-control" id="exampleFormControlInput1"/>
                </div>

                <div className="col-md-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com"/>
                <label className="form-label">Password</label>
                <input type="password" className="form-control" id="exampleFormControlInput1"/>
                <label className="form-label">Confirm Password</label>
                <input type="password" className="form-control" id="exampleFormControlInput1"/>
                <div style={{ marginTop:'15px' }}>
                <label className="col-md-8 form-label">Profile Picture</label>
                <input className="upload-profile-btn" type="file" accept="image/png, image/jpg, image/gif, image/jpeg, image/heic"/>
                </div>
             
            </div>         
    </div>
        </div>
      </div>
      </div>
      <div className="modal-footer">
       <div>
       <button className="save-prof-Btn">
            Save
            </button>
       </div>
      </div>
    </div>
  </div>
</div>
    </div>
}

export default User_Profile