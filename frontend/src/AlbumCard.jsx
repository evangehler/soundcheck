import { Card, Text } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AlbumCard({ album }) {
  const navigate = useNavigate();
  const [hovered, set_hovered] = useState(false);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 280,
        margin: '0px',
        transition: 'transform 0.3s ease',
        cursor: 'pointer',
        transform: hovered ? 'scale(1.05)' : 'scale(1)',

      }}
      onMouseEnter={() => set_hovered(true)}
      onMouseLeave={() => set_hovered(false)}
      onClick={() => navigate(`/albums/${album.id}`)}
    >
      <Card className="glass-card"
        shadow="lg" 
        radius="md" 
        bg="#4c5897"
        padding="md"
        style={{
            margin: 'auto',
          height: '100%',
          minHeight: 320,
          display: 'inline-block',
          flexDirection: 'column'
        }}
      >
        <div style={{ 
          width: '100%',
          aspectRatio: '1 / 1',
          overflow: 'hidden',
          borderRadius: 8,
          flexShrink: 0
        }}>
          <img
            src={album.cover_url}
            alt={album.title}
            style={{ 
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
        
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'space-between',
          marginTop: 12,
          minHeight: 80
        }}>
          <Text 
            weight={600} 
            color="white" 
            align="center" 
            lineClamp={2}
            style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}
          >
            {album.title}
          </Text>

          <Text 
            size="sm" 
            color="gray" 
            align="center"
            style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)' }}
          >
            {album.artist} <br /> {album.year}
          </Text>
        </div>
      </Card>
    </div>
  );
}