import React, { createContext, useState } from 'react'
import Authentication from './Authentication'
import FormLogin from '../components/authentication/FormLogin'

export const ThemeContext = createContext(null);

const Login = () => {
    const [theme, setTheme] = useState("light");

    const toggleTheme = () => {
        setTheme((current) => (current === "dark" ? "light" : "dark"));
    };
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div id={theme} className='container'>
                <div className='row'>
                    {/* switch */}
                    <div class="form-check form-switch">
                        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={toggleTheme} checked={theme === "light"} />
                        <label className="form-check-label" for="flexSwitchCheckDefault">{theme === "dark" ? "Dark Mode" : "Light Mode"}</label>
                    </div>
                    <div className='col-md-6'>
                        <Authentication />
                    </div>
                    <div className="col-md-6">
                        <FormLogin />
                    </div>
                </div>
            </div>
        </ThemeContext.Provider>
    )
}

export default Login