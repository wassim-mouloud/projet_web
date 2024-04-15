import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { movie_genres,tv_genres } from '../utils/genres';
import httpClient from '../httpClient';
import useAuth from '../hooks/useAuth';

function SearchCard({movie, index, hovered, setHovered, hoveredMovieId, setHoveredMovieId, handleMouseEnter, handleMouseLeave}) {

    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user, isLoading } = useAuth();


    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                setLoading(true);
                const response = await httpClient.get('//localhost:8000/watchlist/movies');
                if (response.status === 200) {
                    const watchlist = response.data;
                    const isMovieInWatchlist = watchlist.some(watchlistMovie => watchlistMovie.movie_id === movie.id);
                    setIsInWatchlist(isMovieInWatchlist);
                } else {
                    alert('Failed to fetch watchlist');
                }
            } catch (error) {
                console.error('Error fetching watchlist', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWatchlist();
    }, []);


    const handleAddToWatchlist = async (e) => {
        e.preventDefault();  
        e.stopPropagation();

        // Check if user information is still loading
        if (isLoading) {
            alert("Checking user status...");
            return;
        }

        // Ensure the user is logged in
        if (!user) {
            alert("Please log in to add movies to your watchlist.");
            return;
        }

        try {
            const response = await httpClient.post('//localhost:8000/watchlist/movies/add', {
                id: movie.id,
                title: movie.title,
                overview: movie.overview,
                poster_path: movie.poster_path,
                backdrop_path: movie.backdrop_path,
                original_language: movie.original_language,
                release_date: movie.release_date,
                vote_average: movie.vote_average,
                vote_count: movie.vote_count,
                popularity: movie.popularity,
                genre_ids: movie.genre_ids,
            }, { withCredentials: true });

            console.log(response.data);

            if (response.status === 201) {
                setIsInWatchlist(true);
            } else {
                alert(response.data.error || 'Failed to add movie');
            }
        } catch (error) {
            console.error("Error adding movie to watchlist: ", error);
            alert("Failed to add movie to watchlist.");
        }
    };

    const handleRemoveFromWatchlist = async (e) => {

        e.preventDefault();  
        e.stopPropagation();
        const response = await httpClient.post('//localhost:8000/watchlist/movies/remove', {
            movie_id: movie.id
        });

        console.log(response.data)


        if (response.status === 200) {
            setIsInWatchlist(false);
        } else {
            alert(response.data.error || 'Failed to remove movie');
        }
    };

    const toggleWatchlist = (e) => {
        if (isInWatchlist) {
            handleRemoveFromWatchlist(e);
        } else {
            handleAddToWatchlist(e);
        }
    };

    const watchlistLabel = isInWatchlist ? '-' : '+';
      

  return (
    <Link
        to={`${'release_date' in movie ?`/MovieDetail/${movie.id}`:`/SeriesDetail/${movie.id}`}`}
        key={index}
        layout
        className={`group relative fade h-[220px] md:h-[220px] lg:h-[245px]  rounded-[7px] bg-[#16181f] cursor-pointer transition-transform duration-500 ${hovered && movie.id===hoveredMovieId?'lg:hover:scale-x-[1.7] lg:hover:scale-y-[1.4] lg:hover:z-[99]':''} ${index%6===0?'lg:origin-left':''} ${index%6===5 && index!==0? 'lg:origin-right':''} `}
        onMouseEnter={()=>handleMouseEnter(movie.id)}
        onMouseLeave={handleMouseLeave}>
        <img loading='lazy' src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="" className={`skeleton rounded-[5px] h-full w-full ${hovered && movie.id===hoveredMovieId?'lg:hidden':''}    `}/>
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
                <button onClick={(e) => toggleWatchlist(e)} className='text-[8px] h-[30px] w-[30px] flex justify-center items-center bg-[rgba(40,42,49,255)] rounded-[5px] text-white lg:hover:scale-105 transition-all ' >{watchlistLabel}</button>
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

export default SearchCard