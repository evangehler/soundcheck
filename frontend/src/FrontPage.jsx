import { SimpleGrid, Title, Container, Text, Card, Rating, Button } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AlbumCard from './AlbumCard.jsx';

// Displays categorized albums
export default function front_page() {
  // State for albums and reviews
  const [top_rated, set_top_rated] = useState([]);
  const [newest, set_newest] = useState([]);
  const [recent_reviews, set_recent_reviews] = useState([]);

  // Fetch data once on mount
  useEffect(() => {
    fetch('http://localhost:8000/api/albums/top-rated')
      .then(res => res.json())
      .then(set_top_rated);

    fetch('http://localhost:8000/api/albums/newest')
      .then(res => res.json())
      .then(set_newest);

    fetch('http://localhost:8000/api/reviews/recent')
      .then(res => res.json())
      .then(set_recent_reviews);
  }, []);

  return (
    <Container size="xl" py="sm" style={{ padding: 10, marginTop: 2 }}>
      <div style={{ marginTop: '5rem' }}>

        {/* Top Rated Albums Section */}
        <Title order={2} ta="left" mb="md" c="white">Top Rated Albums</Title>
        <SimpleGrid cols={{ base: 1, sm: 3, md: 4, xl: 6 }} spacing="md">
          {top_rated.map(album => <AlbumCard key={album.id} album={album} />)}
        </SimpleGrid>

        {/* Newest Albums Section */}
        <Title order={2} ta="left" mt="xl" mb="md" c="white">Newest Albums</Title>
        <SimpleGrid cols={{ base: 1, sm: 3, md: 4, xl: 6 }} spacing="md">
          {[...newest]
            .sort((a, b) => b.year - a.year) // sort newest by year desc
            .slice(0, 6) // limit to 6
            .map(album => (
              <AlbumCard key={album.id} album={album} />
            ))}
        </SimpleGrid>

        {/* Recent Reviews Section */}
        <Title order={2} ta="left" mt="xl" mb="md" c="white">Recent Reviews</Title>
        <SimpleGrid cols={1} spacing="md">
          {recent_reviews.slice(0, 5).map(r => (
            <Card
              key={r.id}
              shadow="md"
              padding="md"
              radius="md"
              className="glass-card"
              bg="#4c5897"
            >
              <div style={{ display: 'flex', gap: 16 }}>
                {/* Album cover with link */}
                <Link to={`/albums/${r.album_id}`}>
                  <img
                    src={r.album_cover_url}
                    alt={`${r.album_title} cover`}
                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
                  />
                </Link>
                {/* Review details */}
                <div style={{ flex: 1 }}>
                  <Text c="white" fw={600}>{r.album_title}</Text>
                  <Rating value={r.score} readOnly size="sm" color="yellow" />
                  <Text c="gray">{r.review}</Text>
                  <Link to={`/users/${r.user_id}`} style={{ textDecoration: 'none' }}>
                    <Text size="s" c="blue" fw={500} style={{ cursor: 'pointer' }}>
                      - {r.user_name}
                    </Text>
                  </Link>
                  <Text size="xs" c="dimmed">{new Date(r.created_at).toLocaleString()}</Text>
                </div>
              </div>
            </Card>
          ))}
        </SimpleGrid>

      </div>
    </Container>
  );
}
