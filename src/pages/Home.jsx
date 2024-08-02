const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Free Movie Ideas</h1>
            <p className="text-lg mb-4">Never Rewatch Seinfeld Again</p>
            <p className="text-lg mb-4">(unless you really want to)</p>
            <a href="http://localhost:5173/movies">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Get Started
                </button>
            </a>
        </div>
    );
};

export default Home;
