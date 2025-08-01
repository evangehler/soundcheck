// RatingSubmission.jsx
import { useState, useEffect } from 'react';
import { Rating, Textarea, Button, Stack, Text, Group } from '@mantine/core';

export default function RatingSubmission({ 
  album_id, 
  onSubmit, 
  onCancel,
  initialScore = 0, 
  initialReview = '', 
  isEditing = false 
}) {
  const [score, set_score] = useState(initialScore);
  const [review, set_review] = useState(initialReview);
  const [submitting, set_submitting] = useState(false);
  const [error, set_error] = useState(null);

  // Update local state when initial values change
  useEffect(() => {
    set_score(initialScore);
    set_review(initialReview);
  }, [initialScore, initialReview]);

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
      
      // Only reset if not editing (new submission)
      if (!isEditing) {
        set_score(0);
        set_review('');
      }
      
      onSubmit();  // refresh parent
    } catch (err) {
      set_error(err.message || "Error submitting review");
    } finally {
      set_submitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      // Reset to initial values
      set_score(initialScore);
      set_review(initialReview);
      set_error(null);
      onCancel();
    }
  };

  return (
    <Stack spacing="sm" p="sm" className="glass-card" bg="#4c5897">
      <Text c="white" fw={600}>
        {isEditing ? 'Edit Your Review' : 'Leave a Review'}
      </Text>
      <Rating 
        value={score} 
        onChange={set_score} 
        fractions={2} 
        size="lg" 
        color="yellow" 
      />
      <Textarea
        placeholder="Your thoughts..."
        value={review}
        onChange={(e) => set_review(e.target.value)}
        autosize
        minRows={3}
        styles={{
          input: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }
        }}
      />
      <Group justify="flex-start">
        <Button 
          onClick={handleSubmit} 
          loading={submitting} 
          disabled={score === 0}
        >
          {isEditing ? 'Update Review' : 'Submit Review'}
        </Button>
        {isEditing && onCancel && (
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
        )}
      </Group>
      {error && <Text c="red" size="sm">{error}</Text>}
    </Stack>
  );
}