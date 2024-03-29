import "./login.css";
import React, { useState } from "react";
import illustration from "../../src/assets/images/loginPic.png";
import logo from "../../src/assets/images/unitee.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingGif from "../assets/images/icons/loadingscreen.svg";
import { useNavigate } from "react-router-dom";

function Confirmation_Code() {

    const [confirmEmail, setConfirmEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // * For Delay
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    const handleConEmail = (value: string) => {
        setConfirmEmail(value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleConfirmEmail();
        }
    };

    // * Check if the email is confirmed
    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     if (!token) {
    //         navigate('/');
    //     }
    // }, [navigate]);

    // * Confirm Email
    const handleConfirmEmail = async () => {
        //const id = localStorage.getItem("Id");
        if (!confirmEmail) {
            toast.error("Confirmation code is required.");
            return;
        }

        try {
            const response = await fetch("https://localhost:7017/Users/confirm-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ConfirmationCode: confirmEmail }),
            });

        if (response.ok) {
            try {
                const data = await response.json();
                toast.success("Confirmation Successful.", data);

                if (data && data.role) {
                    switch (data.role) {
                        case 1:
                            setIsLoading(true);
                            await sleep(500);
                            navigate(`/shop/${data.id}`);
                            break;
                        case 2:
                            setIsLoading(true);
                            await sleep(500);
                            navigate(`/supplier_dashboard/${data.id}`);
                            break;
                        default:
                            toast.error("Unknown user role.");
                            break;
                    }
                } else {
                    toast.error("User role not provided.");
                }
            } catch (e) {
                toast.success("Confirmation Successful.");
            }
        } else {
            try {
                const errorData = await response.json();
                toast.error(errorData.message);
            } catch (error) {
                toast.error("An error occurred while confirming email.", error);
            }
        }
        } catch (error) {
            console.error("An error occurred: ", error);
            toast.error("An error occurred while confirming email.");
        }
    };


    return (
        <React.Fragment>
            {isLoading ? (
                <div className="mainloading-screen">
                    <img className="mainloading-bar" src={LoadingGif} alt="loading..." />
                </div>
            ) : (
            <div className="col-md-12 main-container row">
                    <div className="col-md-7 login-1-container">
                        <img className="web-logo" src={logo} alt="" />
                            <h3 className="text">
                                Find clothes that suits you and your course.
                            </h3>
                        <img className="stud-img" src={illustration} alt="" />
                    </div>
                <div className="col-md-5 login-2-container">
                    <h1 className="login-title">Confirmation Email</h1>
                    <h4 className="login-text">Enter your confirmation code</h4>
                    <input
                        className="col-md-7 input-login"
                        type="text"
                        placeholder="Enter code"
                        value={confirmEmail}
                        onChange={(e) => handleConEmail(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    <button className="col-md-7 login-btn" onClick={handleConfirmEmail}>
                        Confirm
                    </button>
                </div>
            </div>
            )}
        </React.Fragment>
    );
}

export default Confirmation_Code;
