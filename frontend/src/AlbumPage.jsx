// AlbumPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Group, Stack, Text, Card, Button } from '@mantine/core';
import AlbumCard from './AlbumCard.jsx';
import ReviewCard from './ReviewCard.jsx';
import RatingSubmission from './components/RatingSubmission.jsx';

export default function AlbumPage() {
  const { id } = useParams();
  const [album, set_album] = useState(null);
  const [reviews, set_reviews] = useState([]);
  const [username, set_username] = useState(null);
  const [user_id, set_user_id] = useState(null);
  const [editing, set_editing] = useState(false);

  const fetchAlbum = () => {
  fetch(`http://localhost:8000/api/albums/${id}`)
    .then(res => res.json())
    .then(set_album);
  };

  const refreshReviews = () => {
  fetch(`http://localhost:8000/api/albums/${id}/reviews`)
    .then(res => (res.ok ? res.json() : []))
    .then(set_reviews);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('user_id');

    if (storedUser) set_username(storedUser);
    if (storedUserId) set_user_id(parseInt(storedUserId));

    fetchAlbum();       
    refreshReviews();
  }, [id]);

  if (!album) return <Text align="center" p="lg" c="white">Loading...</Text>;

  const userReview = reviews.find((r) => r.user_id === user_id);
  const otherReviews = reviews.filter((r) => r.user_id !== user_id);

  return (
    <Container py="lg">
      <Link to="/" className="login-button" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
        ← Back to Albums
      </Link>
      <Group align="flex-start" mt="lg" justify="center">
        <Stack spacing="md" style={{ marginRight: '100px' }}>
          <AlbumCard album={album} />
          <Card className="glass-card" bg="#4c5897" style={{ textAlign: 'center' }}>
            <Text weight={600} color="white" size="lg">
              Average Score: {album.average_score?.toFixed(1) || 'N/A'}
            </Text>
          </Card>
        </Stack>

        <Stack spacing="md">
          {/* User's review section */}
          {username && (
            <>
              {!userReview && !editing && (
                <RatingSubmission album_id={id} onSubmit={refreshReviews} />
              )}
              
              {userReview && !editing && (
                <Stack spacing="sm">
                  <Text c="gray" size="sm" fw={600}>Your Review</Text>
                  <ReviewCard review={userReview} />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => set_editing(true)}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    Edit Review
                  </Button>
                </Stack>
              )}

              {editing && (
                <RatingSubmission
                  album_id={id}
                  onSubmit={() => {
                    refreshReviews();
                    fetch(`http://localhost:8000/api/albums/${id}`)
                      .then(res => res.json())
                      .then(set_album);
                    set_editing(false);
                  }}
                  onCancel={() => set_editing(false)}
                  initialScore={userReview?.score}
                  initialReview={userReview?.review}
                  isEditing={true}
                />
              )}
            </>
          )}

          {/* Other users' reviews */}
          {otherReviews.length > 0 && (
            <Stack spacing="md" mt="xl">
              <Text c="white" size="lg" fw={600}>Other Reviews</Text>
              {otherReviews.map((review) => (
                <div key={review.id} style={{ width: 400 }}>
                  <ReviewCard review={review} />
                </div>
              ))}
            </Stack>
          )}

          {reviews.length === 0 && (
            <Text c="gray" mt="xl">No reviews yet. Be the first to review!</Text>
          )}
        </Stack>
      </Group>
    </Container>
  );
}