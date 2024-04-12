import {Route, Routes} from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Home from './sections/Home';
import Movies from './sections/Movies'
import Series from './sections/Series';
import Search from './sections/Search';
import MovieDetail from './sections/MovieDetail';
import SeriesDetail from './sections/SeriesDetail';
import Login from './sections/Login';
import Watchlist from './sections/Watchlist';
function App() {

  const [watchlistMovies, setWatchlistMovies] = useState([])
  const [watchlistSeries, setWatchlistSeries] = useState([])
  const [allWatchlist, setAllWatchlist] = useState([])
  const [hovered, setHovered]= useState(false)
  const [hoveredMovieId, setHoveredMovieId] = useState(null);
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


  const handleMouseEnter = async (id) => {
      setHoveredMovieId(id)
      await sleep(500)
      setHovered(true)
  }

  const handleMouseLeave = () => {
      setHoveredMovieId(null)
      setHovered(false)
  }



  return (
    <div className="relative">
      <Routes>
        <Route path='/' element={<Home hovered={hovered} hoveredMovieId={hoveredMovieId} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />} ></Route>
        <Route path='/Movies' element={<Movies hovered={hovered} hoveredMovieId={hoveredMovieId} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />} ></Route>
        <Route path='/Series' element={<Series/>} ></Route>
        <Route path='/Search' element={<Search  hovered={hovered}  hoveredMovieId={hoveredMovieId}  handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />}></Route>
        <Route path='/Login' element={<Login/>}></Route>
        <Route path='MovieDetail/:id' element={<MovieDetail hovered={hovered} hoveredMovieId={hoveredMovieId} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave}/>}></Route>
        <Route path='SeriesDetail/:id' element={<SeriesDetail/>}></Route>
        <Route path='/Watchlist' element={<Watchlist watchlistMovies={watchlistMovies} setWatchlistMovies={setWatchlistMovies} watchlistSeries={watchlistSeries} setWatchlistSeries={setWatchlistSeries} allWatchlist={allWatchlist} setAllWatchlist={setAllWatchlist}  hovered={hovered} hoveredMovieId={hoveredMovieId}  handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />}></Route>        
      </Routes>
    </div>
  );
}

export default App;
