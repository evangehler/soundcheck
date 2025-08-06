import { useEffect, useState } from 'react';
import {Container, Text, Group, Card, Title, SimpleGrid} from '@mantine/core';
import { Link } from 'react-router-dom';
import { useHover } from '@mantine/hooks';
import {Modal,Button,Stack} from '@mantine/core';

export default function user_list() {
  // State for users list
  const [users, set_users] = useState([]);
  // Track hover state (not used here but kept)
  const [hovered, set_hovered] = useState(false);
  // Selected user for delete confirmation
  const [selected_user, set_selected_user] = useState(null);
  // Modal open state for delete confirmation
  const [modal_open, set_modal_open] = useState(false);

  // Delete selected user
  const handle_delete = async () => {
    if (!selected_user?.id) {
      console.error("no user selected");
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8000/api/users/${selected_user.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("failed");
      // Remove deleted user from state
      set_users(prev => prev.filter(user => user.id !== selected_user.id));
      set_modal_open(false);
      set_selected_user(null);
    } catch (error) {
      console.error("error while deleting user", error);
    }
  };

  // Fetch all users on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // wait for token

    fetch("http://localhost:8000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(set_users)
      .catch(console.error);
  }, []);

  return (
    <Container fluid style={{ marginLeft: '2rem', marginRight: '2rem' }}>
      <div style={{ marginTop: '5rem' }}>
        <Title order={2} ta="center" mb="xl" c="white">Registered Users</Title>
      </div>

      {/* User list with hover effects */}
      <div onMouseEnter={() => set_hovered(true)} onMouseLeave={() => set_hovered(false)}>
        <Link to="/" className="login-button" style={{ color: '#60a5fa' }}>
          ← Back to Albums
        </Link>

        <Text weight={700} size="xl" color="white" mt="md" mb="lg">
          Registered Users
        </Text>

        {/* Display users or no users message */}
        {users.length > 0 ? (
          <SimpleGrid cols={{ lg: 4, md: 3, sm: 2, xs: 1 }} spacing="lg" verticalSpacing={{ base: 'md', sm: 'lg' }}>
            {users.map(user => (
              <Card
                key={user.id}
                className="glass-card-users hover-card"
                style={{ background: '#262e4a', width: '100%', maxWidth: 400 }}
                onClick={() => { set_selected_user(user); set_modal_open(true); }}
              >
                <Text color="white"><strong>Username:</strong> {user.username}</Text>
                <Text color="gray"><strong>Email:</strong> {user.email}</Text>
              </Card>
            ))}
          </SimpleGrid>
        ) : (
          <Text color="gray">No users found.</Text>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal
        opened={modal_open}
        onClose={() => set_modal_open(false)}
        title="Confirm Delete"
        centered
        classNames={{ content: 'modal-glass-card', header: 'glass-modal-header' }}
      >
        <Stack>
          <Text>
            Are you sure you want to delete user <strong>{selected_user?.username}</strong>?
          </Text>
          <Group justify="flex-end">
            <Button className="modal-button" onClick={() => set_modal_open(false)}>Cancel</Button>
            <Button className="modal-button" color="red" onClick={handle_delete}>Delete</Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
