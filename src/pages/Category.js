import React, { useEffect, useState } from 'react'

import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import NavbarAdmin from '../components/navbar/NavbarAdmin';
import DeleteButton from '../components/modal/DeleteButton';

import imgEmpty from '../assets/images/empty.svg'

import { API } from '../config/api';

const Category = () => {
    const [theme, setTheme] = useState("dark");
    const toggleTheme = () => {
        setTheme((current) => (current === "dark" ? "light" : "dark"));
    };

    let navigate = useNavigate();

    const title = 'Category Admin';
    document.title = 'DumbMerch | ' + title;

    // Create variabel for id product and confirm delete data with useState here ...
    // Variabel for delete product data
    const [idDelete, setIdDelete] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    // Create init useState & function for handle show-hide modal confirm here ...
    // Modal Confirm delete data
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let { data: categories, refetch } = useQuery('categoriesCache', async () => {
        const response = await API.get('/categories');
        return response.data.data;
    });

    const addCategory = () => {
        navigate('/add-category');
    };

    const handleEdit = (id) => {
        navigate(`/edit-category/${id}`);
    };

    // Create function handle get id product & show modal confirm delete data here ...
    // For get id product & show modal confirm delete data
    const handleDelete = (id) => {
        setIdDelete(id);
        handleShow();
    };

    // Create function for handle delete product here ...
    // If confirm is true, execute delete data
    const deleteById = useMutation(async (id) => {
        try {
            await API.delete(`/category/${id}`);
            refetch();
        } catch (error) {
            console.log(error);
        }
    });
    // Call function for handle close modal and execute delete data with useEffect here ...
    useEffect(() => {
        if (confirmDelete) {
            // Close modal confirm delete data
            handleClose();
            // execute delete data by id function
            deleteById.mutate(idDelete);
            setConfirmDelete(null);
        }
    }, [confirmDelete]);

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
                        <Col>
                            <div className="text-header-category mb-4">List Category</div>
                        </Col>
                        <Col className="text-end">
                            <Button
                                onClick={addCategory}
                                className="btn-dark"
                                style={{ width: '100px' }}
                            >
                                Add
                            </Button>
                        </Col>
                        <Col xs="12">
                            {categories?.length !== 0 ? (
                                <Table striped hover size="lg" variant="dark">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Category Name</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories?.map((item, index) => (
                                            <tr key={index}>
                                                <td width="10%" className="align-middle">
                                                    {index + 1}
                                                </td>
                                                <td width="60%" className="align-middle">
                                                    {item.name}
                                                </td>
                                                <td width="30%">
                                                    <Button
                                                        onClick={() => {
                                                            handleEdit(item.id);
                                                        }}
                                                        className="btn-sm btn-success me-2"
                                                        style={{ width: '135px' }}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            handleDelete(item.id);
                                                        }}
                                                        className="btn-sm btn-danger"
                                                        style={{ width: '135px' }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <div className="text-center pt-5">
                                    <img
                                        src={imgEmpty}
                                        className="img-fluid"
                                        style={{ width: '40%' }}
                                        alt="empty"
                                    />
                                    <div className="mt-3">No data category</div>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Container>
                <DeleteButton
                    setConfirmDelete={setConfirmDelete}
                    show={show}
                    handleClose={handleClose}
                />
            </div>
        </>
    )
}

export default Category