import { Card, Text } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function AlbumCard({ album }) {
  const navigate = useNavigate();
  const [hovered, set_hovered] = useState(false);

  return (
    <div
      style={{
        maxWidth: 250,
        margin: 'auto',
        transition: 'transform 0.3s ease',
        cursor: 'pointer',
        transform: hovered ? 'scale(1.05)' : 'scale(1)',
      }}
      onMouseEnter={() => set_hovered(true)}
      onMouseLeave={() => set_hovered(false)}
      onClick={() => navigate(`/albums/${album.id}`)}
    >
      <Card shadow="lg" radius="md" bg="#4c5897" padding="md">
        <img
          src={album.cover_url}
          alt={album.title}
          style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: 8 }}
        />
        <Text weight={600} mt="sm" color="white" align="center">{album.title}</Text>
        <Text size="sm" color="gray" align="center">{album.artist} <br /> {album.year}</Text>
      </Card>
    </div>
  );
}