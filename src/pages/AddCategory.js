import React, { useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../components/navbar/NavbarAdmin'

import { API } from '../config/api';

const AddCategory = () => {
    const [theme, setTheme] = useState("dark");
    const toggleTheme = () => {
        setTheme((current) => (current === "dark" ? "light" : "dark"));
    };

    console.clear();

    let navigate = useNavigate();
    const [category, setCategory] = useState('');

    const title = 'Add Category Admin';
    document.title = 'DumbMerch | ' + title;

    const handleChange = (e) => {
        setCategory(e.target.value);
    };

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();

            // Configuration
            const config = {
                headers: {
                    'Content-type': 'application/json',
                },
            };

            // Data body
            const body = JSON.stringify({ name: category });

            // Insert category data
            const response = await API.post('/category', body, config);

            navigate('/category');
        } catch (error) {
            console.log(error);
        }
    });

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
                <NavbarAdmin title={title} />
                <Container className="py-5">
                    <Row>
                        <Col xs="12">
                            <div className="text-header-category mb-4">Add Category</div>
                        </Col>
                        <Col xs="12">
                            <form onSubmit={(e) => handleSubmit.mutate(e)}>
                                <input
                                    onChange={handleChange}
                                    placeholder="category"
                                    value={category}
                                    name="category"
                                    className="input-edit-category mt-4"
                                />
                                <div className="d-grid gap-2 mt-4">
                                    <Button type="submit" variant="success" size="md">
                                        Add
                                    </Button>
                                </div>
                            </form>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default AddCategory