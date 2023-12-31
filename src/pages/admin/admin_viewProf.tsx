import "./admin_viewProf.css";
import editProfIcon from "../../assets/images/icons/editing.png";
import genderIcon from "../../assets/images/icons/gender-fluid.png";
import emailIcon from "../../assets/images/icons/mail-2.png";
import phoneIcon from "../../assets/images/icons/smartphone-call.png";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";

type ValidationErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  departmentId?: string;
};

type UserProfileType = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  departmentId: string;
  department: {
    department_Name: string;
  };
  gender: string;
  image: string;
};

function Admin_viewProf() {
  const [UserProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const { id } = useParams();

  // * For Delay
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // * Handle Phone Number
  const handlePhoneNumber = (value) => {
    if (/^[0-9]*$/.test(value)) {
      setPhoneNumber(value);
    } else {
      toast.error("Phone Number must contain only numbers.");
    }
  };

  // * Fetch User Data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://localhost:7017/Users/${id}`);
        setUserProfile(response.data);
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setEmail(response.data.email);
        setPhoneNumber(response.data.phoneNumber);
        setGender(response.data.gender);

        console.log(response.data.gender);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [id]);

  // * Validation Trappings
  const validateForm = () => {
    const errors: ValidationErrors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!firstName) {
      errors.firstName = "First Name is required.";
      toast.error(errors.firstName);
    }

    if (!lastName) {
      errors.lastName = "Last Name is required.";
      toast.error(errors.lastName);
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

    if (!gender) {
      errors.gender = "Please select a gender.";
      toast.error(errors.gender);
    }

    return errors;
  };

  // * Update Button Handler
  const HandleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    const errors: ValidationErrors = validateForm();

    if (Object.keys(errors).length === 0) {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("gender", gender);
      formData.append("phoneNumber", phoneNumber);

      try {
        const productResponse = await axios.put(
          `https://localhost:7017/Users/updateProfileAdmin/${id}`,
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
          toast.error(productResponse.data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to Update. Please try again later.");
      }
    }
  };
  
  return (
    <div className="viewProfile-customer-main-container">
      <div className="profile-details-container">
        {UserProfile && (
          <div className="user-details-viewProfile">
            <img
              className="profileImg"
              src={`https://localhost:7017/${UserProfile.image}`}
              alt=""
            />
            <div className="username-id-container">
              <h1 className="acc-name">
                {UserProfile.firstName + " " + UserProfile.lastName}
              </h1>
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
              First Name
            </label>
            <input
              className="input-prof"
              type="text"
              id="profFirstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            ></input>

            <label className="profLabelEdit" htmlFor="profLastName">
              Last Name
            </label>
            <input
              className="input-prof"
              type="text"
              id="profLastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            ></input>
            <label className="profLabelEdit" htmlFor="profGender">
              Gender
            </label>
            <select
              name="genderProf"
              id="profGender"
              style={{ padding: "10px", border: "2px solid white" }}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="Male" selected={gender == "Male"}>
                Male
              </option>
              <option value="Female" selected={gender == "Female"}>
                Female
              </option>
            </select>
          </div>

          <div className="editProf-details-2">
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
              <img className="aboutIcons" src={genderIcon} alt="" />
              Gender
            </h5>
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
              <h5 className="about-details-prof">{UserProfile.gender}</h5>
              <h5 className="about-details-prof">{UserProfile.email}</h5>
              <h5 className="about-details-prof">{UserProfile.phoneNumber}</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin_viewProf;
