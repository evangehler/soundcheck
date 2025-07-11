import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function AlbumPage() {
  const { id } = useParams();
  const [album, set_album] = useState(null);
  const [reviews, set_reviews] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/albums/${id}`)
      .then(res => res.json())
      .then(set_album)
      .catch(() => set_album(null));

    fetch(`http://localhost:8000/api/albums/${id}/reviews`)
      .then(res => (res.ok ? res.json() : []))
      .then(set_reviews)
      .catch(() => set_reviews([]));
  }, [id]);

  if (!album) return <p className="text-center p-10">Loading...</p>;

  return (
    <main className="p-6 max-w-screen-md mx-auto">
      <Link to="/" className="text-blue-400 underline mb-4 inline-block">← Back to Albums</Link>
<div className="flex justify-center">
  <div className="flex gap-6 w-full max-w-5xl">
    {/* Album Card */}
    <div className="w-1/5 rounded-lg shadow-lg overflow-hidden flex flex-col text-white bg-gray-700">
      <img src={album.cover_url} alt={album.title} className="w-full aspect-square object-cover rounded-t-lg" />
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold">{album.title}</h1>
        <p className="text-lg text-gray-300">{album.artist} · {album.year}</p>
        <p className="text-md text-gray-200 mt-1">
        Average Score: {album.average_score?.toFixed(1) ?? "N/A"}
</p>
      </div>
    </div>

    {/* Reviews */}
    <div className="w-2/3 flex flex-col items-center space-y-4">
    {reviews.length === 0 ? (
        <p className="text-gray-400">No reviews yet.</p>
    ) : (
        reviews.map(({ id, user_name, score, review }) => (
        review && (
            <div
            key={id}
            className="bg-gray-800 border border-white rounded-md p-4 shadow text-white w-[60%]"
            >
            <h3 className="font-semibold mb-2">
                {user_name} — <span className="text-yellow-400">{score}/5</span>
            </h3>
            <p className="text-gray-300 whitespace-pre-wrap">{review}</p>
            </div>
        )
        ))
    )}
    </div>

  </div>
</div>

    </main>
  );
}
