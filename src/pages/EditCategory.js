import React, { useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'

import NavbarAdmin from '../components/navbar/NavbarAdmin'

import { API } from '../config/api'

const EditCategory = () => {
    const [theme, setTheme] = useState("dark");
    const toggleTheme = () => {
        setTheme((current) => (current === "dark" ? "light" : "dark"));
    };

    const title = 'Edit Category Admin';
    document.title = 'DumbMerch | ' + title;

    let navigate = useNavigate();
    const { id } = useParams();
    const [category, setCategory] = useState({ name: '' });

    useQuery('categoryCache', async () => {
        const response = await API.get('/category/' + id);
        setCategory({ name: response.data.data.name });
    });

    const handleChange = (e) => {
        setCategory({
            ...category,
            name: e.target.value,
        });
    };

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();

            const config = {
                headers: {
                    'Content-type': 'application/json',
                },
            };

            const body = JSON.stringify(category);

            const response = await API.patch('/category/' + id, body, config);

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
                            <div className="text-header-category mb-4">Edit Category</div>
                        </Col>
                        <Col xs="12">
                            <form onSubmit={(e) => handleSubmit.mutate(e)}>
                                <input
                                    onChange={handleChange}
                                    value={category.name}
                                    placeholder="category"
                                    className="input-edit-category mt-4"
                                />
                                <div className="d-grid gap-2 mt-4">
                                    <Button type="submit" variant="success" size="md">
                                        Save
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

export default EditCategory