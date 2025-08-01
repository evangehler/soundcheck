// AlbumPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Group, Stack, Text, Card, Button, Rating } from '@mantine/core';
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
      <Link to="/" className="" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
        ← Back to Albums
      </Link>
      <Group align="flex-start" mt="lg" justify="center" style={{ gap: '2rem' }} className="modal-glass-card">
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Left: Album Info */}
          <div style={{ width: 400 }}>
            <Stack spacing="sm">
              <img 
                src={album.cover_url} 
                alt={`${album.title} cover`} 
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  objectFit: 'cover'
                }} 
              />


              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                <Text c="white" style={{ marginBottom: '0px' }} size="xl" fw={700}>{album.title}</Text>
                <Text c="gray.3" style={{ marginBottom: '0px' }} size="md" fw={500}>{album.artist} ({album.year})</Text>
              </div>
              
              <Card className="glass-card" bg="#4c5897" style={{ textAlign: 'center' }}>
                <div style ={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
                <Rating                          
                  value={album.average_score?.toFixed(1)}
                  fractions={2}
                  readOnly
                  size="lg"
                  color="yellow"
                 />
                </div>
               
                <Text weight={600} color="white" size="lg">
                  Average Score: {album.average_score?.toFixed(1) || 'N/A'}
                </Text>

              </Card>
            </Stack>
          </div>

          {/* Right: Your Review */}
          <div style={{ width: 400 }}>
            <Stack spacing="md">
              {username && (
                <>
                  {!userReview && !editing && (
                    <RatingSubmission 
                      album_id={id} 
                      onSubmit={() => {
                        refreshReviews();
                        fetch(`http://localhost:8000/api/albums/${id}`)
                          .then(res => res.json())
                          .then(set_album);
                      }} 
                    />
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
            </Stack>
          </div>
        </div>
      </Group>
      {/* All Other Reviews */}
      <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 500 }}>
          <Stack spacing="md">
            {otherReviews.length > 0 ? (
            <>
              <Text c="white" size="lg" fw={600}>All Reviews</Text>
              {otherReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </>
          ) : reviews.length === 0 ? (
            <Text c="gray" mt="xl">No reviews yet. Be the first to review!</Text>
          ) : null}
          </Stack>
        </div>
      </div>

    </Container>
  );
}