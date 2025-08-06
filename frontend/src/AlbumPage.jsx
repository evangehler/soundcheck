import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container, Group, Stack, Text, Button, Rating, Menu, Loader, ScrollArea,
  Modal, TextInput
} from '@mantine/core';
import ReviewCard from './ReviewCard.jsx';
import RatingSubmission from './components/RatingSubmission.jsx';

export default function AlbumPage() {
  const { id } = useParams();
  const [album, set_album] = useState(null);
  const [reviews, set_reviews] = useState([]);
  const [username, set_username] = useState(null);
  const [user_id, set_user_id] = useState(null);
  const [editing, set_editing] = useState(false);

  const [lists, setLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [addedListId, setAddedListId] = useState(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');

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

  const fetchLists = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8000/api/lists", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setLists(data); 
        setLoadingLists(false);
      });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('user_id');

    if (storedUser) set_username(storedUser);
    if (storedUserId) set_user_id(parseInt(storedUserId));

    fetchAlbum();
    refreshReviews();
    fetchLists();
  }, [id]);

  const isInList = (list) => list.items?.some(item => item.album_id === parseInt(id));

const handleAddToList = async (listId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:8000/api/lists/${listId}/add`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ album_id: parseInt(id) })
  });

  if (res.ok) {
    setLists(prev =>
      prev.map(list =>
        list.id === listId
          ? { ...list, items: [...(list.items || []), { album_id: parseInt(id) }] }
          : list
      )
    );
  }
};

const handleRemoveFromList = async (listId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:8000/api/lists/${listId}/remove/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  if (res.ok) {
    setLists(prev =>
      prev.map(list =>
        list.id === listId
          ? { ...list, items: list.items?.filter(item => item.album_id !== parseInt(id)) }
          : list
      )
    );
  }
};
  const handleCreateList = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/lists", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newListName }),
    });

    if (res.ok) {
      const newList = await res.json();
      setLists((prev) => [...prev, newList]);
      setNewListName('');
      setCreateModalOpen(false);
    }
  };

  const userReview = reviews.find((r) => r.user_id === user_id);
  const sorted_reviews = [...reviews].sort((a, b) => {
    if (a.user_id === user_id) return -1;
    if (b.user_id === user_id) return 1;
    return 0;
  });

  if (!album) return <Text align="center" p="lg" c="white">Loading...</Text>;

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
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '2rem',
          width: '100%',
          marginTop: '2rem',
        }}>
          <Group
            align="flex-start"
            mt="lg"
            justify="center"
            style={{
              gap: '1rem',
              backgroundColor: 'rgba(38, 46, 74, 0.4)',
              width: 'fit-content',
              borderRadius: 15,
              display: 'inline-block',
            }}
            className="modal-glass-card"
          >
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
                <Text align="center" c="white" size="xl" fw={700}>
                  {album.title}
                </Text>
                <Text align="center" c="gray.6" size="md" fw={500}>
                  {album.artist} ({album.year})
                </Text>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                  <Text weight={600} color="white" size="xl">
                    {album.average_score?.toFixed(1) || 'N/A'}
                  </Text>
                  <Rating
                    value={album.average_score?.toFixed(1)}
                    fractions={2}
                    readOnly
                    size="lg"
                    color="yellow"
                  />
                  {user_id && (
                    <div style={{ position: 'relative', overflow: 'visible', zIndex: 1 }}>
                      <Menu shadow="md" width={220} position="bottom-end" zIndex={1000} closeOnItemClick={false}>
                        <Menu.Target>
                          <Button variant="outline" color="cyan">
                            Add to List
                          </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                          {loadingLists ? (
                            <Menu.Item disabled>Loading...</Menu.Item>
                          ) : lists.length === 0 ? (
                            <Menu.Item disabled>No lists found</Menu.Item>
                          ) : (
                            lists.map(list => {
                              const inList = list.items?.some(item => item.album_id === parseInt(id));
                              return (
                                <Menu.Item
                                  key={list.id}
                                  onClick={() =>
                                    inList ? handleRemoveFromList(list.id) : handleAddToList(list.id)
                                  }
                                >
                                  {list.name}
                                  {inList && (
                                    <span style={{ color: 'green', marginLeft: 8 }}>✓</span>
                                  )}
                                </Menu.Item>
                              );
                            })
                          )}
                          <Menu.Divider />
                          <Menu.Item color="blue" onClick={() => setCreateModalOpen(true)}>
                            ➕ Create New List
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </div>
                  )}
                </div>
              </Stack>
            </div>
          </Group>

          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center'}}>
            <div style={{ width: 500 }}>
              <Text align="center" c="white" size="xl" fw={600}>
                Reviews
              </Text>
              <ScrollArea h={500} type="always" scrollbarSize={6} styles={{
                scrollbar: { backgroundColor: 'transparent' },
                thumb: { backgroundColor: 'white', borderRadius: 4 },
              }}>
                <Stack spacing="md" style={{ paddingRight: 12 }}>
                  {!userReview && user_id && (
                    <RatingSubmission
                      album_id={id}
                      onSubmit={() => {
                        refreshReviews();
                        fetchAlbum();
                      }}
                      onCancel={() => {}}
                      initialScore={0}
                      initialReview=""
                      isEditing={false}
                    />
                  )}
                  {sorted_reviews.map((review) => (
                    <div key={review.id} style={{ position: 'relative',borderRadius: 15 }} >
                      {review.user_id === user_id && editing ? (
                        <RatingSubmission
                          album_id={id}
                          onSubmit={() => {
                            refreshReviews();
                            fetchAlbum();
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
                              style={{ position: 'absolute', top: 16, right: 16, borderRadius: 15 }}
                              onClick={() => set_editing(true)}
                            >
                              Edit
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                  {reviews.length === 0 && (
                    <Text c="gray" mt="xl">No reviews yet. Be the first to review!</Text>
                  )}
                </Stack>
              </ScrollArea>
            </div>
          </div>
        </div>
      </Container>

      {/* Modal for creating a list */}
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New List"
        centered
        classNames={{content: 'modal-glass-card', header:'glass-modal-header'}}
      >
        <TextInput
          label="List Name"
          placeholder="e.g. Favorite Albums"
          value={newListName}
          onChange={(e) => setNewListName(e.currentTarget.value)}
        />
        <Button
          mt="md"
          onClick={handleCreateList}
          disabled={!newListName.trim()}
        >
          Create
        </Button>
      </Modal>
    </div>
  );
}
