import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import convertRupiah from 'rupiah-format'

import Navbar from '../components/navbar/Navbar'

import { API } from '../config/api';

const ProductDetail = () => {
    const [theme, setTheme] = useState("dark");
    const toggleTheme = () => {
        setTheme((current) => (current === "dark" ? "light" : "dark"));
    };

    let navigate = useNavigate();
    let { id } = useParams()

    // Fetching product data from database
    let { data: product, refetch } = useQuery("productCache", async () => {
        const config = {
            method: "GET",
            headers: {
                Authorization: "Basic " + localStorage.token,
            },
        };
        const response = await API.get("/product/" + id, config);
        return response.data.data;
    });


    // Create config Snap payment page with useEffect here ...
    useEffect(() => {
        //change this to the script source you want to load, for example this is snap.js sandbox env
        const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
        //change this according to your client-key
        const myMidtransClientKey = "SB-Mid-client-vHbZt8xIeGsE87F0";

        let scriptTag = document.createElement("script");
        scriptTag.src = midtransScriptUrl;
        // optional if you want to set script attribute
        // for example snap.js have data-client-key attribute
        scriptTag.setAttribute("data-client-key", myMidtransClientKey);

        document.body.appendChild(scriptTag);
        return () => {
            document.body.removeChild(scriptTag);
        };
    }, []);

    const handleBuy = async () => {
        try {
            // Get data from product

            const data = {
                idProduct: product.id,
                idSeller: product.user.id,
                price: product.price,
            };
            console.log(product);
            // Data body
            const body = JSON.stringify(data);
            console.log(body);
            // Configuration
            const config = {
                headers: {
                    Authorization: "Basic " + localStorage.token,
                    "Content-type": "application/json",
                },
                body,
            };

            // // Insert transaction data
            const response = await API.post("/transaction", body, config);
            console.log("ini cek response:", response);
            // // Create variabel for store token payment from response here ...
            const token = response.data.payment.token;

            console.log("ini cek token:", token);

            window.snap.pay(token, {
                onSuccess: function (result) {
                    /* You may add your own implementation here */
                    console.log(result);
                    navigate("/profile");
                },
                onPending: function (result) {
                    /* You may add your own implementation here */
                    console.log(result);
                    navigate("/profile");
                },
                onError: function (result) {
                    /* You may add your own implementation here */
                    console.log(result);
                },
                onClose: function () {
                    /* You may add your own implementation here */
                    alert("you closed the popup without finishing the payment");
                },
            });


            // Init Snap for display payment page with token here ...
        } catch (error) {
            console.log(error);
        }
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
                <Navbar />
                <Container className="py-5">
                    <Row>
                        <Col md="2"></Col>
                        <Col md="3">
                            <img src={product?.image} className="img-fluid" />
                        </Col>
                        <Col md="5">
                            <div className="text-header-product-detail">{product?.name}</div>
                            <div className="text-content-product-detail">
                                Stock : {product?.qty}
                            </div>
                            <p className="text-content-product-detail mt-4">{product?.desc}</p>
                            <div className="text-price-product-detail text-end mt-4">
                                {convertRupiah.convert(product?.price)}
                            </div>
                            <div className="d-grid gap-2 mt-5">
                                <Button
                                    onClick={handleBuy}
                                    className="btn btn-buy"
                                >
                                    Buy
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default ProductDetail