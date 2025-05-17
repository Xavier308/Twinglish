// frontend/components/Pagination.tsx
import { useEffect } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = ''
}: PaginationProps) {
  // Function to generate page numbers for display
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // If 7 or fewer pages, show all page numbers
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // If current page is close to start
      if (currentPage <= 4) {
        pageNumbers.push(2, 3, 4, 5, '...', totalPages);
      } 
      // If current page is close to end
      else if (currentPage >= totalPages - 3) {
        pageNumbers.push('...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } 
      // If current page is in the middle
      else {
        pageNumbers.push(
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }
    
    return pageNumbers;
  };

  // Handle keyboard navigation (left/right arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentPage > 1) {
        onPageChange(currentPage - 1);
      } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
        onPageChange(currentPage + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage, totalPages, onPageChange]);

  // If only one page, don't render pagination
  if (totalPages <= 1) return null;

  return (
    <div className={`pagination-container ${className}`}>
      <button 
        className="pagination-button prev" 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <span className="arrow">←</span> Previous
      </button>
      
      <div className="pagination-numbers">
        {getPageNumbers().map((page, index) => (
          typeof page === 'number' ? (
            <button
              key={index}
              className={`pagination-number ${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? 'page' : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="pagination-ellipsis">⋯</span>
          )
        ))}
      </div>
      
      <button 
        className="pagination-button next" 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next <span className="arrow">→</span>
      </button>

      <style jsx>{`
        .pagination-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 1rem 0 2rem;
          padding: 1rem 0;
          border-top: 1px solid var(--border-color);
        }

        .pagination-button {
          background-color: var(--bg-container);
          border: 1px solid var(--border-color);
          border-radius: 50px;
          padding: 0.6rem 1.2rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 120px;
          justify-content: center;
        }

        .pagination-button:hover:not(:disabled) {
          background-color: var(--primary-light);
          border-color: var(--primary-color);
          color: var(--primary-color);
        }

        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-button .arrow {
          font-size: 1.1rem;
        }

        .pagination-numbers {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .pagination-number {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: none;
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pagination-number:hover:not(.active) {
          background-color: var(--bg-container);
        }

        .pagination-number.active {
          background-color: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
          font-weight: 600;
        }

        .pagination-ellipsis {
          color: var(--text-secondary);
          font-size: 0.9rem;
          padding: 0 0.25rem;
          cursor: default;
        }

        @media (max-width: 768px) {
          .pagination-container {
            flex-wrap: wrap;
            gap: 1rem;
          }
          
          .pagination-numbers {
            order: -1;
            width: 100%;
            justify-content: center;
            margin-bottom: 0.5rem;
          }
          
          .pagination-button {
            flex: 1;
            min-width: 0;
          }
        }

        @media (max-width: 480px) {
          .pagination-number {
            width: 32px;
            height: 32px;
            font-size: 0.8rem;
          }
          
          .pagination-button {
            padding: 0.5rem 0.8rem;
            font-size: 0.8rem;
          }
          
          .pagination-container {
            flex-direction: column;
          }
          
          .pagination-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}