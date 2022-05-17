import React, { useContext, useState } from 'react'
import Masonry from 'react-masonry-css';
import { Col, Container, Row } from 'react-bootstrap'
import { useQuery } from 'react-query';

import Navbar from '../components/navbar/Navbar'
import ProductCard from '../components/card/ProductCard';
import imgEmpty from '../assets/images/empty.svg';

import { API } from '../config/api';
import { UserContext } from '../context/userContext';

const Homepages = () => {
    const [theme, setTheme] = useState("dark");
    const toggleTheme = () => {
        setTheme((current) => (current === "dark" ? "light" : "dark"));
    };

    const title = 'Shop';
    document.title = 'DumbMerch | ' + title;

    const [state] = useContext(UserContext);

    console.log(state);

    let { data: products, refetch } = useQuery('productsCache', async () => {
        const response = await API.get('/products');
        return response.data.data;
    });

    console.log(products);

    const breakpointColumnsObj = {
        default: 6,
        1100: 4,
        700: 3,
        500: 2,
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
                <Navbar title={title} />
                <Container className="mt-5">
                    <Row>
                        <Col>
                            <div className="text-header-product">Product</div>
                        </Col>
                    </Row>
                    <Row className="my-4">
                        {products?.length !== 0 ? (
                            <Masonry
                                breakpointCols={breakpointColumnsObj}
                                className="my-masonry-grid"
                                columnClassName="my-masonry-grid_column"
                            >
                                {products?.map((item, index) => (
                                    <ProductCard item={item} key={index} />
                                ))}
                            </Masonry>
                        ) : (
                            <Col>
                                <div className="text-center pt-5">
                                    <img
                                        src={imgEmpty}
                                        className="img-fluid"
                                        style={{ width: '40%' }}
                                        alt="empty"
                                    />
                                    <div className="mt-3">No data product</div>
                                </div>
                            </Col>
                        )}
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default Homepages