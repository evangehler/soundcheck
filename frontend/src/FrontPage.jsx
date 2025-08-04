import { SimpleGrid, Title, Container, Text, Card } from '@mantine/core';
import { useEffect, useState } from 'react';
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
              <Text c="white" fw={600}>{r.user_name} rated {r.score}/5</Text>
              <Text c="gray">{r.review}</Text>
              <Text size="xs" c="dimmed">{new Date(r.created_at).toLocaleString()}</Text>
            </Card>
          ))}
        </SimpleGrid>

      </div>
    </Container>
  );
}
