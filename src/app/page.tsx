'use client'

import React, { useState } from 'react';
import axios from 'axios';

interface Movie {
  title: string;
  overview: string;
  poster_path: string | null;
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMovie(null);

    try {
      console.log('Sending request with prompt:', prompt);
      const response = await axios.post('/api/recommendations', { prompt });
      console.log('Received response:', response.data);
      setMovie(response.data);
    } catch (error) {
      console.error('Detailed error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
        setError(error.response?.data?.error || 'An error occurred with the API request');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl text-black font-semibold mb-6">Movie Recommender</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the kind of movie you want to watch"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-black"
              />
              <button
                type="submit"
                className="w-full py-2 px-4 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Recommend'}
              </button>
            </form>
            {error && (
              <p className="mt-4 text-red-500">{error}</p>
            )}
            {movie && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2 text-black">{movie.title}</h2>
                {movie.poster_path && (
                  <img
                    src={movie.poster_path}
                    alt={movie.title}
                    className="w-full h-64 object-cover rounded-md mb-4"
                  />
                )}
                <p className="text-gray-600">{movie.overview}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}