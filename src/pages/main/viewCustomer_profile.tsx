import './viewCustomer_profile.css'
import profileImg from "../../assets/images/imageprofile.jpeg"
import editProfIcon from "../../assets/images/icons/editing.png"
import genderIcon from "../../assets/images/icons/gender-fluid.png"
import departmentIcon from "../../assets/images/icons/department.png"
import emailIcon from "../../assets/images/icons/mail-2.png"
import phoneIcon from "../../assets/images/icons/smartphone-call.png"

function ViewCustomer_Profile () {
    return <div className="viewProfile-customer-main-container">
        <div className="profile-details-container">
            <div className="user-details-viewProfile">
                <img className='profileImg' src={ profileImg } alt="" />
                <div className="username-id-container">
                    <h1 className='acc-name'>Sample User Name</h1>
                    <p className='id-number-profile'>#434534535</p>
                </div>
            </div>
            <button className="editProf-btn" type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#editProfCollapse" 
            aria-expanded="false" 
            aria-controls="editProfCollapse">
                <img className='editIconProf' src={ editProfIcon } alt="" />
                    Edit Profile
            </button>
        </div>

        {/* EDIT COLLAPSE */}
        <div className="collapse" id="editProfCollapse"
        style={{ 
            padding: '40px'
         }}>
            <h1>Edit Profile Information</h1>
            <div className="card card-body"
            style={{ 
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly'
             }}>
                <div className="editProf-details-1">
                    <label className='profLabelEdit' htmlFor="profFirstName">First Name</label>
                    <input className='input-prof' type="text" id='profFirstName'></input>

                    <label className='profLabelEdit' htmlFor="profLastName">Last Name</label>
                    <input className='input-prof' type="text" id='profLastName'></input>

                    <label className='profLabelEdit' htmlFor="profDepartment">Department</label>
                    <select name="departmentProf" id="profDepartment"
                    style={{ padding: '10px', border: '2px solid white' }}>
                        <option value="1">College of Computer Studies</option>
                    </select>

                    <label className='profLabelEdit' htmlFor="profGender">Gender</label>
                    <select name="genderProf" id="profGender"
                    style={{ padding: '10px', border: '2px solid white' }}>
                        <option value="1">Female</option>
                    </select>
                </div>

                <div className="editProf-details-2">
                    <label className='profLabelEdit' htmlFor="profEmail">Email</label>
                    <input className='input-prof' type="email" id='profEmail'></input>

                    <label className='profLabelEdit' htmlFor="profPhone">Phone Number</label>
                    <input className='input-prof' type="text" id='profPhone'></input>

                    <label className='profLabelEdit' htmlFor="editPass">Password</label>
                    <input className='input-prof' type="password" name="" id="editPass"></input>

                    <label className='profLabelEdit' htmlFor="confirmPassEdit">Confirm Password</label>
                    <input className='input-prof' type="password" name="" id="confirmPassEdit"></input>
                </div>
            </div>
            <div className="saveChanges-btn-container">
                <button className='editProf-save-btn'>Save Changes</button>
            </div>
        </div>

        <div className="about-user-container">
            <h3
            style={{
                borderBottom: '2px solid #f0f0f0'
            }}>About</h3>
            <div className="about-userInfo-container">
                <div>
                    <h5 className='about-details-prof'>
                        <img className='aboutIcons' src={ genderIcon } alt="" />
                        Gender</h5>
                    <h5 className='about-details-prof'>
                        <img className='aboutIcons' src={ departmentIcon } alt="" />
                        Department</h5>
                    <h5 className='about-details-prof'>
                        <img className='aboutIcons' src={ emailIcon } alt="" />
                        Email</h5>
                    <h5 className='about-details-prof'>
                        <img className='aboutIcons' src={ phoneIcon } alt="" />
                        Phone Number</h5>
                </div>

                <div>
                    <h5 className='about-details-prof'>Female</h5>
                    <h5 className='about-details-prof'>College of Computer Studies</h5>
                    <h5 className='about-details-prof'>SampleEmail@gmail.com</h5>
                    <h5 className='about-details-prof'>09248234234</h5>
                </div>
            </div>
        </div>
    </div>
}

export default ViewCustomer_Profile