import React, { useState } from "react";
import { Button, Container, Row, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../components/navbar/NavbarAdmin";
import ProductList from "../components/product/ProductList";
import "./VarCSS.css";

const Products = () => {
    const [theme, setTheme] = useState("dark");
    const toggleTheme = () => {
        setTheme((current) => (current === "dark" ? "light" : "dark"));
    };

    const navigate = useNavigate();
    const AddProduct = () => {
        navigate("/add-product");
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
                <NavbarAdmin />
                <Container>
                    <Row responsive="xs">
                        <Stack direction="horizontal">
                            <div>
                                <h2 className="mt-4 mb-4 headline col">Product List</h2>
                            </div>
                            <div className="ms-auto mt-4 mb-4">
                                <Button variant="dark" className="px-4 py-2" onClick={AddProduct}>
                                    Add
                                </Button>
                            </div>
                        </Stack>
                    </Row>
                    <Row>
                        <ProductList />
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default Products;