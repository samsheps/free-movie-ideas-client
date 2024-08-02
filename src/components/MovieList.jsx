import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const MovieList = ({ movies, fetchMovies, showAll, isLiked }) => {
    const navigate = useNavigate();
    const [popupMessage, setPopupMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        fetchMovies(showAll);
    }, [showAll]);

    const handleUpdate = (movie) => {
        navigate(`/movies/update/${movie.id}`, { state: { movie } });
    };

    const handleAddToWatchlist = async (movie) => {
        const response = await fetch(`http://localhost:8000/likedmovies/`, {
            method: "POST",
            headers: {
                "Authorization": `Token ${JSON.parse(localStorage.getItem("movie_token")).token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ movie_id: movie.id })
        });

        if (response.status === 400) {  // Assuming 400 is the status code for "already in watchlist"
            setPopupMessage('This movie is already in your watchlist');
        } else if (response.ok) {
            setPopupMessage('Movie added to your watchlist');
            fetchMovies(showAll);
        } else {
            setPopupMessage('An error occurred while adding the movie to your watchlist');
        }
        setShowPopup(true);
    };

    const handleToggleWatchedStatus = async (movieId, currentWatchedStatus) => {
        const token = JSON.parse(localStorage.getItem("movie_token")).token;
        const response = await fetch(`http://localhost:8000/likedmovies/${movieId}/mark_watched/`, {
            method: 'PATCH',
            headers: {
                Authorization: `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ watched: !currentWatchedStatus })
        });

        if (response.ok) {
            fetchMovies(showAll);
        } else {
            console.error('Failed to toggle watched status', response.statusText);
            setPopupMessage('Failed to update watched status');
            setShowPopup(true);
        }
    };

    const displayMovies = () => {
        if (movies && movies.length) {
            return movies.map(movie => (
                <div key={`key-${movie.id}`} className="border p-5 border-solid hover:bg-slate-400 hover:text-violet-50 rounded-md border-violet-900 mt-5 bg-slate-50">
                    <div>
                        <p>{movie.title} ({movie.genre?.name || 'Unknown Genre'})</p>
                        <p>Released {movie.release_year}</p>
                        <p>Overview: {movie.info}</p>
                        <p>Directed by {movie.director}</p>
                        <p>Available on {movie.watch_location}</p>
                    </div>
                    {
                        !isLiked && !showAll && (
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
                                        });

                                        if (response.status === 204) {
                                            fetchMovies(showAll);
                                        }
                                    }}
                                    className="border border-solid bg-red-700 text-white p-1">Delete</button>
                            </div>
                        )
                    }
                    {
                        !isLiked && showAll && (
                            <button
                                onClick={() => handleAddToWatchlist(movie)}
                                className="border border-solid bg-green-700 text-white p-1 mt-2">Add to My Watchlist</button>
                        )
                    }
                    {
                        isLiked && (
                            <button
                                onClick={() => handleToggleWatchedStatus(movie.id, movie.watched)}
                                className={`border border-solid p-1 mt-2 ${movie.watched ? 'bg-red-700' : 'bg-yellow-700'} text-white`}>
                                {movie.watched ? 'Unmark as Watched' : 'Mark as Watched'}
                            </button>
                        )
                    }
                </div>
            ));
        }

        return <h3>Looks like you don't have any movies added yet--add a new one or search our database to add movies to your list</h3>;
    };

    return (
        <>
            <h1 className={`text-4xl font-semibold italic
                 text-center text-emerald-600 mb-8`}>
                {isLiked ? "" : "Get Lost in a Film"}
            </h1>
            {displayMovies()}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded shadow-md text-center">
                        <p>{popupMessage}</p>
                        <button 
                            onClick={() => setShowPopup(false)}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
