import { useContext, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import DumbMerch from "../assets/images/DumbMerch.svg";
import FormLogin from "../components/authentication/FormLogin";
import FormRegister from "../components/authentication/FormRegister";

export default function Authentication() {
    const [theme, setTheme] = useState("dark");
    const toggleTheme = () => {
        setTheme((current) => (current === "dark" ? "light" : "dark"));
    };

    let navigate = useNavigate();

    const [state] = useContext(UserContext);

    const checkAuth = () => {
        if (state.isLogin === true) {
            navigate("/");
        }
    };
    checkAuth();

    const [isRegister, setIsRegister] = useState(false);

    const switchLogin = () => {
        setIsRegister(false);
    };

    const switchRegister = () => {
        setIsRegister(true);
    };

    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    zIndex: '100',
                    left: '10',
                    top: '10',
                }}>
                <div class="form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={toggleTheme} checked={theme === "light"} />
                    <label className="form-check-label" for="flexSwitchCheckDefault">{theme === "dark" ? "Dark Mode" : "Light Mode"}</label>
                </div>
            </div>
            <div className={`${theme}-bg-color`}>
                <Container>
                    <Row className="vh-100 d-flex align-items-center">
                        <Col md="6">
                            <img src={DumbMerch} className="img-fluid" style={{ width: "264px", height: "264px" }} alt="brand" />
                            <div className="text-auth-header mt-4">Easy, Fast and Reliable</div>
                            <p className="text-auth-parag mt-3">
                                Go shopping for merchandise, just go to dumb merch <br /> shopping. the biggest merchandise in{" "}
                                <b>Indonesia</b>
                            </p>
                            <div className="mt-5">
                                <button onClick={switchLogin} className="btn btn-login px-5">
                                    Login
                                </button>
                                <button onClick={switchRegister} className="btn btn-register px-5">
                                    Register
                                </button>
                            </div>
                        </Col>
                        <Col md="6">{isRegister ? <FormRegister /> : <FormLogin />}</Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}
