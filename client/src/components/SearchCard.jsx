import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { movie_genres,tv_genres } from '../utils/genres';
import httpClient from '../httpClient';
import useAuth from '../hooks/useAuth';
import { Toaster, toast } from "sonner";


function SearchCard({movie, index, hovered, setHovered, hoveredMovieId, setHoveredMovieId, handleMouseEnter, handleMouseLeave}) {

    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user, isLoading } = useAuth();


    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                setLoading(true); 
    
                const [moviesResponse, seriesResponse] = await Promise.all([
                    httpClient.get('//localhost:8000/watchlist/movies'),
                    httpClient.get('//localhost:8000/watchlist/series')
                ]);
    
                if (moviesResponse.status === 200 && seriesResponse.status === 200) {
                    const moviesWatchlist = moviesResponse.data;
                    const seriesWatchlist = seriesResponse.data;
    
                    const isMovieInMoviesWatchlist = moviesWatchlist.some(watchlistMovie => watchlistMovie.id == movie.id);
                    const isMovieInSeriesWatchlist = seriesWatchlist.some(watchlistSeries => watchlistSeries.id == movie.id);
    
                    setIsInWatchlist(isMovieInMoviesWatchlist || isMovieInSeriesWatchlist);
                    console.log(`${movie.id} ${movie.name} : ${isMovieInSeriesWatchlist}`)

                } else {
                    alert('Failed to fetch watchlist');
                }
            } catch (error) {
                console.error('Error fetching watchlists', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchWatchlist();
    }, [movie]);

    const handleAddMovieToWatchlist = async (e) => {
        e.preventDefault();  
        e.stopPropagation();

        if (isLoading) {
            alert("Checking user status...");
            return;
        }

        if (!user) {
            alert("Please log in to add movies to your watchlist.");
            return;
        }

        try {
            const response = await httpClient.post('//localhost:8000/watchlist/movies/add', {
                id: movie.id,
                original_title : movie.original_title,
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


            if (response.status === 201) {
                setIsInWatchlist(true);
                toast.success(`${movie.original_title} added to watchlist`); 
            } else {
                alert(response.data.error || 'Failed to add movie');
            }
        } catch (error) {
            console.error("Error adding movie to watchlist: ", error);
            alert("Failed to add movie to watchlist.");
        }
    };

    const handleAddSeriesToWatchlist = async (e) => {
        e.preventDefault();  
        e.stopPropagation();

        if (isLoading) {
            alert("Checking user status...");
            return;
        }

        if (!user) {
            alert("Please log in to add series to your watchlist.");
            return;
        }

        try {
            const response = await httpClient.post('//localhost:8000/watchlist/series/add', {
                id: movie.id,
                name: movie.name,
                overview: movie.overview,
                poster_path: movie.poster_path,
                backdrop_path: movie.backdrop_path,
                original_language: movie.original_language,
                first_air_date: movie.first_air_date,
                vote_average: movie.vote_average,
                vote_count: movie.vote_count,
                popularity: movie.popularity,
                genre_ids: movie.genre_ids,
            }, { withCredentials: true });


            if (response.status === 201) {
                setIsInWatchlist(true);
                toast.success(`${movie.name} added to watchlist`); 

            } else {
                alert(response.data.error || 'Failed to add series');
            }
        } catch (error) {
            console.error("Error adding series to watchlist: ", error);
            alert("Failed to add series to watchlist.");
        }
    };

    const handleRemoveMovieFromWatchlist = async (e) => {

        e.preventDefault();  
        e.stopPropagation();
        const response = await httpClient.post('//localhost:8000/watchlist/movies/remove', {
            id: movie.id
        });

        if (response.status === 200) {
            setIsInWatchlist(false);
            toast.success(`${movie.original_title} added to watchlist`); 
        } else {
            alert(response.data.error || 'Failed to remove movie');
        }
    };

    const handleRemoveSeriesFromWatchlist = async (e) => {
        e.preventDefault();  
        e.stopPropagation();
        
        const response = await httpClient.post('//localhost:8000/watchlist/series/remove', {
            id: movie.id
        });

        if (response.status === 200) {
            setIsInWatchlist(false);
            toast.success(`${movie.name} removed from watchlist`); 
        } else {
            alert(response.data.error || 'Failed to remove series');
        }
    };

    const toggleWatchlist = (e) => {
        if (isInWatchlist) {
            'release_date' in movie ?  handleRemoveMovieFromWatchlist(e) : handleRemoveSeriesFromWatchlist(e)
        } else {
            'release_date' in movie ?  handleAddMovieToWatchlist(e) : handleAddSeriesToWatchlist(e)
        }
    };

    const watchlistLabel = isInWatchlist ? '-' : '+';
      

  return (
    <Link
        to={`${'release_date' in movie ?`/MovieDetail/${movie.id}`:`/SeriesDetail/${movie.id}`}`}
        key={index}
        layout
        className={`group relative fade h-[220px] md:h-[220px] lg:h-[245px]  rounded-[7px] bg-[#16181f] cursor-pointer transition-transform duration-500 ${hovered && movie.id===hoveredMovieId?'lg:hover:scale-x-[1.7] lg:hover:scale-y-[1.4] lg:hover:z-[99]':''} ${index%6 ==0  ?'lg:origin-left':''} ${index%6===5 && index!==0? 'lg:origin-right':''} `}
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