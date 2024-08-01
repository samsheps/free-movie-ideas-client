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
            setShowPopup(true);
        } else if (response.ok) {
            fetchMovies(showAll);
        }
};

const handleMarkAsWatched = async (movieId) => {
    const token = JSON.parse(localStorage.getItem("movie_token")).token;
    const response = await fetch(`http://localhost:8000/likedmovies/${movieId}/mark_watched/`, {
        method: 'PATCH',
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ watched: true })
    });

    if (response.ok) {
        fetchMovies(showAll);
    } else {
        console.error('Failed to mark as watched', response.statusText);
    }
};

const displayMovies = () => {
    if (movies && movies.length) {
        return movies.map(movie => (
            <div key={`key-${movie.id}`} className="border p-5 border-solid hover:bg-fuchsia-500 hover:text-violet-50 rounded-md border-violet-900 mt-5 bg-slate-50">
                <div>
                    <p>{movie.title} ({movie.genre?.name || 'Unknown Genre'})</p>
                    <p>Released {movie.release_year}</p>
                    <p>Overview: {movie.info}</p>
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
                    movie.watched === false && (
                        <button
                            onClick={() => handleMarkAsWatched(movie.id)}
                            className="border border-solid bg-yellow-700 text-white p-1 mt-2">Mark as Watched</button>
                    )
                }
            </div>
        ));
    }

    return <h3>Loading Movies...</h3>;
};


return (
    <>
        <h1 className="text-3xl">{isLiked ? "Liked Movies" : "Movie List"}</h1>
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

