import { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Authorized } from "./Authorized"
import { Login } from "../pages/Login.jsx"
import Home from "../pages/Home"
import { RockForm } from "./RockForm.jsx"
import { RockList } from "./RockList.jsx"
import { Register } from '../pages/Register.jsx'


export const ApplicationViews = () => {
    const [rocksState, setRocksState] = useState([{
        id: 1,
        name: "Sample",
        type: {
            id: 1,
            label: "Volcanic"
        }, 
        user: {
            first_name: "sarah",
            last_name: "bobearah"
        }
    }])

    const fetchRocksFromAPI = async (showAll) => {
        let url = "http://localhost:8000/rocks"

        if (showAll !== true) {
            url = "http://localhost:8000/rocks?owner=current"
        }
        const response = await fetch(url,
            {
                headers: {
                    Authorization: `Token ${JSON.parse(localStorage.getItem("rock_token")).token}`
                }
            })
        const rocks = await response.json()
        setRocksState(rocks)
    }
// this code isn't actually running at this point 

    return <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<Authorized />}>
                <Route path="/" element={<Home />} />
                <Route path="/allrocks" element={<RockList rocks={rocksState} fetchRocks={fetchRocksFromAPI} showAll={true} />} />
                <Route path="/create" element={<RockForm fetchRocks={fetchRocksFromAPI} />} />
                <Route path="/mine" element={<RockList rocks={rocksState} fetchRocks={fetchRocksFromAPI} showAll={false} />} />
            </Route>
        </Routes>
    </BrowserRouter>
}