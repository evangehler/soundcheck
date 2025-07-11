import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Group, Stack, Text } from '@mantine/core';
import AlbumCard from './AlbumCard';
import ReviewCard from './ReviewCard';

export default function AlbumPage() {
  const { id } = useParams();
  const [album, set_album] = useState(null);
  const [reviews, set_reviews] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/albums/${id}`)
      .then(res => res.json())
      .then(set_album)
      .catch(() => set_album(null));

    fetch(`http://localhost:8000/api/albums/${id}/reviews`)
      .then(res => (res.ok ? res.json() : []))
      .then(set_reviews)
      .catch(() => set_reviews([]));
  }, [id]);

  if (!album) return <Text align="center" p="lg" c="white">Loading...</Text>;

  return (
    <Container py="lg">
      <Link to="/" style={{ color: '#60a5fa', textDecoration: 'underline' }}>← Back to Albums</Link>
      <Group align="flex-start" spacing="xl" mt="lg">
        <Text weight={600} color="white" size="lg" mb="sm">
        Average Score: {album.avg_score ? album.avg_score.toFixed(1) : 'N/A'}
        </Text>
        <AlbumCard album={album} />
        <Stack spacing="md" style={{ flex: 1, alignItems: 'center' }}>
        {reviews.length > 0 ? (
            reviews.map((review) => (
            <div key={review.id} style={{ width: 400 }}>
                <ReviewCard review={review} />
            </div>
            ))
        ) : (
            <Text c="gray">No reviews yet.</Text>
        )}
        </Stack>
      </Group>
    </Container>
  );
}
