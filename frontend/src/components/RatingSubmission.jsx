// RatingSubmission.jsx
import { useState } from 'react';
import { Rating, Textarea, Button, Stack, Text } from '@mantine/core';

export default function RatingSubmission({ album_id, onSubmit }) {
  const [score, set_score] = useState(0);
  const [review, set_review] = useState('');
  const [submitting, set_submitting] = useState(false);
  const [error, set_error] = useState(null);

  const handleSubmit = async () => {
    set_submitting(true);
    set_error(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8000/api/albums/${album_id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score, review }),
      });

      if (!res.ok) throw new Error("Failed to submit rating");
      set_score(0);
      set_review('');
      onSubmit();  // refresh parent
    } catch (err) {
      set_error(err.message || "Error");
    } finally {
      set_submitting(false);
    }
  };

  return (
    <Stack spacing="sm" p="sm" className="glass-card" bg="#4c5897">
      <Text c="white" fw={600}>Leave a Review</Text>
      <Rating value={score} onChange={set_score} fractions={2} size="lg" color="yellow" />
      <Textarea
        placeholder="Your thoughts..."
        value={review}
        onChange={(e) => set_review(e.target.value)}
        autosize
        minRows={3}
      />
      <Button onClick={handleSubmit} loading={submitting} disabled={score === 0}>
        Submit
      </Button>
      {error && <Text c="red">{error}</Text>}
    </Stack>
  );
}
