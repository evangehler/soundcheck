import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Group, Stack, Text,Card } from '@mantine/core';
import AlbumCard from './AlbumCard.jsx';
import ReviewCard from './ReviewCard.jsx';

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
      <Link to="/" className={"login-button"} style={{ color: '#60a5fa', textDecoration: 'underline' }}>← Back to Albums</Link>
      <Group align="flex-start" mt="lg" justify="center">

        <Stack spacing="md" style={{ marginRight: '100px' }}>
          <AlbumCard album={album}/>

          <Card className="glass-card" bg={"#4c5897"} style={{display:"flex", justifyContent:"center", alignItems:"center",textAlign:"center"}}>
            <Text weight={600} color="white" size="lg" ta="center">
              Average Score: {album.average_score ? album.average_score.toFixed(1) : 'N/A'}
            </Text>
          </Card>
        </Stack>

        <Stack spacing="md" >
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
