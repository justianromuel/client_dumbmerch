import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { UserContext } from "./context/userContext"

import Authentication from "./pages/Authentication";
import Homepages from "./pages/Homepages";
import ProductDetail from "./pages/ProductDetail";
import Product from "./pages/Product";
import EditCategory from "./pages/EditCategory"
import EditProduct from "./pages/EditProduct"
import Profile from "./pages/Profile";
import AdminComplain from "./pages/AdminComplain"
import UserComplain from "./pages/UserComplain"
import AddCategory from "./pages/AddCategory"
import AddProduct from "./pages/AddProduct"
import Category from "./pages/Category"

// Init token on axios every time the app is refreshed
import { API, setAuthToken } from "./config/api"

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  const navigate = useNavigate();
  // Init user context
  const [state, dispatch] = useContext(UserContext);
  // console.clear();
  console.log(state);

  useEffect(() => {
    // Redirect Auth
    if (state.isLogin === false) {
      navigate('/auth');
    } else {
      if (state.user.status === 'admin') {
        navigate('/admin-complain');
      } else if (state.user.status === 'customer') {
        navigate('/');
      }
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const response = await API.get('/check-auth');

      // If the token incorrect
      if (response.status === 404) {
        return dispatch({
          type: 'AUTH_ERROR',
        });
      }

      // Get user data
      let payload = response.data.data.user;
      // Get token from local storage
      payload.token = localStorage.token;

      // Send data to useContext
      dispatch({
        type: 'USER_SUCCESS',
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Homepages />} />
      <Route path="/auth" element={<Authentication />} />
      <Route path="/product-detail/:id" element={<ProductDetail />} />
      <Route path="/user-complain" element={<UserComplain />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin-complain" element={<AdminComplain />} />
      <Route path="/category" element={<Category />} />
      <Route path="/edit-category/:id" element={<EditCategory />} />
      <Route path="/add-category" element={<AddCategory />} />
      <Route path="/product" element={<Product />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/edit-product/:id" element={<EditProduct />} />
    </Routes>

  );
}

export default App;