// UserPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {Container, Title, Text, Card, Stack, Rating, Button, Group, SimpleGrid} from '@mantine/core';

// This component fetches and displays user profile information and their reviews.
export default function user_page() {
  const { id } = useParams();
  const [user, set_user] = useState(null);
  const current_user_id = parseInt(localStorage.getItem("user_id"));

  // Delete list with confirmation and update state
  const handle_delete_list = async (list_id, name) => {
    const confirm = window.confirm(`Delete list "${name}"?`);
    if (!confirm) return;

    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8000/api/lists/${list_id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      set_user(prev => ({
        ...prev,
        lists: prev.lists.filter(l => l.id !== list_id),
      }));
      notifications.show({
        title: 'List Deleted',
        message: `"${name}" was removed.`,
        color: 'red',
        autoClose: 2000,
      });
    }
  };

  // Fetch user data on id change
  useEffect(() => {
    fetch(`http://localhost:8000/api/users/${id}`)
      .then(res => res.json())
      .then(set_user)
      .catch(() => set_user(null));
  }, [id]);

  if (!user) return <Text align="center" p="lg" c="white">Loading user profile...</Text>;

  return (
    <Container size="xl" py="lg">
      <Title order={2} mt="md" c="white">{user.username}</Title>

      {/* Show email only if current user matches */}
      {current_user_id === user.id && (
        <Text c="gray" mb="md">Email: {user.email}</Text>
      )}

      <SimpleGrid cols={2}>
        {/* Reviews section */}
        <div>
          <Title order={4} mt="lg" c="white">Reviews:</Title>
          <Stack spacing="sm" className="modal-glass-card">
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
        </div>

        {/* Lists section */}
        <div>
          <Title order={4} mt="xl" c="white">Lists:</Title>
          <Stack spacing="sm" className="modal-glass-card">
            {user.lists.length > 0 ? user.lists.map(list => (
              <Card key={list.id} className="glass-card" bg="#4c5897">
                <Group position="apart" align="center">
                  <Link
                    to={`/user/lists/${list.id}`}
                    style={{ color: 'white', textDecoration: 'none', fontWeight: 600 }}
                  >
                    {list.name}
                  </Link>
                  {current_user_id === user.id && (
                    <Button
                      size="xs"
                      color="red"
                      variant="outline"
                      onClick={() => handle_delete_list(list.id, list.name)}
                    >
                      Delete
                    </Button>
                  )}
                </Group>

                {/* Show album items in list */}
                {list.items && (
                  <Group>
                    {list.items.map(item => (
                      <div key={item.id}>
                        {item.album?.cover_url && (
                          <Link to={`/albums/${item.album_id}`}>
                            <img
                              src={item.album.cover_url}
                              style={{
                                width: 80,
                                height: 80,
                                objectFit: 'cover',
                                borderRadius: 8,
                                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                                cursor: 'pointer',
                              }}
                            />
                          </Link>
                        )}
                        {item.album?.title && (
                          <Text c="white" size="sm" mt={4}>
                            {item.album.title} — {item.album.artist}
                          </Text>
                        )}
                      </div>
                    ))}
                  </Group>
                )}
              </Card>
            )) : (
              <Text c="gray">No lists yet.</Text>
            )}
          </Stack>
        </div>
      </SimpleGrid>
    </Container>
  );
}

