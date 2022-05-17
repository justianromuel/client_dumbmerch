import React, { useContext, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import dateFormat from 'dateformat'
import convertRupiah from 'rupiah-format'
import { useQuery } from 'react-query'
import Navbar from '../components/navbar/Navbar'
import Logo from '../assets/images/Logo.png'
import { UserContext } from '../context/userContext'
import ProfileUnknown from '../assets/images/ProfileUnknown.png'
import { API } from '../config/api'

const Profile = () => {
    const [theme, setTheme] = useState("dark");
    const toggleTheme = () => {
        setTheme((current) => (current === "dark" ? "light" : "dark"));
    };

    const title = "Profile";
    document.title = "DumbMerch | " + title;

    const [state] = useContext(UserContext);

    // Fetching profile data from database
    let { data: profile, refetch: profileRefetch } = useQuery(
        "profileCache",
        async () => {
            const config = {
                headers: {
                    Authorization: "Basic " + localStorage.token,
                },
            };
            const response = await API.get("/profile", config);
            return response.data.data;
        }
    );

    // Fetching transactions data from database
    let { data: transactions, refetch: transactionsRefetch } = useQuery(
        "transactionsCache",
        async () => {
            const config = {
                headers: {
                    Authorization: "Basic " + localStorage.token,
                },
            };
            const response = await API.get("/transactions", config);
            console.log("CEK TRANSAKSI:", response.data);
            return response.data.data;
        }
    );

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
                <Navbar title={title} />
                <Container className="my-5">
                    <Row>
                        <Col md="6">
                            <div className="text-header-product mb-4">My Profile</div>
                            <Row>
                                <Col md="6">
                                    <img
                                        src={ProfileUnknown}
                                        className="img-fluid rounded"
                                        alt="profile"
                                    />
                                </Col>
                                <Col md="6">
                                    <div className="profile-header">Name</div>
                                    <div className="profile-content">{state.user.name}</div>

                                    <div className="profile-header">Email</div>
                                    <div className="profile-content">{state.user.email}</div>

                                    <div className="profile-header">Phone</div>
                                    <div className="profile-content">
                                        {profile?.phone ? profile?.phone : "-"}
                                    </div>

                                    <div className="profile-header">Gender</div>
                                    <div className="profile-content">
                                        {profile?.gender ? profile?.gender : "-"}
                                    </div>

                                    <div className="profile-header">Address</div>
                                    <div className="profile-content">
                                        {profile?.address ? profile?.address : "-"}
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col md="6">
                            <div className="text-header-product mb-4">My Transaction</div>
                            {transactions?.length > 0 ? (
                                <>
                                    {transactions?.map((item) => (
                                        <div style={{ background: "#303030" }} className="p-2 mb-1">
                                            <Container fluid className="px-1">
                                                <Row>
                                                    <Col xs="3">
                                                        <img
                                                            src={item.product.image}
                                                            alt="img"
                                                            className="img-fluid"
                                                            style={{
                                                                height: "120px",
                                                                width: "170px",
                                                                objectFit: "cover",
                                                            }}
                                                        />
                                                    </Col>
                                                    <Col xs="6">
                                                        <div
                                                            style={{
                                                                fontSize: "18px",
                                                                color: "#F74D4D",
                                                                fontWeight: "500",
                                                                lineHeight: "19px",
                                                            }}
                                                        >
                                                            {item.product.name}
                                                        </div>
                                                        <div
                                                            className="mt-2"
                                                            style={{
                                                                fontSize: "14px",
                                                                color: "#F74D4D",
                                                                fontWeight: "300",
                                                                lineHeight: "19px",
                                                            }}
                                                        >
                                                            {dateFormat(item.createdAt, "dddd, d mmmm yyyy")}
                                                        </div>

                                                        <div
                                                            className="mt-3"
                                                            style={{
                                                                fontSize: "14px",
                                                                fontWeight: "300",
                                                            }}
                                                        >
                                                            Price : {convertRupiah.convert(item.price)}
                                                        </div>

                                                        <div
                                                            className="mt-3"
                                                            style={{
                                                                fontSize: "14px",
                                                                fontWeight: "700",
                                                            }}
                                                        >
                                                            Sub Total : {convertRupiah.convert(item.price)}
                                                        </div>
                                                    </Col>
                                                    <Col xs="3">
                                                        <div
                                                            className={`status-transaction-${item.status} rounded h-100 d-flex align-items-center justify-content-center`}
                                                        >
                                                            {item.status}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="no-data-transaction">No transaction</div>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default Profile