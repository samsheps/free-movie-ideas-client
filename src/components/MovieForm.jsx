import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const MovieForm = ({ fetchMovies }) => {
    const { id } = useParams()
    const navigate = useNavigate()

    const initialMovieState = {
        title: "",
        release_year: 1900,
        info: "",
        director: "",
        watch_location: "",
        genre: 0
    }

    const [movie, updateMovieProps] = useState(initialMovieState)
    const [genres, changeGenres] = useState([])

    const fetchGenres = async () => {
        const response = await fetch("http://localhost:8000/genres", {
            headers: {
                "Authorization": `Token ${JSON.parse(localStorage.getItem("movie_token")).token}`
            }
        })
        const genres = await response.json()
        changeGenres(genres)
    }

    const fetchMovieDetails = async () => {
        if (id) {
            const response = await fetch(`http://localhost:8000/movies/${id}`, {
                headers: {
                    "Authorization": `Token ${JSON.parse(localStorage.getItem("movie_token")).token}`
                }
            })
            const movieData = await response.json()
            updateMovieProps({
                ...movieData,
                genre: movieData.genre.id
            })
        }
    }

    useEffect(() => {
        fetchGenres()
        fetchMovieDetails()
    }, [id])

    const handleSubmit = async (evt) => {
        evt.preventDefault()
        const method = id ? "PUT" : "POST"
        const url = id ? `http://localhost:8000/movies/${id}/` : "http://localhost:8000/movies/"

        await fetch(url, {
            method: method,
            headers: {
                "Authorization": `Token ${JSON.parse(localStorage.getItem("movie_token")).token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(movie)
        })

        await fetchMovies()
        navigate("/movies")
    }

    return (
        <main className="container--login">
            <section>
                <form className="form--login" onSubmit={handleSubmit}>
                    <h1 className="text-3xl">{id ? "Update" : "Add"} Movie</h1>
                    <fieldset className="mt-4">
                        <label htmlFor="title">Title:</label>
                        <input id="title" type="text"
                            onChange={e => {
                                const copy = { ...movie }
                                copy.title = e.target.value
                                updateMovieProps(copy)
                            }}
                            value={movie.title} className="form-control" />
                    </fieldset>
                    <fieldset className="mt-4">
                        <label htmlFor="release_year">Year Released:</label>
                        <input id="release_year" type="number"
                            onChange={e => {
                                const copy = { ...movie }
                                copy.release_year = parseInt(e.target.value)
                                updateMovieProps(copy)
                            }}
                            value={movie.release_year} className="form-control" />
                    </fieldset>
                    <fieldset className="mt-4">
                        <label htmlFor="genre"> Genre </label>
                        <br />
                        <select id="genre" className="form-control"
                            onChange={e => {
                                const copy = { ...movie }
                                copy.genre = parseInt(e.target.value)
                                updateMovieProps(copy)
                            }}
                            value={movie.genre}>
                            <option value={0}>- Select a genre -</option>
                            {
                                genres.map(g => <option
                                    key={`genre-${g.id}`}
                                    value={g.id}>{g.name}</option>)
                            }
                        </select>
                    </fieldset>
                    <fieldset className="mt-4">
                        <label htmlFor="info">Overview:</label>
                        <input id="info" type="text"
                            onChange={e => {
                                const copy = { ...movie }
                                copy.info = e.target.value
                                updateMovieProps(copy)
                            }}
                            value={movie.info} className="form-control" />
                    </fieldset>
                    <fieldset className="mt-4">
                        <label htmlFor="director">Director:</label>
                        <input id="director" type="text"
                            onChange={e => {
                                const copy = { ...movie }
                                copy.director = e.target.value
                                updateMovieProps(copy)
                            }}
                            value={movie.director} className="form-control" />
                    </fieldset>
                    <fieldset className="mt-4">
                        <label htmlFor="watch_location">Where to watch:</label>
                        <input id="watch_location" type="text"
                            onChange={e => {
                                const copy = { ...movie }
                                copy.watch_location = e.target.value
                                updateMovieProps(copy)
                            }}
                            value={movie.watch_location} className="form-control" />
                    </fieldset>
                    <fieldset>
                        <button type="submit" className="button rounded-md bg-blue-700 text-blue-100 p-3 mt-4">
                            {id ? "Update" : "Add"} Movie
                        </button>
                    </fieldset>
                </form>
            </section>
        </main>
    )
}
