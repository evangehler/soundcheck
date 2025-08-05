import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container, Title, Card, Text, Button, Group, Rating, Stack
} from '@mantine/core';


export default function UserListPage() {
  const { id } = useParams(); // list_id
  const [list, setList] = useState(null);
  const [owner, setOwner] = useState(null);
  const currentUserId = parseInt(localStorage.getItem("user_id"));

  const fetchList = () => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8000/api/lists/${id}/full`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setList(data);
        if (data.user_id) {
          fetch(`http://localhost:8000/api/users/${data.user_id}`)
            .then(res => res.json())
            .then(setOwner);
        }
      });
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

      <Text c="gray" mt="xs">
        List by{' '}
        <Link to={`/users/${list.user_id}`} style={{ color: 'lightblue', textDecoration: 'none' }}>
          {owner?.username || `user #${list.user_id}`}
        </Link>
      </Text>

      {owner && (
        <>
          <Title order={2} mt="md" c="white">User: {owner.username}</Title>
          <Text c="gray" mb="md">Email: {owner.email}</Text>
        </>
      )}

      <div className = {'modal-glass-card'} style={{padding:'1rem'}}>

      <Title order={3} mt="lg" c="white">{list.name}</Title>

      <Stack mt="md">
        {list.items.length === 0 ? (
          <Text c="gray">No albums in this list.</Text>
        ) : (
          list.items.map(item => (
            <Card key={item.id} className="glass-card" bg="#4c5897" style={{ width: '100%' }}>
              <Group justify="space-between" align="center" spacing="md" style={{ flex: 1 }}>
                <Group spacing="md" align="center">
                  <Link to={`/albums/${item.album_id}`}>
                    <img
                      src={item.album.cover_url}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: '8px',
                        boxShadow: '0 2px 6px rgba( Patreon0,0,0,0.3)',
                        cursor: 'pointer',
                      }}
                    />
                  </Link>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Link
                      to={`/albums/${item.album_id}`}
                      style={{
                        fontWeight: 600,
                        color: 'white',
                        textDecoration: 'none',
                        marginBottom: 4,
                      }}
                    >
                      {item.album.title} — {item.album.artist}
                    </Link>
                    <Rating
                      value={item.album.average_score}
                      readOnly
                      size="sm"
                      color="yellow"
                    />
                  </div>
                </Group>
                {currentUserId === list.user_id && (
                  <Button
                    color="red"
                    variant="outline"
                    size="xs"
                    onClick={() => handleRemove(item.album_id)}
                  >
                    Remove
                  </Button>
                )}
              </Group>
            </Card>
          ))
        )}
      </Stack>
      </div>
    </Container>
  );
}
