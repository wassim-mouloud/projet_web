import React from 'react'
import { Link } from 'react-router-dom';
import { movie_genres,tv_genres } from '../utils/genres';
import httpClient from '../httpClient';
import { Toaster, toast } from "sonner";



const WatchlistCard = ({movie, index,  hovered, hoveredMovieId, handleMouseEnter, handleMouseLeave,  setWatchlistSeries, setWatchlistMovies}) => {

    const handleRemoveMovieFromWatchlist = async (e) => {
        e.preventDefault();  
        e.stopPropagation();
    
        try {
            const response = await httpClient.post('//localhost:8000/watchlist/movies/remove', {
                id: movie.id
            });
    
            if (response.status === 200) {
                console.log("Removed");
                setWatchlistMovies(prevMovies => prevMovies.filter(m => m.id !== movie.id));
                toast.success(`${movie?.original_title} removed from watchlist`); 
            } else {
                console.error("Failed to remove movie: ", response.data.error);
            }
        } catch (error) {
            console.error("Error removing movie: ", error);
        }
    };

    const handleRemoveSeriesFromWatchlist = async (e) => {
        e.preventDefault();  
        e.stopPropagation();
        
        const response = await httpClient.post('//localhost:8000/watchlist/series/remove', {
            id: movie.id
        });

        if (response.status === 200) {
            console.log("removed")
            setWatchlistSeries(prevSeries => prevSeries.filter(m => m.id !== movie.id));
            toast.success(`${movie.name} removed from watchlist`); 
        } else {
            alert(response.data.error || 'Failed to remove series');
        }
    };

    const handleRemove = (e) => {
        "release_date" in movie ?  handleRemoveMovieFromWatchlist(e) : handleRemoveSeriesFromWatchlist(e)
    }


  return (
        <Link
            to={`${'release_date' in movie ?`/MovieDetail/${movie.id}`:`/SeriesDetail/${movie.id}`}`}
            key={index}
            layout
            className={`group relative fade h-[220px] md:h-[220px] lg:h-[245px]  rounded-[7px] bg-[#16181f] cursor-pointer transition-transform duration-500 ${hovered && movie.id===hoveredMovieId?'lg:hover:scale-x-[1.7] lg:hover:scale-y-[1.4] lg:hover:z-[99]':''} ${index%6===0?'lg:origin-left':''} ${index%6===5 && index!==0? 'lg:origin-right':''} `}
            onMouseEnter={()=>handleMouseEnter(movie.id)}
            onMouseLeave={handleMouseLeave}>
            <img loading='lazy' src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="" className={`skeleton rounded-[5px] h-full w-full ${hovered && movie.id===hoveredMovieId?'lg:hidden':''} `}/>
            <img loading='lazy' src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`} alt="" className={`skeleton w-full object-cover rounded-[5px] h-[40%] absolute top-0 opacity-0 ${hovered && movie.id===hoveredMovieId?'lg:group-hover:opacity-100   lg:flex ':''} `}/>
            
            <div className={`lg:mt-[50%] flex-col items-start justify-between h-[calc(60%-16px)] hidden w-full py-2 px-2 mt-1 ${hovered && movie.id===hoveredMovieId?'lg:group-hover:flex':''}`} >
                <div className='flex gap-2 w-[95%]' >
                    <button
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation();
                        window.open(`https://www.youtube.com/watch?v=rcBntNCD4ZY`, '_blank');
                    }}
                    className='text-[8px] h-[30px] w-[135px] flex justify-center items-center gap-1 bg-[#d9d9da] rounded-[5px] lg:hover:scale-105 transition-all' >
                        <img loading='lazy' src="/images/dark-blue-play.png" alt="" className='w-2 h-2'/>
                        <span className='font-medium text-[#16181f]' >Watch Now</span>
                    </button>
                    <button onClick={(e) => handleRemove(e)}  className='text-[8px] h-[30px] w-[30px] flex justify-center items-center bg-[rgba(40,42,49,255)] rounded-[5px] text-white lg:hover:scale-105 transition-all ' >-</button>
                </div>
                <p className='font-bold text-[10px] text-[#d9d9da] py-1' >{'release_date' in movie ? movie.original_title : movie.name}</p>
                <div className='w-[95%] flex flex-col gap-1' >
                    <div className='flex gap-1  items-center text-[8px] font-medium ' >
                    <span className='text-[#d9d9da] text-[8px]' >
                        {'release_date' in movie 
                            ? (typeof(movie.release_date) === 'string' ? movie.release_date.slice(0, 4) : null)
                            : (typeof(movie?.first_air_date) === 'string' ? movie.first_air_date.slice(0, 4) : null)
                        }
                    </span>
                        <span className='text-[#a2a3a5] text-[9px]' >•</span>
                        {movie.genre_ids.slice(0, 2).map(genre_id => {
                            return (
                                <div className='flex gap-1 text-[8px]'>
                                    <span className='text-[#d9d9da]'>{'release_date' in movie  ?movie_genres[genre_id]:tv_genres[genre_id]}</span>
                                    <span className='text-[#a2a3a5]' >•</span>
                                </div>
                            )
                        })}
                        <div className='flex justify-center items-center text-[#d9d9da] gap-1' >
                            <img loading='lazy' src="/images/star.png" alt="" className='w-2 h-2'/>
                            <span className='text-[8px]' >{movie.vote_average && (movie.vote_average).toString().slice(0,3)}</span>
                        </div>
                    </div>
                    <p className='text-[#7c849b] text-[7px] flex-grow-0 flex-shrink-0 w-full' >{movie.overview.split(' ').slice(0,22).join(' ')}</p>
                </div>
            </div>
        </Link>
  )
}

export default WatchlistCard