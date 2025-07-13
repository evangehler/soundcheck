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
    <Container size="xl" py="lg">
      <div style={{ marginTop: '5rem' }}>
        <Title order={2} ta="center" mb="xl" c="white">Featured Albums</Title>
        <SimpleGrid 
          cols={{ base: 1, xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
          spacing={{ base: 'md', sm: 'lg', md: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'lg', md: 'xl' }}
        >
          {albums.map(album => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </SimpleGrid>
      </div>
    </Container>
  );
}