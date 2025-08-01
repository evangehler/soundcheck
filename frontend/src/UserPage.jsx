// UserPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Title, Text, Card, Stack, Rating } from '@mantine/core';

export default function UserPage() {
  const { id } = useParams();
  const [user, set_user] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/users/${id}`)
      .then(res => res.json())
      .then(set_user)
      .catch(() => set_user(null));
  }, [id]);

  if (!user) return <Text align="center" p="lg" c="white">Loading user profile...</Text>;

  return (
    <Container size="sm" py="lg">
      <Link to="/" style={{ color: '#60a5fa', textDecoration: 'underline' }}>← Back to Albums</Link>
      <Title order={2} mt="md" c="white">User: {user.username}</Title>
      <Text c="gray" mb="md">Email: {user.email}</Text>

      <Title order={4} mt="lg" c="white">Reviews:</Title>
      <Stack spacing="sm">
        {user.reviews.length > 0 ? user.reviews.map((rev, i) => (
          <Card key={i} className="glass-card" bg="#4c5897">
            <Link to={`/albums/${rev.album_id}`} style={{ color: 'white', fontWeight: 600, textDecoration: 'none' }}>
              {rev.album_title}
            </Link>
            <Rating value={rev.score} readOnly fractions={2} size="md" color="yellow" />
            <Text c="gray">{rev.review}</Text>
          </Card>
        )) : (
          <Text c="gray">No reviews yet.</Text>
        )}
      </Stack>
    </Container>
  );
}
// This component fetches and displays user profile information and their reviews.