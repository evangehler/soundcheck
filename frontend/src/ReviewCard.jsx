import { Card, Text, Blockquote, Rating, Group } from '@mantine/core';
import { Link } from 'react-router-dom';

export default function ReviewCard({ review }) {
  return (
    <Card shadow="sm" radius="md" bg="#4c5897" padding="md" style={{ maxWidth: 500, margin: 'auto', alignSelf: "right" }}>
      <Blockquote
        color="white"
        cite={
          <Link to={`/users/${review.user_id}`} style={{ color: 'lightblue' }}>
            – {review.user_name}
          </Link>
        }
      >
        <Text c="white">{review.review}</Text>
      </Blockquote>

      <Group justify="flex-end" mt="sm">
        <Rating
          value={review.score}
          fractions={2}       // allows 0.5 steps
          readOnly
          size="lg"
          color="pink"
        />
      </Group>
    </Card>
  );
}