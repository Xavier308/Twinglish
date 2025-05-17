// frontend/components/PageSizeSelector.tsx
import { useState } from 'react';

interface PageSizeSelectorProps {
  currentPageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  options?: number[];
  className?: string;
}

export default function PageSizeSelector({
  currentPageSize,
  onPageSizeChange,
  options = [5, 10, 20, 50],
  className = ''
}: PageSizeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelect = (size: number) => {
    onPageSizeChange(size);
    setIsOpen(false);
  };
  
  return (
    <div className={`page-size-selector ${className}`}>
      <div className="selector-label">Show:</div>
      <div className="dropdown-container">
        <button
          className="dropdown-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {currentPageSize} items
          <span className="dropdown-arrow">▼</span>
        </button>
        
        {isOpen && (
          <div className="dropdown-menu" role="listbox">
            {options.map(size => (
              <button
                key={size}
                className={`dropdown-item ${size === currentPageSize ? 'active' : ''}`}
                onClick={() => handleSelect(size)}
                role="option"
                aria-selected={size === currentPageSize}
              >
                {size} items
              </button>
            ))}
          </div>
        )}
      </div>
      
      <style jsx>{`
        .page-size-selector {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
        }
        
        .selector-label {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        
        .dropdown-container {
          position: relative;
        }
        
        .dropdown-button {
          background-color: var(--bg-container);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 0.4rem 0.8rem;
          font-size: 0.9rem;
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: border-color 0.2s;
        }
        
        .dropdown-button:hover {
          border-color: var(--primary-color);
        }
        
        .dropdown-arrow {
          font-size: 0.7rem;
          opacity: 0.7;
          transition: transform 0.2s;
        }
        
        .dropdown-button[aria-expanded="true"] .dropdown-arrow {
          transform: rotate(180deg);
        }
        
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          z-index: 10;
          max-height: 200px;
          overflow-y: auto;
        }
        
        .dropdown-item {
          width: 100%;
          text-align: left;
          padding: 0.5rem 0.8rem;
          font-size: 0.9rem;
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .dropdown-item:hover {
          background-color: var(--bg-container);
        }
        
        .dropdown-item.active {
          background-color: var(--primary-light);
          color: var(--primary-color);
          font-weight: 500;
        }
        
        @media (max-width: 480px) {
          .page-size-selector {
            width: 100%;
            justify-content: space-between;
          }
          
          .dropdown-container {
            flex: 1;
            max-width: 120px;
          }
          
          .dropdown-button {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}