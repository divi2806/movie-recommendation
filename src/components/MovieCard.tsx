import React from 'react';

interface MovieCardProps {
  title: string;
  overview: string;
  posterPath: string;
  releaseDate: string;
  rating: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ title, overview, posterPath, releaseDate, rating }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
      <img className="w-full" src={`https://image.tmdb.org/t/p/w500${posterPath}`} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{overview}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          Release Date: {releaseDate}
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
             Rating: {rating}
           </span>
         </div>
       </div>
     );
   };

   export default MovieCard;