import { useState } from "react";
import { Star, X } from "lucide-react";

export default function SongRatingPopup({ 
  song, 
  onClose, 
  onSave, 
  initialRating = 0, 
  initialFeedback = "" 
}) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState(initialFeedback);

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleStarHover = (value) => {
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        rating,
        feedback,
        songId: song.id
      });
    }
    onClose();
  };

  const handleCancel = () => {
    setRating(initialRating);
    setFeedback(initialFeedback);
    onClose();
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const fullStarValue = i;
      const halfStarValue = i - 0.5;
      const displayRating = hoverRating || rating;
      
      stars.push(
        <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
          {/* Half star (left side) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: '50%',
              bottom: 0,
              overflow: 'hidden',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'transform 0.2s'
            }}
            onClick={() => handleStarClick(halfStarValue)}
            onMouseEnter={() => handleStarHover(halfStarValue)}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Star
              size={32}
              fill={displayRating >= halfStarValue ? '#facc15' : '#e5e7eb'}
              color={displayRating >= halfStarValue ? '#facc15' : '#e5e7eb'}
            />
          </div>
          
          {/* Full star (right side) */}
          <div
            style={{
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onClick={() => handleStarClick(fullStarValue)}
            onMouseEnter={() => handleStarHover(fullStarValue)}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Star
              size={32}
              fill={displayRating >= fullStarValue ? '#facc15' : '#e5e7eb'}
              color={displayRating >= fullStarValue ? '#facc15' : '#e5e7eb'}
            />
          </div>
        </div>
      );
    }
    return stars;
  };

  if (!song) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '24px',
        width: '320px',
        maxWidth: '90vw',
        margin: '16px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            margin: 0
          }}>Rate this song</h3>
          <button
            onClick={handleCancel}
            style={{
              color: '#6b7280',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#374151'}
            onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
          >
            <X size={20} />
          </button>
        </div>
        
        <div style={{
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          <h4 style={{
            fontWeight: '500',
            color: '#1f2937',
            margin: '0 0 4px 0'
          }}>{song.name}</h4>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: 0
          }}>{song.artists.map(a => a.name).join(", ")}</p>
        </div>
        
        {/* Interactive rating stars */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '16px'
        }} onMouseLeave={handleMouseLeave}>
          {renderStars()}
        </div>
        
        {/* Rating value display */}
        <div style={{
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          <span style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#eab308'
          }}>
            {rating > 0 ? `${rating}/5` : 'No rating'}
          </span>
        </div>
        
        {/* Feedback textarea */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Your thoughts (optional)
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your thoughts about this song..."
            style={{
              width: '100%',
              height: '80px',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>
        
        {/* Action buttons */}
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={handleCancel}
            style={{
              flex: 1,
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              color: '#374151',
              borderRadius: '6px',
              background: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={rating === 0}
            style={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              cursor: rating > 0 ? 'pointer' : 'not-allowed',
              backgroundColor: rating > 0 ? '#3b82f6' : '#d1d5db',
              color: rating > 0 ? 'white' : '#6b7280'
            }}
            onMouseOver={(e) => {
              if (rating > 0) {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }
            }}
            onMouseOut={(e) => {
              if (rating > 0) {
                e.currentTarget.style.backgroundColor = '#3b82f6';
              }
            }}
          >
            Save Rating
          </button>
        </div>
      </div>
    </div>
  );
}