import React from 'react'
import { useState } from 'react'
import Navbar from '../components/navigation/Navbar';
import { RenderMenu } from '../components/structure/RenderNavigation';

const AuthContext = createContext();
export const AuthData = () => useContext(AuthContext);

const AuthWrapper = () => {

    const [user, setUser] = useState({name: "", isAuthenticated: false})

    const login = (userName, password) => {

        return new Promise((resolve, reject) => {

            if(password === "password")
            {
                setUser({name: userName, isAuthenticated: true})
                resolve("success")
            }
            else 
            {
                reject("Incorrect Password")
            }
        })
    }

    const logout = () => {
        setUser({...user, isAuthenticated:false})
    }


    return (
        <AuthContext.Provider value={{user, login, logout}}>
            <>
                <RenderMenu/>
            </>
        </AuthContext.Provider>
    )
}

export default AuthWrapper;
