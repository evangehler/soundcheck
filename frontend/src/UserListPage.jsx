// UserListPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Title, Card, Text, Button, Group, Rating } from '@mantine/core';

export default function UserListPage() {
  const { id } = useParams(); // list_id
  const [list, setList] = useState(null);
  const userId = localStorage.getItem("user_id");

  const fetchList = () => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8000/api/lists/${id}/full`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setList);
  };

  const handleRemove = async (albumId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8000/api/lists/${id}/remove/${albumId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      setList(prev => ({
        ...prev,
        items: prev.items.filter(item => item.album_id !== albumId)
      }));
      notifications.show({
        title: 'Removed',
        message: 'Album removed from list.',
        color: 'red',
      });
    }
  };

  useEffect(() => {
    fetchList();
  }, [id]);

  if (!list) return <Text c="white">Loading...</Text>;

  return (
    <Container py="lg">
      <Link to={`/users/${userId}`} style={{ color: '#60a5fa', textDecoration: 'underline' }}>
        ← Back to Profile
    </Link>

      <Title order={2} mt="md" c="white">{list.name}</Title>

      {list.items.length === 0 ? (
        <Text c="gray" mt="md">No albums in this list.</Text>
      ) : (
        list.items.map(item => (
          <Card key={item.id} className="glass-card" bg="#4c5897" mt="md">
            <Group position="apart" align="center">
              <div>
                <Link
                  to={`/albums/${item.album_id}`}
                  style={{ fontWeight: 600, color: 'white', textDecoration: 'none' }}
                >
                  {item.album.title} — {item.album.artist}
                </Link>
                <Rating value={item.album.average_score} readOnly size="sm" color="yellow" mt={4} />
              </div>
              <Button
                color="red"
                variant="outline"
                size="xs"
                onClick={() => handleRemove(item.album_id)}
              >
                Remove
              </Button>
            </Group>
          </Card>
        ))
      )}
    </Container>
  );
}
