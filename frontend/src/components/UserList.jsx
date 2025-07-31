import { useEffect, useState } from 'react';
import {Container, Text, Group, Card, Title, SimpleGrid} from '@mantine/core';
import { Link } from 'react-router-dom';
import { useHover } from '@mantine/hooks';
import {Modal,Button,Stack} from '@mantine/core';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [hovered, set_hovered] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleDelete = async () => {
        if(!selectedUser || !selectedUser.id){
            console.error("no user selected");
            return;
        }
        const token = localStorage.getItem('token');
        try{
            const response = await fetch(`http://localhost:8000/api/users/${selectedUser.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if(!response.ok){
                throw new Error("failed");
            }
            setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
            setModalOpen(false);
            setSelectedUser(null);
        }catch (error){
            console.error("error whille deleting user", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("Token in useEffect:", token);

        if (!token) {
            console.warn("No token yet, waiting...");
        return;
        }

        fetch("http://localhost:8000/api/users", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        })
            .then((response) => {
            if (!response.ok) {
                throw new Error("Unauthorized");
            }
            return response.json();
            })
            .then((data) => {
            setUsers(data);
            })
            .catch((error) => {
                console.error("Error fetching users: ", error);
            });
        }, []);


      return (
          <Container fluid style={{ marginLeft: '2rem',marginRight: '2rem' }}>
          <div style={{ marginTop: '5rem' }}>
              <Title order={2} ta="center" mb="xl" c="white">Registered Users</Title>
          </div>

          <div
            onMouseEnter={() => set_hovered(true)}
            onMouseLeave={() => set_hovered(false)}>

            <Link to="/" className={'login-button'} style={{ color: '#60a5fa'}}>
               ← Back to Albums
            </Link>

            <Text weight={700} size="xl" color="white" mt="md" mb="lg">
                Registered Users
            </Text>

            {users.length > 0 ? (
                <SimpleGrid
                    cols={{lg:4,md:3,sm:2,xs:1}}
                    spacing={'lg'}
                    verticalSpacing={{ base: 'md', sm: 'lg'}}

                >
                    {users.map(user => (

                    <Card className="glass-card-users hover-card" style={{background: '#262e4a' ,width:'100%',maxWidth:'400px'}} key={user.id} onClick={() => {setSelectedUser(user); setModalOpen(true);}}>
                        <Text color="white"><strong>Username:</strong> {user.username}</Text>
                        <Text color="gray"><strong>Email:</strong> {user.email}</Text>
                    </Card>
                    ))}
                </SimpleGrid>
        ) : (

          <Text color="gray">
              No users found.
          </Text>
        )}
          </div>
              <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Confirm Delete" centered
                     classNames={{content: 'modal-glass-card', header:'glass-modal-header'}}
              >
                <Stack>
                    <Text>
                        Are you sure you want to delete user{' '}
                        <strong>{selectedUser?.username}</strong>?
                    </Text>
                    <Group justify="flex-end">
                        <Button className={'modal-button'} onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button className={'modal-button'} color="red" onClick={handleDelete}>
                        Delete
                        </Button>
                    </Group>
            </Stack>
      </Modal>
</Container>
  );
}
