import React, { useState } from 'react'


const ThemeMode = () => {
    const [theme, setTheme] = useState("dark");

    const toggleTheme = () => {
        setTheme((current) => (current === "dark" ? "light" : "dark"));
    };
    return (
        <div
            style={{
                position: 'fixed',
                left: '10',
                top: '10',
            }}>
            <div class="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={toggleTheme} checked={theme === "light"} />
                <label className="form-check-label" for="flexSwitchCheckDefault">{theme === "dark" ? "Dark Mode" : "Light Mode"}</label>
            </div>
        </div>
    )
}

export default ThemeMode




// export const lightTheme = {
//     body: '#FFF',
//     text: '#363537',
//     toggleBorder: '#FFF',
//     background: '#363537',
// }
// export const darkTheme = {
//     body: '#363537',
//     text: '#FAFAFA',
//     toggleBorder: '#6B8096',
//     background: '#999',
// }