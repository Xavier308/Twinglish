// frontend/components/TweetEditor.tsx
import { useState, useEffect } from 'react';
import { useTweets, Tweet } from '../hooks/useTweets';

interface TweetEditorProps {
  onSuccess?: (tweet: Tweet) => void;
}

export default function TweetEditor({ onSuccess }: TweetEditorProps) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createTweet, isLoading } = useTweets();

  // No longer needed - removed effect for success message


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim() || isSubmitting) return;
    
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

  const calculateCharactersLeft = () => {
    return 280 - text.length;
  };

  const getCharacterCountClass = () => {
    const charsLeft = calculateCharactersLeft();
    if (charsLeft <= 0) return 'warning';
    if (charsLeft <= 20) return 'caution';
    return '';
  };

  return (
    <div className="tweet-editor">
      <div className="editor-header">
        <h2>Write in English</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="textarea-wrapper">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind? Write something in English..."
            maxLength={280}
            rows={4}
            disabled={isSubmitting || isLoading}
          />
          <div className={`character-count ${getCharacterCountClass()}`}>
            <span>{calculateCharactersLeft()}</span>
          </div>
        </div>
        
        <div className="button-row">
          <button 
            type="submit" 
            disabled={!text.trim() || isSubmitting || isLoading}
            className="submit-button"
          >
            {isSubmitting || isLoading ? (
              <>
                <span className="spinner"></span>
                <span>Processing...</span>
              </>
            ) : (
              'Get Feedback'
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        .tweet-editor {
          background-color: var(--bg-card);
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          padding: 1.25rem;
          margin-bottom: 2rem;
          border: 1px solid var(--border-color);
          position: relative;
        }
        
        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        h2 {
          margin: 0;
          font-size: 1.25rem;
          color: var(--text-primary);
        }
        
        /* Success message styles removed */
        
        .textarea-wrapper {
          position: relative;
          margin-bottom: 1rem;
        }
        
        textarea {
          width: 100%;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 1rem;
          font-size: 1rem;
          resize: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          background-color: var(--bg-input);
          color: var(--text-primary);
          line-height: 1.5;
        }
        
        textarea::placeholder {
          color: var(--text-secondary);
          opacity: 0.7;
        }
        
        textarea:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(29, 161, 242, 0.2);
        }
        
        textarea:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          background-color: var(--bg-container);
        }
        
        .character-count {
          position: absolute;
          bottom: 0.75rem;
          right: 0.75rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
          background-color: var(--bg-input);
          padding: 0.25rem 0.5rem;
          border-radius: 10px;
          transition: all 0.2s;
        }
        
        .character-count.caution {
          color: #f57c00;
        }
        
        .character-count.warning {
          color: var(--error-color);
          font-weight: bold;
        }

        .button-row {
          display: flex;
          justify-content: flex-end;
        }
        
        .submit-button {
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 50px;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .submit-button:hover:not(:disabled) {
          background-color: var(--primary-hover);
        }
        
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        @media (max-width: 640px) {
          .tweet-editor {
            padding: 1rem;
            border-radius: 8px;
          }
          
          .editor-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .submit-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
