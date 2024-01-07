import "./suppliers.css";
import supplierIcon from "../../assets/images/icons/supplier-2.png";
import validIcon from "../../assets/images/icons/accept.png";
import invalidIcon from "../../assets/images/icons/remove.png";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import validationEventEmitter from "../../helpers/ValidationEmitter";
import registerUsersEventEmitter from "../../helpers/RegisterUsersEmitter";

function Suppliers() {
  const [supplier, setSupplier] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [, setDepartments] = useState([]);
  const [selectedDepartments, ] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [, setSupplierValid] = useState<boolean>(false);

  // * Filtered By Status, Departments
  const filteredSuppliers = supplier.filter((customerItem) => {
    const matchesStatus =
      selectedStatus === "All" ||
      (customerItem.isValidate ? "Validated" : "Invalid") === selectedStatus;
    const matchesDepartment =
      selectedDepartments === "All" ||
      customerItem.departmentId === parseInt(selectedDepartments);

    return matchesStatus && matchesDepartment;
  });

  // * Get All Suppliers with Event Emitter
  useEffect(() => {
    const validationRequest = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7017/Users/getSuppliers"
        );
        setSupplier(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const validationListener = () => {
      validationRequest();
    };

    validationEventEmitter.on("validInvalid", validationListener);
    registerUsersEventEmitter.on("registerSupplier", validationListener);
    validationRequest();

    return () => {
      validationEventEmitter.off("validInvalid", validationListener);
      registerUsersEventEmitter.off("registerSupplier", validationListener);
    };
  }, []);

  // * Windows Event Listener Focus
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7017/Users/getSuppliers"
        );
        setSupplier(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // * Get All Departments
  useEffect(() => {
    axios
      .get("https://localhost:7017/Department")
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // * Validation for Suppliers
  const handleValidation = async (
    supplierId: number,
    currentStatus: boolean,
    activeStatus: boolean
  ) => {
    const newValidationStatus = !currentStatus;
    const newIsActive = !activeStatus;

    try {
      const response = await axios.put(
        `https://localhost:7017/Users/validateSupplier/${supplierId}`,
        { isValidate: newValidationStatus, isActive: newIsActive },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSupplierValid(newValidationStatus);
        setSupplierValid(newIsActive);
        validationEventEmitter.emit("validInvalid");
        localStorage.setItem(`supplierStatus_${supplierId}`, JSON.stringify({ isActive: newIsActive }));
        window.location.reload();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Network error or server not responding" || error);
    }
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // * Update Password
  const handleUpdatePassword = async (supplierId) => {
    if (!newPassword) {
      toast.error("New Password must be required");
      return;
    }

    if (!confirmPassword) {
      toast.error("Confirm Password must be required");
      return;
    }

    if (newPassword === confirmPassword) {
      try {
        const response = await axios.put(
          `https://localhost:7017/Users/updateSupplierPassword/${supplierId}`,
          { Password: newPassword },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setNewPassword("");
          setConfirmPassword("");
          validationEventEmitter.emit("validInvalid");
          toast.success("Successfully Updated the Password");
        } else {
          toast.error(`Error: ${response.status} - ${response.data.message}`);
        }
      } catch (error) {
        toast.error(`Network error or server not responding: ${error}`);
      }
    } else {
      toast.error("Passwords do not match");
    }
  };

  // * Reset Modal
  useEffect(() => {
    const modalElement = document.getElementById("supplierInfoModal");

    const handleModalClose = () => {
      setNewPassword("");
      setConfirmPassword("");

      const collapsePermit = document.getElementById("collapsePermit");
      const collapseChangePass = document.getElementById("collapseChangePass");

      if (collapsePermit.classList.contains("show")) {
        collapsePermit.classList.remove("show");
      }

      if (collapseChangePass.classList.contains("show")) {
        collapseChangePass.classList.remove("show");
      }
    };

    modalElement.addEventListener("hidden.bs.modal", handleModalClose);

    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleModalClose);
    };
  }, []);

  return (
    <div className="view-suppliers-main-container">
      <div className="view-supp-header">
        <div className="filter-suppliers-container">
          <h2 style={{ borderRight: "solid 2px", padding: "15px" }}>
            <img className="supp-icon" src={supplierIcon} />
            Suppliers
          </h2>
          <div className="status-filter-container">
            <h3 style={{ marginRight: "30px", color: "#020654" }}>Sort by</h3>
            <label className="supplierStatus-label" htmlFor="status">
              Status:
            </label>
            <select
              style={{ padding: "5px", border: "2px solid white", borderRadius: '10px' }}
              name="supplierStatus"
              id="status"
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="Select Status" disabled selected hidden>
                Select Status
              </option>
              <option value="All">All</option>
              <option value="Validated">Valid</option>
              <option value="Invalid">Invalid</option>
            </select>
          </div>
        </div>
      </div>

      <div className="supplier-list-wrapper">
        {/* SUPPLIERS LIST */}
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th scope="col">Store ID</th>
              <th className="text-center" scope="col">
                Shop
              </th>
              <th className="text-center" scope="col">
                Email
              </th>
              <th className="text-center" scope="col">
                Phone Number
              </th>
              <th className="text-center" scope="col">
                Address
              </th>
              <th className="text-center" scope="col">
                Status
              </th>
              <th className="text-center" scope="col">
                Validation
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplierItem) => (
              <tr key={supplierItem.id}>
                <th
                  scope="row"
                  data-bs-toggle="modal"
                  data-bs-target="#supplierInfoModal"
                  onClick={() => setSelectedSupplier(supplierItem)}
                >
                  {supplierItem.id}
                </th>
                <td
                  className="text-center"
                  data-bs-toggle="modal"
                  data-bs-target="#supplierInfoModal"
                  onClick={() => setSelectedSupplier(supplierItem)}
                >
                  {supplierItem.shopName}
                </td>
                <td
                  className="text-center"
                  data-bs-toggle="modal"
                  data-bs-target="#supplierInfoModal"
                  onClick={() => setSelectedSupplier(supplierItem)}
                >
                  {supplierItem.email}
                </td>
                <td
                  className="text-center"
                  data-bs-toggle="modal"
                  data-bs-target="#supplierInfoModal"
                  onClick={() => setSelectedSupplier(supplierItem)}
                >
                  {supplierItem.phoneNumber}
                </td>
                <td
                  className="text-center"
                  data-bs-toggle="modal"
                  data-bs-target="#supplierInfoModal"
                  onClick={() => setSelectedSupplier(supplierItem)}
                >
                  {supplierItem.address}
                </td>
                <td
                  className="text-center"
                  data-bs-toggle="modal"
                  data-bs-target="#supplierInfoModal"
                  onClick={() => setSelectedSupplier(supplierItem)}
                >
                  {supplierItem.isActive ? "Active" : "Not Active"}
                </td>
                <td className="text-center">
                  <button
                    className={`validation-btn-supp btn btn-sm ${
                      supplierItem.isValidate ? "btn-success" : "btn-danger"
                    }`}
                    onClick={() =>
                      handleValidation(
                        supplierItem.id,
                        supplierItem.isValidate,
                        supplierItem.isActive
                      )
                    }
                  >
                    <img
                      className="validation-icon"
                      src={supplierItem.isValidate ? validIcon : invalidIcon}
                    />
                    {supplierItem.isValidate ? "Valid" : "Invalid"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SUPPLIER INFO MODAL */}
      <div
        className="modal fade"
        id="supplierInfoModal"
        tabIndex={-1}
        aria-labelledby="supplierInfoModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Supplier Details
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedSupplier && (
                <div className="supplier-profile-container">
                  <img
                    className="shop-profile-img"
                    src={`https://localhost:7017/${selectedSupplier.image}`}
                    alt="supplier profile picture"
                  />
                  <div className="supplier-text-info">
                    <h1 style={{ marginBottom: "20px" }}>
                      {selectedSupplier.shopName}
                    </h1>
                    <div className="supplier-info-container">
                      <div className="supplier-info-labels">
                        <h5>Store ID:</h5>
                        <h5>Status:</h5>
                        <h5>Address:</h5>
                        <h5>Email:</h5>
                        <h5>Phone Number:</h5>
                      </div>
                      <div className="supplier-text-2">
                        <h5 className="info-2-supp">{selectedSupplier.id}</h5>
                        <h5 className="info-2-supp">
                          {selectedSupplier.isActive ? "Active" : "Not Active"}
                        </h5>
                        <h5 className="info-2-supp">
                          {selectedSupplier.address}
                        </h5>
                        <h5 className="info-2-supp">
                          {selectedSupplier.email}
                        </h5>
                        <h5 className="info-2-supp">
                          {selectedSupplier.phoneNumber}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* EDIT SUPPLIER COLLAPSE BUTTON */}
              <button
                className="col-md-12 edit-supplier-btn"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapsePermit"
                aria-expanded="false"
                aria-controls="collapseExample"
              >
                View Permits
              </button>
              {selectedSupplier && (
                <div
                  className="collapse"
                  id="collapsePermit"
                  style={{ marginRight: "15px" }}
                >
                  <div className="card card-body">
                    <a
                      className="permits-link"
                      rel="noopener noreferrer"
                      target="_blank"
                      href={`https://localhost:7017/${selectedSupplier.bir}`}
                    >
                      <span>BIR Permit: </span>
                      {selectedSupplier.bir.split("\\").pop()}
                    </a>
                    <a
                      className="permits-link"
                      rel="noopener noreferrer"
                      target="_blank"
                      href={`https://localhost:7017/${selectedSupplier.cityPermit}`}
                    >
                      <span>City Permit: </span>
                      {selectedSupplier.cityPermit.split("\\").pop()}
                    </a>
                    <a
                      className="permits-link"
                      rel="noopener noreferrer"
                      target="_blank"
                      href={`https://localhost:7017/${selectedSupplier.schoolPermit}`}
                    >
                      <span>School Permit: </span>
                      {selectedSupplier.schoolPermit.split("\\").pop()}
                    </a>
                    <a
                      className="permits-link"
                      rel="noopener noreferrer"
                      target="_blank"
                      href={`https://localhost:7017/${selectedSupplier.schoolPermit}`}
                    >
                      <span>Barangay Clearance: </span>
                      {selectedSupplier.barangayClearance.split("\\").pop()}
                    </a>
                    <a
                      className="permits-link"
                      rel="noopener noreferrer"
                      target="_blank"
                      href={`https://localhost:7017/${selectedSupplier.schoolPermit}`}
                    >
                      <span>Valid Id(Front Side): </span>
                      {selectedSupplier.validIdFrontImage.split("\\").pop()}
                    </a>
                    <a
                      className="permits-link"
                      rel="noopener noreferrer"
                      target="_blank"
                      href={`https://localhost:7017/${selectedSupplier.schoolPermit}`}
                    >
                      <span>Valid Id(Back Side): </span>
                      {selectedSupplier.validIdBackImage.split("\\").pop()}
                    </a>
                  </div>
                </div>
              )}
              <button
                className="col-md-12 edit-supplier-btn"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseChangePass"
                aria-expanded="false"
                aria-controls="collapseExample"
              >
                Change Password
              </button>
              {selectedSupplier && (
                <div
                  className="collapse"
                  id="collapseChangePass"
                  style={{ marginRight: "15px" }}
                >
                  <div className="card card-body">
                    <label className="changePassLabel" htmlFor="changePass">
                      New Password
                    </label>
                    <input
                      className="input-changePass"
                      type="password"
                      placeholder="Password must be at least 6 characters long."
                      name="changePass"
                      id="changePass"
                      value={newPassword}
                      onChange={handlePasswordChange}
                    />

                    <label
                      className="changePassLabel"
                      htmlFor="changePass"
                      style={{ marginTop: "10px" }}
                    >
                      Confirm Password
                    </label>
                    <input
                      className="input-changePass"
                      type="password"
                      placeholder="Re-type New Password"
                      name="changePass"
                      id="changePass"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                    />

                    <div className="saveChanges-btn-container">
                      <button
                        className="saveChanges-btn"
                        onClick={() =>
                          handleUpdatePassword(selectedSupplier.id)
                        }
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Suppliers;
