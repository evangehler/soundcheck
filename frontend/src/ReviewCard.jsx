import { Card, Text, Blockquote, Rating, Group } from '@mantine/core';
import { Link } from 'react-router-dom';

export default function ReviewCard({ review }) {
  const formattedDate = new Date(review.created_at).toLocaleString();

  return (
    <Card
      shadow="sm"
      radius="md"
      bg='rgba(38, 46, 74, 0.4)'
      padding="md"
      style={{ maxWidth: 500, margin: 'none', alignSelf: "right" }}
    >
      <Blockquote color="white" style={{ borderLeft: 'none'}}>
        <Text c="white">{review.review}</Text>
      </Blockquote>

      <Group justify="space-between" mt="xs">
        <div>
          <Link to={`/users/${review.user_id}`} style={{ color: 'lightblue', fontWeight: 500, textDecoration: 'none' }}>
            {review.user_name}
          </Link>
          <Text size="xs" color="gray">{formattedDate}</Text>
        </div>

        <Rating
          value={review.score}
          fractions={2}
          readOnly
          size="lg"
          color="yellow"
        />
      </Group>
    </Card>
  );
}
