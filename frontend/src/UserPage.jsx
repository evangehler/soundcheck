// UserPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {Container, Title, Text, Card, Stack, Rating, Button, Group, SimpleGrid} from '@mantine/core';

export default function UserPage() {
  const { id } = useParams();
  const [user, set_user] = useState(null);
  const currentUserId = parseInt(localStorage.getItem("user_id"));


  const handleDeleteList = async (listId, name) => {
  const confirm = window.confirm(`Delete list "${name}"?`);
  if (!confirm) return;

  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:8000/api/lists/${listId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  if (res.ok) {
    set_user(prev => ({
      ...prev,
      lists: prev.lists.filter(l => l.id !== listId)
    }));
    notifications.show({
      title: 'List Deleted',
      message: `"${name}" was removed.`,
      color: 'red',
      autoClose: 2000,
    });
  }
};

  useEffect(() => {
    fetch(`http://localhost:8000/api/users/${id}`)
      .then(res => res.json())
      .then(set_user)
      .catch(() => set_user(null));
  }, [id]);

  if (!user) return <Text align="center" p="lg" c="white">Loading user profile...</Text>;
  return (
    <Container size="xl" py="lg" >
      <Link to="/" style={{ color: '#60a5fa', textDecoration: 'underline' }}>← Back to Albums</Link>
      <Title order={2} mt="md" c="white">User: {user.username}</Title>
      {currentUserId === user.id && (
        <Text c="gray" mb="md">Email: {user.email}</Text>
      )}
      <SimpleGrid cols={2}>
        <div>
      <Title order={4} mt="lg" c="white">Reviews:</Title>
          <Stack spacing="sm" className={"modal-glass-card"}>
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
        <div>
              <Title order={4} mt="xl" c="white">Lists:</Title>
              <Stack spacing="sm" className="modal-glass-card">
                {user.lists.length > 0 ? user.lists.map((list) => (
                  <Card key={list.id} className="glass-card" bg="#4c5897">
                    <Group position="apart" align="center">
                      <Link
                        to={`/user/lists/${list.id}`}
                        style={{ color: 'white', textDecoration: 'none', fontWeight: 600 }}
                      >
                        {list.name}
                      </Link>
                      {currentUserId === user.id && (
                        <Button
                          size="xs"
                          color="red"
                          variant="outline"
                          onClick={() => handleDeleteList(list.id, list.name)}
                        >
                          Delete
                        </Button>
                      )}
                    </Group>

                      {list.items && (
                    <Group>
                      {list.items.map(item => (
                      <div key={item.id}>
                      {item.album?.cover_url && (
                      <Link to={`/albums/${item.album_id}`}>
                        <img
                          src={item.album.cover_url}
                         style={{width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: '8px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                      cursor: 'pointer'
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
// This component fetches and displays user profile information and their reviews.