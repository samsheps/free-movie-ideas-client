import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const MovieList = ({ movies, fetchMovies, showAll }) => {
    const navigate = useNavigate();

    useEffect(() => { 
        fetchMovies(showAll)
    }, [showAll])

    const handleUpdate = (movie) => {
        navigate(`/movies/update/${movie.id}`, { state: { movie } });
    }

    const displayMovies = () => {
        if (movies && movies.length) {
            return movies.map(movie => (
                <div key={`key-${movie.id}`} className="border p-5 border-solid hover:bg-fuchsia-500 hover:text-violet-50 rounded-md border-violet-900 mt-5 bg-slate-50">
                    <div>{movie.title} ({movie.genre.name}) released {movie.release_year}</div>
                    {
                        !showAll && (
                            <div>
                                <button 
                                    onClick={() => handleUpdate(movie)}
                                    className="border border-solid bg-blue-700 text-white p-1 mr-2">Update</button>
                                <button 
                                    onClick={async () => {
                                        const response = await fetch(`http://localhost:8000/movies/${movie.id}`, {
                                            method: "DELETE",
                                            headers: {
                                                Authorization: `Token ${JSON.parse(localStorage.getItem("movie_token")).token}`
                                            }
                                        })

                                        if (response.status === 204) {
                                            fetchMovies(showAll)
                                        }
                                    }}
                                    className="border border-solid bg-red-700 text-white p-1">Delete</button>
                            </div>
                        )
                    }
                </div>
            ))
        }

        return <h3>Loading Movies...</h3>
    }

    return (
        <>
            <h1 className="text-3xl">Movie List</h1>
            {displayMovies()}
        </>
    )
}
