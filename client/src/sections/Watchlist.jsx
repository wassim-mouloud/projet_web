import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import WatchlistCard from '../components/WatchlistCard'
import httpClient from '../httpClient';

function Watchlist({ hovered, hoveredMovieId, handleMouseEnter, handleMouseLeave}) {

  const [watchlistSeries, setWatchlistSeries] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for both series and movies

  const fetchSeriesWatchlist = async () => {
    try {
      const response = await httpClient.get('//localhost:8000/watchlist/series');
      if (response.status === 200) {
        setWatchlistSeries(response.data);
      } else {
        alert('Failed to fetch series watchlist');
      }
    } catch (error) {
      console.error('Error fetching series watchlist', error);
      alert('Error communicating with server');
    }
  };

  const fetchMoviesWatchlist = async () => {
    try {
      const response = await httpClient.get('//localhost:8000/watchlist/movies');
      if (response.status === 200) {
        setWatchlistMovies(response.data);
      } else {
        alert('Failed to fetch movies watchlist');
      }
    } catch (error) {
      console.error('Error fetching movies watchlist', error);
      alert('Error communicating with server');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchSeriesWatchlist();
      await fetchMoviesWatchlist();
      setLoading(false);
    };

    fetchData();
  }, []);

  
  useEffect(() => {
    console.log("Watchlist Series:", watchlistSeries);
    console.log("Watchlist Movies:", watchlistMovies);
  }, [watchlistSeries, watchlistMovies]);
  


  return (
    <div>
        <Navbar/>
        <p className='text-white  text-[20px] lg:text-[42px] text-center font-bold p-6 lg:p-8 lg:pl-[100px]' >My watchlist</p>
        <p className='text-white  text-[20px] font-semibold  lg:pl-[100px]' >Series</p>
        <div  className='w-screen lg:w-[calc(100vw-100px)] xl:w-[calc(100vw-140px)] grid grid-cols-2 sm:grid-cols-3  md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2  mb-[120px] lg:mb-0 p-6 lg:p-8 lg:pl-[100px]' >
            {watchlistSeries.map((movie, index)=>{
                return(
                    <WatchlistCard movie={movie} index={index}  hovered={hovered}  hoveredMovieId={hoveredMovieId}  handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />
                )
            })}
        </div>
        <p className='text-white  text-[20px] font-semibold  lg:pl-[100px]' >Movies</p>
        <div  className='w-screen lg:w-[calc(100vw-100px)] xl:w-[calc(100vw-140px)] grid grid-cols-2 sm:grid-cols-3  md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2  mb-[120px] lg:mb-0 p-6 lg:p-8 lg:pl-[100px]' >
            {watchlistMovies.map((movie, index)=>{
                return(
                    <WatchlistCard movie={movie} index={index}  hovered={hovered}  hoveredMovieId={hoveredMovieId}  handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />
                )
            })}
        </div>
    </div>
  )
}

export default Watchlist