import React, { useState } from 'react';
import './Tab-Updates.css'

export interface NewsUpdate {
    id: number;
    title: string;
    date: string;
    author: string;
    content: string;
    imageUrl: string;
}

interface UpdatesTabProps {
    newsData: NewsUpdate[];
}

const UpdatesTab: React.FC<UpdatesTabProps> = ({ newsData }) => {
    const [currentUpdateIndex, setCurrentUpdateIndex] = useState(0);
    const currentUpdate = newsData[currentUpdateIndex];

    const goToPrevious = () => {
        if (currentUpdateIndex < newsData.length - 1) {
            setCurrentUpdateIndex(currentUpdateIndex + 1);
        }
    };

    const goToNext = () => {
        if (currentUpdateIndex > 0) {
            setCurrentUpdateIndex(currentUpdateIndex - 1);
        }
    };

    const shareUpdate = (platform: 'facebook' | 'twitter' | 'linkedin') => {
        // In a real app, this would implement actual sharing functionality
        console.log(`Sharing to ${platform}: ${currentUpdate.title}`);
    };

    return (
        <div className="updates-content">
            <div className="news-update-header">
                <h2>{currentUpdate.title}</h2>
                <p className="news-date">{currentUpdate.date} | by {currentUpdate.author}</p>
            </div>

            <div className="news-update-content">
                <div className="news-image-container">
                    <img src={currentUpdate.imageUrl} alt={currentUpdate.title} className="news-image" />
                </div>

                <div className="news-text-content">
                    <p>{currentUpdate.content}</p>

                    <div className="share-container">
                        <span className="share-label">Share Update</span>
                        <div className="share-buttons">
                            <button 
                                className="share-button facebook" 
                                onClick={() => shareUpdate('facebook')}
                                aria-label="Share on Facebook"
                            >
                                <img src='/assets/facebook-logo-black.png' alt='Facebook'></img>
                            </button>
                            <button 
                                className="share-button twitter" 
                                onClick={() => shareUpdate('twitter')}
                                aria-label="Share on Twitter"
                            >
                                <img src='/assets/twitter-logo-black.png' alt='Twitter'></img>
                            </button>
                            <button 
                                className="share-button linkedin" 
                                onClick={() => shareUpdate('linkedin')}
                                aria-label="Share on LinkedIn"
                            >
                                <img src='/assets/linkedin-square-logo-24.png' alt='LinkedIn'></img>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="news-navigator">
                <button 
                    className="nav-button prev" 
                    onClick={goToPrevious}
                    disabled={currentUpdateIndex >= newsData.length - 1}
                >
                    Previous Update
                </button>
                <div className="pagination-indicator">
                    {newsData.map((_, index) => (
                        <span 
                            key={index} 
                            className={`pagination-dot ${index === currentUpdateIndex ? 'active' : ''}`}
                            onClick={() => setCurrentUpdateIndex(index)}
                        />
                    ))}
                </div>
                <button 
                    className="nav-button next" 
                    onClick={goToNext}
                    disabled={currentUpdateIndex <= 0}
                >
                    Next Update
                </button>
            </div>
        </div>
    );
};

export default UpdatesTab;