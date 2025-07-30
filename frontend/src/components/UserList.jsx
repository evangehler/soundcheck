import { useEffect, useState } from 'react';
import {Container, Text, Group, Card, Title, SimpleGrid} from '@mantine/core';
import { Link } from 'react-router-dom';
import { useHover } from '@mantine/hooks';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [hovered, set_hovered] = useState(false);

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

                    <Card className="glass-card-users hover-card" style={{background: '#262e4a' ,width:'100%',maxWidth:'400px'}} key={user.id}>
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
</Container>
  );
}
