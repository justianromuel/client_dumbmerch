import { useContext, useState } from "react";
import { UserContext } from "../../context/userContext"
import { useNavigate } from "react-router-dom"
import { Alert } from "react-bootstrap";
import { useMutation } from "react-query";

import { API } from "../../config/api"

export default function FormLogin() {
    let navigate = useNavigate();

    const title = 'Login'
    document.title = 'DumbMerch | ' + title

    const [state, dispatch] = useContext(UserContext)
    // console.log(state);

    const [message, setMessage] = useState(null)

    // Create variabel for store data with useState here ...
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const { email, password } = form

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    // Create function for handle insert data process with useMutation here ...
    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();

            // Configuration Content-type
            const config = {
                headers: {
                    'Content-type': 'application/json',
                },
            };

            // Data body
            const body = JSON.stringify(form);

            // Insert data user to database
            const response = await API.post('/login', body, config);
            // console.log(response);

            // Checking process
            if (response.status === 200) {
                // Send data to useContext
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: response.data.data
                })
            }

            // Status check
            if (response.data.data.status === 'admin') {
                navigate('/admin-complain')
            } else {
                navigate('/')
            }

            const alert = (
                <Alert variant="success" className="py-1">
                    Login success
                </Alert>
            );
            setMessage(alert)

            // Handling response here
        } catch (error) {
            const alert = (
                <Alert variant="danger" className="py-1">
                    Failed
                </Alert>
            );
            setMessage(alert);
            console.log(error);
        }
    })

    return (
        <div className="d-flex justify-content-center">
            <div className="card-auth p-4">
                <div
                    style={{ fontSize: '36px', lineHeight: '49px', fontWeight: '700' }}
                    className="mb-3"
                >
                    Login
                </div>
                {message && message}
                <form onSubmit={(e) => handleSubmit.mutate(e)}>
                    <div className="mt-3 form">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            name="email"
                            onChange={handleChange}
                            className="px-3 py-2 mt-3"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            name="password"
                            onChange={handleChange}
                            className="px-3 py-2 mt-3"
                        />
                    </div>
                    <div className="d-grid gap-2 mt-5">
                        <button className="btn btn-login">Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}