import { SimpleGrid, Title, Container } from '@mantine/core';
import { useEffect, useState } from 'react';
import AlbumCard from './AlbumCard';

export default function FrontPage() {
  const [albums, set_albums] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/albums')
      .then(res => res.json())
      .then(set_albums);
  }, []);

  return (
    <Container py="lg">
      <div style={{ marginTop: '5rem' }}>
        <Title order={2} ta="center" mb="lg" c="white">Featured Albums</Title>
        <SimpleGrid cols={5} spacing="lg" breakpoints={[
          { maxWidth: 'lg', cols: 4 },
          { maxWidth: 'md', cols: 3 },
          { maxWidth: 'sm', cols: 2 },
          { maxWidth: 'xs', cols: 1 },
        ]}>
          {albums.map(album => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </SimpleGrid>
      </div>
    </Container>
  );
}
