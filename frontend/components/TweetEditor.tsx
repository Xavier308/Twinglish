// frontend/components/TweetEditor.tsx
import { useState } from 'react';
import { useTweets, Tweet } from '../hooks/useTweets';

interface TweetEditorProps {
  onSuccess?: (tweet: Tweet) => void;
}

export default function TweetEditor({ onSuccess }: TweetEditorProps) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createTweet } = useTweets();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const newTweet = await createTweet(text);
      setText('');
      if (onSuccess) {
        onSuccess(newTweet);
      }
    } catch (error) {
      console.error('Error creating tweet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tweet-editor">
      <form onSubmit={handleSubmit}>
        <div className="textarea-wrapper">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write something in English..."
            maxLength={280}
            rows={4}
            disabled={isSubmitting}
          />
          <div className="character-count">
            <span className={text.length > 240 ? 'warning' : ''}>
              {text.length}/280
            </span>
          </div>
        </div>
        <button 
          type="submit" 
          disabled={!text || isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? 'Submitting...' : 'Get Feedback'}
        </button>
      </form>

      <style jsx>{`
        .tweet-editor {
          background-color: #fff;
          border: 1px solid #e1e8ed;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 2rem;
        }

        .textarea-wrapper {
          position: relative;
          margin-bottom: 1rem;
        }

        textarea {
          width: 100%;
          border: 1px solid #e1e8ed;
          border-radius: 8px;
          padding: 0.75rem;
          font-size: 1rem;
          resize: none;
          transition: border-color 0.2s;
        }

        textarea:focus {
          outline: none;
          border-color: #1da1f2;
        }

        .character-count {
          position: absolute;
          bottom: 0.5rem;
          right: 0.75rem;
          font-size: 0.8rem;
          color: #657786;
        }

        .character-count .warning {
          color: #e0245e;
        }

        .submit-button {
          background-color: #1da1f2;
          color: white;
          border: none;
          border-radius: 50px;
          padding: 0.6rem 1.2rem;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .submit-button:hover:not(:disabled) {
          background-color: #1a91da;
        }

        .submit-button:disabled {
          background-color: #9ad0f9;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .tweet-editor {
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
