import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AlbumCard from './AlbumCard'; // adjust path
import { Container, SimpleGrid, Text } from '@mantine/core';

// Displays albums retrieved from database by user queries
export default function search_page() {
  const location = useLocation();
  const [results, set_results] = useState([]);
  const query = new URLSearchParams(location.search).get('q');

  // Fetch and filter albums on query change
  useEffect(() => {
    if (query) {
      fetch('http://localhost:8000/api/albums')
        .then(res => res.json())
        .then(data => {
          const lower = query.toLowerCase();
          const filtered = data.filter(
            a => a.title.toLowerCase().includes(lower) || a.artist.toLowerCase().includes(lower)
          );
          set_results(filtered);
        });
    }
  }, [query]);

  return (
    <Container py="md">
      {/* Display search query */}
      <Text size="xl" c="white" mb="md">
        Results for: <strong>{query}</strong>
      </Text>

      {/* Show filtered album cards */}
      <SimpleGrid cols={4} spacing="lg">
        {results.map(album => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </SimpleGrid>
    </Container>
  );
}

