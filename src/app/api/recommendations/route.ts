import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    console.log('Received prompt:', prompt);

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Gemini API call
    console.log('Calling Gemini API');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
      const result = await model.generateContent([
        { text: "You are a helpful assistant that recommends movies. Respond with only the movie title, nothing else." },
        { text: `Suggest a movie based on the following description: ${prompt}` }
      ]);

      const response = await result.response;
      const movieTitle = response.text().trim();
      console.log('Gemini suggested movie:', movieTitle);

      if (!movieTitle) {
        return NextResponse.json({ error: 'Failed to generate a movie recommendation' }, { status: 500 });
      }

      // TMDB API call
      const tmdbApiKey = process.env.TMDB_API_KEY;
      if (!tmdbApiKey) {
        return NextResponse.json({ error: 'TMDB API key is not configured' }, { status: 500 });
      }

      console.log('Calling TMDB API');
      const tmdbResponse = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(movieTitle)}`
      );

      const movie = tmdbResponse.data.results[0];
      console.log('TMDB response:', movie);

      if (!movie) {
        return NextResponse.json({ error: 'No movie found matching the recommendation' }, { status: 404 });
      }

      return NextResponse.json({
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      });
    } catch (genAIError) {
      console.error('Gemini API error:', genAIError);
      return NextResponse.json({ error: `Gemini API error: ${(genAIError as Error).message}` }, { status: 500 });
    }

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: `API route error: ${(error as Error).message}` }, { status: 500 });
  }
}