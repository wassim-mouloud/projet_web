import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import WatchlistCard from '../components/WatchlistCard'
import httpClient from '../httpClient';

function Watchlist({allWatchlist, setAllWatchlist, getMovies, getSeries, hovered, hoveredMovieId, handleMouseEnter, handleMouseLeave}) {

  const [watchlistSeries, setWatchlistSeries] = useState([]);
  const [loading, setLoading] = useState(true); 

  const fetchSeriesWatchlist = async () => {
    try {
      setLoading(true); 
      const response = await httpClient.get('//localhost:8000/watchlist/series');
      if (response.status === 200) {
        setWatchlistSeries(response.data); 
      } else {
        alert('Failed to fetch watchlist');
      }
    } catch (error) {
      console.error('Error fetching watchlist', error);
      alert('Error communicating with server');
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchSeriesWatchlist(); 
  }, []);

  useEffect(() => {
    console.log(watchlistSeries);
  }, [watchlistSeries]);



  return (
    <div>
        <Navbar/>
        <p className='text-white  text-[20px] lg:text-[28px] font-bold p-6 lg:p-8 lg:pl-[100px]' >My watchlist</p>
        <div  className='w-screen lg:w-[calc(100vw-100px)] xl:w-[calc(100vw-140px)] grid grid-cols-2 sm:grid-cols-3  md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2  mb-[120px] lg:mb-0 p-6 lg:p-8 lg:pl-[100px]' >
            {allWatchlist.map((movie, index)=>{
                return(
                    <WatchlistCard movie={movie} index={index}  getMovies={getMovies} getSeries={getSeries} hovered={hovered}  hoveredMovieId={hoveredMovieId}  handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />
                )
            })}
        </div>
    </div>
  )
}

export default Watchlist