import { SimpleGrid, Image, Title, Container } from '@mantine/core';
import { useEffect, useState } from 'react';
import AlbumCard from './AlbumCard';
import logo from './assets/soundcheck logo.png';
import { Button, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function FrontPage() {
  const [albums, set_albums] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetch('http://localhost:8000/api/albums')
      .then(res => res.json())
      .then(set_albums);
  }, []);

  return (
    <Container py="lg">
        <Group position="right" mb="md" style={{ position: 'absolute', top: 10, right: 10, gap: '8px' }}>
        <Button variant="outline" onClick={() => navigate('/login')}>
            Login
        </Button>
        <Button variant="filled" onClick={() => navigate('/signup')}>
            Sign Up
        </Button>
        </Group>

      <div style={{ position: 'absolute', top: 3, left: 3, width: 100}}>
         <Image src={logo} alt="Logo" fit="contain" />
      </div>

      <div style={{ marginTop: '8rem'}}>
      <Title order={2} ta="center" mb="lg" c="white">Featured Albums</Title>
      <SimpleGrid cols={5} spacing="lg" breakpoints={[
        { maxWidth: 'lg', cols: 4 },
        { maxWidth: 'md', cols: 3 },
        { maxWidth: 'sm', cols: 2 },
        { maxWidth: 'xs', cols: 1 },
      ]}>
        {albums.map(album => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </SimpleGrid>
      </div>
    </Container>
  );
}
