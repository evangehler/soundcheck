import { SimpleGrid, Title, Container, Text, Card, Rating, Button } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AlbumCard from './AlbumCard.jsx';

export default function FrontPage() {
  const [topRated, setTopRated] = useState([]);
  const [newest, setNewest] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/albums/top-rated')
      .then(res => res.json())
      .then(setTopRated);

    fetch('http://localhost:8000/api/albums/newest')
      .then(res => res.json())
      .then(setNewest);

    fetch('http://localhost:8000/api/reviews/recent')
      .then(res => res.json())
      .then(setRecentReviews);
  }, []);

  return (
    <Container size="xl" py="sm" style={{ padding: '10px', marginTop: '2px' }}>
      <div style={{ marginTop: '5rem' }}>

        <Title order={2} ta="left" mb="md" c="white">Top Rated Albums</Title>
        <SimpleGrid cols={{ base: 1, sm: 3, md: 4, xl: 6 }} spacing="md">
          {topRated.map(album => <AlbumCard key={album.id} album={album} />)}
        </SimpleGrid>

        <Title order={2} ta="left" mt="xl" mb="md" c="white">Newest Albums</Title>
        <SimpleGrid cols={{ base: 1, sm: 3, md: 4, xl: 6 }} spacing="md">
          {newest.map(album => <AlbumCard key={album.id} album={album} />)}
        </SimpleGrid>

        <Title order={2} ta="left" mt="xl" mb="md" c="white">Recent Reviews</Title>
        <SimpleGrid cols={1} spacing="md">
          {recentReviews.map((r) => (
            <Card key={r.id} shadow="md" padding="md" radius="md" className="glass-card" bg="#4c5897">
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to={`/albums/${r.album_id}`}>
                  <img 
                    src={r.album_cover_url} 
                    alt={`${r.album_title} cover`} 
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }} 
                  />
                </Link>
                <div style={{ flex: 1 }}>
                  <Text c="white" fw={600}>{r.album_title}</Text>
                  <Rating value={r.score} readOnly size="sm" color="yellow" />
                  <Text c="gray">{r.review}</Text>
                  <Link to={`/users/${r.user_id}`} style={{ textDecoration: 'none' }}>
                    <Text size="s" c="blue" fw={500} style={{ cursor: 'pointer' }}>
                      -  {r.user_name}
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
