// AlbumPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Group, Stack, Text, Card, Button, Rating } from '@mantine/core';
import ReviewCard from './ReviewCard.jsx';
import { ScrollArea } from '@mantine/core';
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

  const sorted_reviews = [...reviews].sort((a, b) => {
  if (a.user_id === user_id) return -1;
  if (b.user_id === user_id) return 1;
  return 0;
});

return (
  <div style={{ position: 'relative', overflow: 'hidden' }}>
    <img
      src={album.cover_url}
      alt=""
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        objectFit: 'cover',
        filter: 'blur(20px) brightness(0.2)',
        zIndex: -1,
      }}
    />
    <Container py="lg" style={{ marginLeft: 50, maxWidth: '100%', paddingLeft: '1rem' }}>
      <Link to="/" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
        ← Back to Albums
      </Link>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'nowrap', width: '100%', justifyContent: 'space-between' }}>
        <Group
          align="flex-start"
          mt="lg"
          justify="center"
          style={{
            gap: '1rem',
            backgroundColor: 'rgba(38, 46, 74, 0.4)',
            width: 'fit-content',
            marginLeft: 0,
            borderWidth: 0,
            borderRadius: 5,
            display: 'inline-block',
            alignSelf: 'flex-start',
          }}
          className="modal-glass-card"
        >
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Album Info */}
            <div style={{ width: 400 }}>
              <Stack spacing="sm">
                <img
                  src={album.cover_url}
                  alt={`${album.title} cover`}
                  style={{
                    width: '100%',
                    borderRadius: '6px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    objectFit: 'cover',
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                  <Text c="white" style={{ marginBottom: '0px', textAlign: 'center' }} size="xl" fw={700}>
                    {album.title}
                  </Text>
                  <Text c="gray.6" style={{ marginBottom: '0px', textAlign: 'center' }} size="md" fw={500}>
                    {album.artist} ({album.year})
                  </Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
                  <Text weight={600} color="white" size="xl">
                    {album.average_score?.toFixed(1) || 'N/A'}
                  </Text>
                  <Rating
                    style={{ marginLeft: '1rem' }}
                    value={album.average_score?.toFixed(1)}
                    fractions={2}
                    readOnly
                    size="lg"
                    color="yellow"
                  />
                </div>
              </Stack>
            </div>
          </div>
        </Group>

        {/* Reviews */}
        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 500, marginRight: '10rem' }}>
            <Text style={{ textAlign: 'center' }} c="white" size="xl" fw={600}>
              Reviews
            </Text>
            <ScrollArea
              h={500}
              type="always"
              scrollbarSize={6}
              styles={{
                scrollbar: { backgroundColor: 'transparent' },
                thumb: { backgroundColor: 'white', borderRadius: 4 },
              }}
            >
              <Stack spacing="md" style={{ paddingRight: 12 }}>
                {sorted_reviews.length > 0 ? (
                  <>
                    {sorted_reviews.map((review) => (
                      <div key={review.id} style={{ position: 'relative' }}>
                        {review.user_id === user_id && editing ? (
                          <RatingSubmission
                            album_id={id}
                            onSubmit={() => {
                              refreshReviews();
                              fetch(`http://localhost:8000/api/albums/${id}`)
                                .then((res) => res.json())
                                .then(set_album);
                              set_editing(false);
                            }}
                            onCancel={() => set_editing(false)}
                            initialScore={review.score}
                            initialReview={review.review}
                            isEditing={true}
                          />
                        ) : (
                          <>
                            <ReviewCard review={review} />
                            {review.user_id === user_id && !editing && (
                              <Button
                                variant="subtle"
                                size="sm"
                                style={{ position: 'absolute', top: 16, right: 16 }}
                                onClick={() => set_editing(true)}
                              >
                                Edit
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <Text c="gray" mt="xl">
                    No reviews yet. Be the first to review!
                  </Text>
                )}
              </Stack>
            </ScrollArea>
          </div>
        </div>
      </div>
    </Container>
  </div>
);
}