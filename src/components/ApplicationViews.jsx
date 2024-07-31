import { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Authorized } from "./Authorized"
import { Login } from "../pages/Login.jsx"
import Home from "../pages/Home"
import { MovieForm } from "./MovieForm.jsx"
import { MovieList } from "./MovieList.jsx"
import { Register } from '../pages/Register.jsx'


export const ApplicationViews = () => {
    const [movieState, setMovieState] = useState([{
        "id": 1,
        "title": "EMA",
        "release_year": 2019,
        "info": "A woman navigates a tumultuous relationship and a difficult adoption process.",
        "director": "Pablo Larraín",
        "watch_location": "Hulu",
        "genre": {
            "id": 1,
            "name": "Drama"
        }
    }])

const fetchMoviesFromAPI = async (showAll) => {
    let url = "http://localhost:8000/movies"

    if (showAll !== true) {
        url = "http://localhost:8000/movies?owner=current"
    }
    const response = await fetch(url,
        {
            headers: {
                Authorization: `Token ${JSON.parse(localStorage.getItem("movie_token")).token}`
            }
        })
    const movies = await response.json()
    setMovieState(movies)
}
// this code isn't actually running at this point 

return <BrowserRouter>
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Authorized />}>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<MovieList movies={movieState} fetchMovies={fetchMoviesFromAPI} showAll={true} />} />
            <Route path="/create" element={<MovieForm fetchMovies={fetchMoviesFromAPI} />} />
            <Route path="/movies/update/:id" element={<MovieForm fetchMovies={fetchMoviesFromAPI} />} />
            <Route path="/mine" element={<MovieList movies={movieState} fetchMovies={fetchMoviesFromAPI} showAll={false} />} />
        </Route>
    </Routes>
</BrowserRouter>
}