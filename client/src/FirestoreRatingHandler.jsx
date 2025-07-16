import { useState } from "react";
import { Star, X } from "lucide-react";
import db from './firebase.js';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

const saveRatingToFirestore = async (userId, songId, rating, feedback, songData) => {
  try {
    const ratingData = {
      userId,
      songId,
      rating,
      feedback,
      songName: songData.name,
      artists: songData.artists.map(a => a.name),
      timestamp: new Date()
    };
    
    await setDoc(doc(db, 'ratings', `${userId}_${songId}`), ratingData);
    console.log('Rating saved to Firestore');
    
  } catch (error) {
    console.error('Error saving rating to Firestore:', error);
    throw error;
  }
};

export const getUserRatings = async (userId) => {
  try {
    const q = query(collection(db, 'ratings'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const ratings = {};
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      ratings[data.songId] = {
        rating: data.rating,
        feedback: data.feedback
      };
    });
    
    return ratings;
    
  } catch (error) {
    console.error('Error getting user ratings from Firestore:', error);
    return {};
  }
};

export default function FirestoreRatingHandler({ 
  song, 
  onClose, 
  userId, 
  initialRating = 0, 
  initialFeedback = "" 
}) {
  const [rating, setRating] = useState(initialRating);
  const [feedback, setFeedback] = useState(initialFeedback);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await saveRatingToFirestore(userId, song.id, rating, feedback, song);
      onClose();
    } catch (error) {
      console.error('Error saving rating:', error);
      console.error('Error details:', error.message);
      console.error('Error code:', error.code);
      alert(`Error saving rating: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Rate This Song</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">{song.name}</h3>
          <p className="text-gray-600">
            by {song.artists.map((a) => a.name).join(", ")}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`${
                    star <= rating ? 'text-yellow-500' : 'text-gray-300'
                  } hover:text-yellow-400 transition-colors`}
                >
                  <Star size={24} fill={star <= rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Feedback (optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts about this song..."
              className="w-full p-2 border rounded-md resize-none"
              rows="3"
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}