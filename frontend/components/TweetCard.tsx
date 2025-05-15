// frontend/components/TweetCard.tsx
import { useState } from 'react';
import { Tweet } from '../hooks/useTweets';

interface TweetCardProps {
  tweet: Tweet;
}

export default function TweetCard({ tweet }: TweetCardProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  // Helper function to determine if the original text needs correction
  const needsCorrection = () => {
    return tweet.original_text !== tweet.corrected_text;
  };

  // Helper function to highlight differences between original and corrected text
  const highlightDifferences = () => {
    if (!needsCorrection()) return <p>{tweet.corrected_text}</p>;
    
    // For a real implementation, you would use a diff algorithm
    // This is a simplified version that just wraps the corrected text
    return <p>{tweet.corrected_text}</p>;
  };

  // Format the date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Format as "Today, 2:30 PM" if today
      const now = new Date();
      if (date.toDateString() === now.toDateString()) {
        return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      
      // Format as "May 15, 2:30 PM" if this year
      if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleString([], { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit', 
          minute: '2-digit'
        });
      }
      
      // Full date for older posts
      return date.toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className={`tweet-card ${needsCorrection() ? 'needs-correction' : 'perfect'}`}>
      <div className="tweet-header">
        <div className="status-indicator"></div>
        <span className="status-text">
          {needsCorrection() ? 'Corrections provided' : 'Perfect! No corrections needed'}
        </span>
      </div>
      
      <div className="text-container">
        <div className="text-section original">
          <div className="section-header">
            <h4>Original</h4>
          </div>
          <div className="text-content">
            <p>{tweet.original_text}</p>
          </div>
        </div>
        
        <div className="text-section corrected">
          <div className="section-header">
            <h4>Corrected</h4>
          </div>
          <div className="text-content">
            {highlightDifferences()}
          </div>
        </div>
      </div>
      
      <div className="tweet-actions">
        <button 
          onClick={() => setShowExplanation(!showExplanation)}
          className="action-button"
          aria-expanded={showExplanation}
        >
          {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
        </button>
      </div>
      
      {showExplanation && (
        <div className="explanation-container">
          {needsCorrection() ? (
            <p>{tweet.explanation}</p>
          ) : (
            <p>Great job! Your English is perfect in this tweet.</p>
          )}
        </div>
      )}
      
      <div className="tweet-footer">
        <span className="timestamp">
          {formatDate(tweet.created_at)}
        </span>
      </div>

      <style jsx>{`
        .tweet-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1.25rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
        }

        .tweet-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .tweet-card.needs-correction {
          border-left: 4px solid var(--primary-color);
        }

        .tweet-card.perfect {
          border-left: 4px solid var(--success-color);
        }

        .tweet-header {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .status-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 0.5rem;
          background-color: var(--primary-color);
        }

        .tweet-card.perfect .status-indicator {
          background-color: var(--success-color);
        }
        
        .status-text {
          color: var(--text-secondary);
        }

        .text-container {
          display: flex;
          gap: 1.25rem;
          margin-bottom: 1.25rem;
        }

        .text-section {
          flex: 1;
        }

        .section-header {
          margin-bottom: 0.75rem;
        }

        h4 {
          margin: 0;
          color: var(--text-primary);
          font-size: 0.95rem;
          font-weight: 600;
          display: flex;
          align-items: center;
        }

        .original h4::after {
          content: "✏️";
          margin-left: 0.4rem;
          font-size: 0.9rem;
        }

        .corrected h4::after {
          content: "✓";
          margin-left: 0.4rem;
          color: var(--success-color);
          font-weight: bold;
        }

        .text-content {
          background-color: var(--bg-container);
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .text-content p {
          margin: 0;
          word-break: break-word;
          color: var(--text-primary);
        }

        .tweet-card.perfect .corrected .text-content {
          background-color: var(--success-light);
        }

        .tweet-card.needs-correction .corrected .text-content {
          background-color: var(--primary-light);
          color: var(--text-primary);
        }

        .tweet-actions {
          margin-bottom: 1rem;
        }

        .action-button {
          background: none;
          border: none;
          color: var(--primary-color);
          font-size: 0.9rem;
          cursor: pointer;
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .action-button:hover {
          background-color: var(--primary-light);
        }

        .explanation-container {
          background-color: var(--bg-container);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          font-size: 0.95rem;
          line-height: 1.5;
          border-left: 4px solid var(--primary-color);
          color: var(--text-primary);
        }

        .explanation-container p {
          margin: 0;
        }

        .tweet-footer {
          display: flex;
          justify-content: flex-end;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .timestamp {
          display: inline-block;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 640px) {
          .text-container {
            flex-direction: column;
            gap: 1rem;
          }
          
          .tweet-card {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
