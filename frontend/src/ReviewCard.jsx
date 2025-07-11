import { Card, Text, Blockquote } from '@mantine/core';

export default function ReviewCard({ review }) {
  return (
    <Card shadow="sm" radius="md" bg="#4c5897" padding="md" style={{ maxWidth: 500, margin: 'auto' }}>
      <Blockquote color="white" cite={`– ${review.user_name}`}>
        <Text c="white">{review.review}</Text>
      </Blockquote>
      <Text align="right" mt="sm" c="white">
        {review.score}/5
      </Text>
    </Card>
  );
}
