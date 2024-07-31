import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const MovieForm = ({ fetchMovies }) => {
    const initialMovieState = {
        "title": "",
        "release_year": 1900,
        "info": "",
        "director": "",
        "watch_location": ""
    //     "genre": {
    //         "id": 0,
    //         "name": ""
    // }
}

    const [genres, changeGenres] = useState([{ id: 1, name: "Drama"}, { id: 2, name: "Comedy"}])
    const [movie, updateMovieProps] = useState(initialMovieState)
    const navigate = useNavigate()

    const fetchGenres = async () => {
        const response = await fetch("http://localhost:8000/genres", {
            headers: {
                "Authorization": `Token ${JSON.parse(localStorage.getItem("movie_token")).token}`
            }
        })
        const genres = await response.json()
        changeGenres(genres)
    }

    useEffect(() => {
        fetchGenres()
    }, [])


    const addMovie = async (evt) => {
        evt.preventDefault()

        await fetch("http://localhost:8000/movies/", {
            method: "POST",
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
                <form className="form--login" onSubmit={(e) => { e.preventDefault(); addMovie(e) }}>
                    <h1 className="text-3xl">Add a Movie</h1>
                    <fieldset className="mt-4">
                        <label htmlFor="title">Name:</label>
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
                                copy.release_year = e.target.value
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
                            }}>
                            <option value={0}>- Select a genre -</option>
                            {
                                genres.map(g => <option
                                    key={`genre-${g.id}`}
                                    value={g.id}>{g.name}</option> )
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
                        <button type="submit"
                            onClick={addMovie}
                            className="button rounded-md bg-blue-700 text-blue-100 p-3 mt-4">
                            Add Movie
                        </button>
                    </fieldset>
                </form>
            </section>
        </main>
    )
}