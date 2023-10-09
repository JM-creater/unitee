import { useState } from "react";
import Register from "./register";
import RegisterSupplier from "./register_supplier";
import studentPic from "../../src/assets/images/studentRole.png"
import supplierPic from "../../src/assets/images/supplierRole.png"
import "./accountType.css"

// const buttonStyle = {
//     backgroundColor: "#0074d9",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     padding: "10px 20px",
//     fontSize: "16px",
//     cursor: "pointer",
//     margin: "5px",
// };

// const backButtonStyle = {
//     position: "absolute",
//     top: "10px",
//     left: "10px",
//     backgroundColor: "#0074d9",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     padding: "10px 20px",
//     fontSize: "16px",
//     cursor: "pointer",
// };

function AccountType() {
    const [formToShow, setFormToShow] = useState('');

    const handleBackClick = () => {
        setFormToShow(''); // Clear the formToShow state to go back to the initial state
    };

    return (
        <div className="col-md-12 role-main-container">
            <div className="col-md-6 role-1">
                <img className="student-pic" src={ studentPic } alt="" />
                <h1 className="role-text-1">Register as Customer</h1>
            </div>
            <div className="col-md-6 role-2">
                <img className="supplier-pic" src={ supplierPic } alt="" />
                <h1 className="role-text-2">Register as Supplier</h1>
            </div>
        </div>
    //     <div style={{ position: "relative" }}>
    //         {formToShow && (
    //             <button
    //                 style={backButtonStyle}
    //                 onClick={handleBackClick}
    //             >
    //                 Back
    //             </button>
    //         )}

    //         <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
    //             {!formToShow && (
    //                 <>
    //                     <button
    //                         style={buttonStyle}
    //                         onClick={() => setFormToShow('customer')}
    //                     >
    //                         Register as Customer
    //                     </button>

    //                     <button
    //                         style={buttonStyle}
    //                         onClick={() => setFormToShow('supplier')}
    //                     >
    //                         Register as Supplier
    //                     </button>
    //                 </>
    //             )}

    //             {formToShow === 'customer' && <Register />}
    //             {formToShow === 'supplier' && <RegisterSupplier />}
    //         </div>
    //     </div>
    // );
    )
}

export default AccountType;
