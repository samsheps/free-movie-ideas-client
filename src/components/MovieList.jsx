import { useEffect } from "react"

export const MovieList = ({ movies, fetchMovies, showAll }) => {
    useEffect(() => { 
        fetchMovies(showAll)
    }, [showAll])
    // we've placed the prop showAll in the dep array so that we can observe the fact that this prop has changed
    /// to ensure that the fetchMovies happens when the route changes

// useeffect is like a shield bc the way react works--if we took fetchMovies and invoked it outside of this useeffect, any time a state changed on the page, it would run that code
// we only need it to run once: when we load this page
// anytime the state changes, any code inside this function will run unless the code is inside a useeffect. that tells react: when we rerun all this code, don't do this unless certain conditions are met
// that's what the dependency array is for in the useeffect. if it's empty, it runs only once after initial render
// how react works: initial render w/all the default states, then it runs the rest of the code for the component 
// and we can add dependencies that tell it "you need to run this again" if a certain state changes
// putting rocks in the dependency array would create an infinite loop: it will update every time rock state changes,
/// fetch rocks is updating the state of the rocks variable. if you put rocks inside of the dep. array, this useeffect would get activated each time the rocks state was changed
//// essentailly it's activating itself 
// the reason we need fetchMovies inside the useeffect is bc if it were outside of it, that would create an infinte loop as well 
// any code not in a useeffect will run again any time a state changes 
// useeffects are how you tell react *when* to run specific code 

    const displayMovies = () => {
        if (movies && movies.length) {
            return movies.map(movie => <div key={`key-${movie.id}`} className="border p-5 border-solid hover:bg-fuchsia-500 hover:text-violet-50 rounded-md border-violet-900 mt-5 bg-slate-50">
                <div>{movie.title} ({movie.genre.name}) released {movie.release_year}</div>
                {/* <div> In the collection of {movie.user.first_name} {movie.user.last_name}</div> */}
                {
                    showAll
                        ? "" // is showAll true (?)? we don't want to render anything
                        //& below: is show all false(:)? it's false when we're only looking at My Rocks. and if so, we want to render that delete button & action
                        : <div>
                        <button 
                            onClick={async ()=> {
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
                }
            </div>)
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
