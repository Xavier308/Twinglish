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

  // Format the date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className={`tweet-card ${needsCorrection() ? '' : 'no-errors'}`}>
      <div className="text-container">
        <div className="original">
          <h4>Original</h4>
          <p>{tweet.original_text}</p>
        </div>
        
        <div className="corrected">
          <h4>Corrected</h4>
          <p className={needsCorrection() ? 'has-corrections' : 'no-corrections'}>
            {tweet.corrected_text}
          </p>
        </div>
      </div>
      
      <div className="explanation">
        <button 
          onClick={() => setShowExplanation(!showExplanation)}
          className="explanation-toggle"
        >
          {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
        </button>
        
        {showExplanation && (
          <div className="explanation-content">
            {needsCorrection() ? (
              <p>{tweet.explanation}</p>
            ) : (
              <p>Great job! Your English is perfect in this tweet.</p>
            )}
          </div>
        )}
      </div>
      
      <div className="meta">
        <span className="date">
          {formatDate(tweet.created_at)}
        </span>
      </div>

      <style jsx>{`
        .tweet-card {
          background-color: #fff;
          border: 1px solid #e1e8ed;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
        }

        .tweet-card.no-errors {
          border-left: 4px solid #4caf50;
        }

        .text-container {
          display: flex;
          margin-bottom: 1rem;
          gap: 1.5rem;
        }

        .original, .corrected {
          flex: 1;
        }

        h4 {
          margin-top: 0;
          margin-bottom: 0.5rem;
          color: #14171a;
          font-size: 1rem;
        }

        .original h4:after {
          content: "✏️";
          margin-left: 0.5rem;
        }

        .corrected h4:after {
          content: "✅";
          margin-left: 0.5rem;
        }

        p {
          margin: 0;
          line-height: 1.5;
          word-break: break-word;
          padding: 0.5rem;
          border-radius: 4px;
          background-color: #f8f9fa;
        }

        .has-corrections {
          background-color: #e8f5e9;
        }

        .no-corrections {
          background-color: #f1f8e9;
        }

        .explanation {
          border-top: 1px solid #e1e8ed;
          padding-top: 1rem;
        }

        .explanation-toggle {
          background: none;
          border: none;
          color: #1da1f2;
          font-size: 0.9rem;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s;
        }

        .explanation-toggle:hover {
          color: #0c8de4;
          text-decoration: underline;
        }

        .explanation-content {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background-color: #f8f9fa;
          border-radius: 4px;
          font-size: 0.9rem;
          border-left: 4px solid #1da1f2;
        }

        .meta {
          margin-top: 1rem;
          font-size: 0.8rem;
          color: #657786;
          text-align: right;
        }

        @media (max-width: 768px) {
          .text-container {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}