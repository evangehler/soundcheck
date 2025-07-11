export default function AlbumCard({ album }) {
  return (
    <div
      style={{ backgroundColor: '#6e6e6eff' }}
      className="rounded-lg shadow hover:shadow-lg overflow-hidden flex flex-col text-white"
    >
      <div className="p-3">
        <img
          src={album.cover_url}
          alt={album.title}
          className="rounded-lg overflow-hidden w-full aspect-square object-cover"
        />
      </div>
      <div className="px-3 pb-3 text-center">
        <h3 className="text-md font-semibold">{album.title}</h3>
        <p className="text-sm text-gray-300">
          {album.artist} &middot; {album.year}
        </p>
      </div>
    </div>
  );
}
