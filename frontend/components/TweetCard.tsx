// frontend/components/TweetCard.tsx
import { useState } from 'react';
import { Tweet } from '../hooks/useTweets';

interface TweetCardProps {
  tweet: Tweet;
}

export default function TweetCard({ tweet }: TweetCardProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  // Helper function to highlight differences
  const highlightDifferences = (original: string, corrected: string) => {
    if (!original || !corrected) return '';
    
    // Simple difference highlighting
    // This could be improved with a proper diff algorithm in the future
    return corrected;
  };

  return (
    <div className="tweet-card">
      <div className="text-container">
        <div className="original">
          <h4>Original</h4>
          <p>{tweet.original_text}</p>
        </div>
        
        <div className="corrected">
          <h4>Corrected</h4>
          <p>{highlightDifferences(tweet.original_text, tweet.corrected_text)}</p>
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
            <p>{tweet.explanation}</p>
          </div>
        )}
      </div>
      
      <div className="meta">
        <span className="date">
          {new Date(tweet.created_at).toLocaleDateString()}
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
        }

        .explanation-content {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background-color: #f8f9fa;
          border-radius: 4px;
          font-size: 0.9rem;
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