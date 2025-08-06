import { Card, Text, Rating, Stack } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Displayed on the front page
export default function AlbumCard({ album }) {
  const navigate = useNavigate();
  const [hovered, set_hovered] = useState(false); // hover state for scale effect

  return (
    <div
      // container with hover scale and click navigation
      style={{
        width: '100%',
        maxWidth: 300,
        margin: 0,
        transition: 'transform 0.3s ease',
        cursor: 'pointer',
        transform: hovered ? 'scale(1.03)' : 'scale(1)',
        position: 'relative',
        borderStyle: 'groove',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 15,
        overflow: 'hidden',
      }}
      onMouseEnter={() => set_hovered(true)}
      onMouseLeave={() => set_hovered(false)}
      onClick={() => navigate(`/albums/${album.id}`)}
    >
      {/* blurred background image */}
      <img
        src={album.cover_url}
        alt=""
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(50px) brightness(0.55)',
          zIndex: 0,
        }}
      />
      <Card
        shadow="lg"
        radius={15}
        padding="md"
        style={{
          backgroundColor: 'rgba(38, 46, 74, 0.5)',
          position: 'relative',
          zIndex: 1,
          height: '100%',
          backdropFilter: 'blur(6px)',
        }}
      >
        <Stack spacing="sm">
          {/* main album cover */}
          <img
            src={album.cover_url}
            alt={album.title}
            style={{
              width: '100%',
              borderRadius: 6,
              objectFit: 'cover',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            }}
          />
          {/* album title */}
          <Text c="white" fw={700} size="lg" align="center">
            {album.title}
          </Text>
          {/* artist and year */}
          <Text c="gray.4" size="sm" align="center">
            {album.artist} ({album.year})
          </Text>
          {/* average score and rating */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Text c="white" fw={600} size="md">
              {album.average_score?.toFixed(1) || 'N/A'}
            </Text>
            <Rating
              value={album.average_score?.toFixed(1)}
              fractions={2}
              readOnly
              size="md"
              color="yellow"
              style={{ marginLeft: 8 }}
            />
          </div>
        </Stack>
      </Card>
    </div>
  );
}
