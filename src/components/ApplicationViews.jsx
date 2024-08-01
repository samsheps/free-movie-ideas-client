import { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Authorized } from "./Authorized"
import { Login } from "../pages/Login.jsx"
import Home from "../pages/Home"
import { MovieForm } from "./MovieForm.jsx"
import { MovieList } from "./MovieList.jsx"
import { Register } from '../pages/Register.jsx'

export const ApplicationViews = () => {
    const [ownedMovies, setOwnedMovies] = useState([])
    const [likedMovies, setLikedMovies] = useState([])

    // Fetch owned movies
    const fetchMoviesFromAPI = async (showAll) => {
        let url = showAll ? "http://localhost:8000/movies" : "http://localhost:8000/movies?owner=current"
        const response = await fetch(url, {
            headers: {
                Authorization: `Token ${JSON.parse(localStorage.getItem("movie_token")).token}`
            }
        })
        const movies = await response.json()
        setOwnedMovies(movies)
    }

    // Fetch liked movies
    const fetchLikedMovies = async () => {
        const response = await fetch("http://localhost:8000/likedmovies", {
            headers: {
                Authorization: `Token ${JSON.parse(localStorage.getItem("movie_token")).token}`
            }
        })
        const movies = await response.json()
        setLikedMovies(movies)
    }

    // Fetch movies on component mount and when showAll changes
    useEffect(() => {
        fetchMoviesFromAPI()  // Fetch all owned movies
    }, [])

    useEffect(() => {
        fetchLikedMovies()  // Fetch liked movies
    }, [])

    return <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<Authorized />}>
                <Route path="/" element={<Home />} />
                <Route path="/movies" element={<MovieList movies={ownedMovies} fetchMovies={fetchMoviesFromAPI} showAll={true} />} />
                <Route path="/create" element={<MovieForm fetchMovies={fetchMoviesFromAPI} />} />
                <Route path="/movies/update/:id" element={<MovieForm fetchMovies={fetchMoviesFromAPI} />} />
                <Route 
                    path="/mine" 
                    element={
                        <>
                            <h1 className="text-3xl">My Movies</h1>
                            <MovieList movies={ownedMovies} fetchMovies={fetchMoviesFromAPI} showAll={false} />
                            <h2 className="text-2xl mt-6">Liked Movies</h2>
                            <MovieList movies={likedMovies} fetchMovies={fetchLikedMovies} isLiked={true} />
                        </>
                    } 
                />
            </Route>
        </Routes>
    </BrowserRouter>
}
