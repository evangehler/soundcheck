import { Card, Text, Blockquote, Rating, Group } from '@mantine/core';
import { Link } from 'react-router-dom';

// Displays on corresponding album pages
export default function review_card({ review }) {
  // Format review creation date
  const formatted_date = new Date(review.created_at).toLocaleString();

  return (
    <Card
      shadow="sm"
      bg="rgba(38, 46, 74, 0.4)"
      padding="md"
      style={{ maxWidth: 500, margin: 'none', alignSelf: "right", borderRadius: 15 }}
    >
      {/* Review text */}
      <Blockquote color="white" style={{ borderRadius: 15, borderLeft: 'none' }}>
        <Text c="white">{review.review}</Text>
      </Blockquote>

      {/* Reviewer info and score */}
      <Group justify="space-between" mt="xs">
        <div>
          <Link
            to={`/users/${review.user_id}`}
            style={{ color: 'lightblue', fontWeight: 500, textDecoration: 'none' }}
          >
            {review.user_name}
          </Link>
          <Text size="xs" color="gray">{formatted_date}</Text>
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

