import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useMutation, useQuery } from 'react-query';

import NavbarAdmin from '../components/navbar/NavbarAdmin';
import CheckBox from '../components/form/CheckBox'

import { API } from '../config/api';

const EditProduct = () => {
    const [theme, setTheme] = useState("dark");
    const toggleTheme = () => {
        setTheme((current) => (current === "dark" ? "light" : "dark"));
    };

    const title = 'Edit Product admin';
    document.title = 'DumbMerch | ' + title;

    let navigate = useNavigate();
    const { id } = useParams();

    const [categories, setCategories] = useState([]); //Store all category data
    const [categoryId, setCategoryId] = useState([]); //Save the selected category id
    const [preview, setPreview] = useState(null); //For image preview
    const [product, setProduct] = useState({}); //Store product data
    const [form, setForm] = useState({
        image: '',
        name: '',
        desc: '',
        price: '',
        qty: '',
    }); //Store product data

    // Fetching detail product data by id from database
    useQuery('productCache', async () => {
        const response = await API.get('/product/' + id);
        setPreview(response.data.data.image);
        setForm({
            ...form,
            name: response.data.data.name,
            desc: response.data.data.desc,
            price: response.data.data.price,
            qty: response.data.data.qty,
        });
        setProduct(response.data.data);
    });

    // Fetching category data
    useQuery('categoriesCache', async () => {
        const response = await API.get('/categories');
        setCategories(response.data.data);
    });

    // For handle if category selected
    const handleChangeCategoryId = (e) => {
        const id = e.target.value;
        const checked = e.target.checked;

        if (checked) {
            // Save category id if checked
            setCategoryId([...categoryId, parseInt(id)]);
        } else {
            // Delete category id from variable if unchecked
            let newCategoryId = categoryId.filter((categoryIdItem) => {
                return categoryIdItem != id;
            });
            setCategoryId(newCategoryId);
        }
    };

    // Handle change data on form
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.type === 'file' ? e.target.files : e.target.value,
        });

        // Create image url for preview
        if (e.target.type === 'file') {
            // let url = URL.createObjectURL(e.target.files[0]);
            // setPreview(url);
            setPreview(e.target.files)
        }
    };

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();

            // Configuration
            const config = {
                headers: {
                    'Content-type': 'multipart/form-data',
                    Authorization: "Basic " + localStorage.token,
                },
            };

            // Store data with FormData as object
            const formData = new FormData();
            if (preview) {
                formData.set('image', preview[0], preview[0]?.name);
            }
            // if (form.image) {
            //     formData.set('image', form?.image[0], form?.image[0]?.name);
            // }
            formData.set('name', form.name);
            formData.set('desc', form.desc);
            formData.set('price', form.price);
            formData.set('qty', form.qty);
            formData.set('categoryId', categoryId);

            // Insert product data
            const response = await API.patch(
                '/product/' + product.id,
                formData,
                config
            );
            console.log(response.data);

            navigate('/product');
        } catch (error) {
            console.log(error);
        }
    });

    useEffect(() => {
        const newCategoryId = product?.categories?.map((item) => {
            return item.id;
        });

        setCategoryId(newCategoryId);
    }, [product]);

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
                            <div className="text-header-category mb-4">Update Product</div>
                        </Col>
                        <Col xs="12">
                            <form onSubmit={(e) => handleSubmit.mutate(e)}>
                                {preview && (
                                    <div>
                                        <img
                                            src={preview}
                                            style={{
                                                maxWidth: '150px',
                                                maxHeight: '150px',
                                                objectFit: 'cover',
                                            }}
                                            alt="preview"
                                        />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="upload"
                                    name="image"
                                    hidden
                                    onChange={handleChange}
                                />
                                <label for="upload" className="label-file-add-product">
                                    Upload file
                                </label>
                                <input
                                    type="text"
                                    placeholder="Product Name"
                                    name="name"
                                    onChange={handleChange}
                                    value={form?.name}
                                    className="input-edit-category mt-4"
                                />
                                <textarea
                                    placeholder="Product Desc"
                                    name="desc"
                                    onChange={handleChange}
                                    value={form?.desc}
                                    className="input-edit-category mt-4"
                                    style={{ height: '130px' }}
                                ></textarea>
                                <input
                                    type="number"
                                    placeholder="Price (Rp.)"
                                    name="price"
                                    onChange={handleChange}
                                    value={form?.price}
                                    className="input-edit-category mt-4"
                                />
                                <input
                                    type="number"
                                    placeholder="Stock"
                                    name="qty"
                                    onChange={handleChange}
                                    value={form?.qty}
                                    className="input-edit-category mt-4"
                                />

                                <div className="card-form-input mt-4 px-2 py-1 pb-2">
                                    <div
                                        className="text-secondary mb-1"
                                        style={{ fontSize: '15px' }}
                                    >
                                        Category
                                    </div>
                                    {product &&
                                        categories?.map((item, index) => (
                                            <label key={index} className="checkbox-inline me-4">
                                                <CheckBox
                                                    categoryId={categoryId}
                                                    value={item?.id}
                                                    handleChangeCategoryId={handleChangeCategoryId}
                                                />
                                                <span className="ms-2">{item?.name}</span>
                                            </label>
                                        ))}
                                </div>

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

export default EditProduct