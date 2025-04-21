// Tab-Updates.tsx

import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, getDoc, where } from 'firebase/firestore'; // added where
import { db } from './firebase';
import { useAuth } from './AuthContext';            // <-- import useAuth
import AddNewsUpdateForm, { NewsUpdate as FormNewsUpdate } from './AddNewsUpdateForm';
import './Tab-Updates.css';

export interface NewsUpdate {
  id: string;
  title: string;
  date: string;
  author: string;
  content: string;
  imageUrl: string;
}

interface UpdatesTabProps {
  newsData?: NewsUpdate[];
  projectId?: string; // <-- new prop for projectId
}

const UpdatesTab: React.FC<UpdatesTabProps> = ({ newsData, projectId }) => {
  const { userData } = useAuth();                   // <-- get userData
  const isCharity = userData?.role === 'charity';   // <-- check role

  const [updates, setUpdates] = useState<NewsUpdate[]>([]);
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [projectOwner, setProjectOwner] = useState<string | null>(null); // added state

  useEffect(() => {
    if (projectId) {
      const projectRef = doc(db, 'projects', projectId);
      getDoc(projectRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            // assuming 'createdBy' field stores the charity owner's uid
            setProjectOwner(docSnap.data().createdBy);
          }
        })
        .catch(err => console.error('Error fetching project owner:', err));
    }
  }, [projectId]);

  useEffect(() => {
    if (newsData && newsData.length) {
      setUpdates(newsData);
      setCurrentUpdateIndex(newsData.length - 1); // set last update as current
      return;
    }
    let q;
    if (projectId) {
      q = query(
        collection(db, 'newsUpdates'),
        where('projectId', '==', projectId), // filter by projectId
        orderBy("createdAt")
      );
    } else {
      q = query(
        collection(db, 'newsUpdates'),
        orderBy("createdAt")
      );
    }
    const unsub = onSnapshot(q, snap => {
      const fetched: NewsUpdate[] = [];
      snap.forEach(doc => {
        const d = doc.data();
        fetched.push({
          id: doc.id,
          title: d.title,
          date: d.date,
          author: d.author,
          content: d.content,
          imageUrl: d.imageUrl,
        });
      });
      setUpdates(fetched);
      setCurrentUpdateIndex(fetched.length - 1); // set last update as current
    });
    return () => unsub();
  }, [newsData, projectId]);

  const current = updates[currentUpdateIndex]!;
  const goPrev = () => {
    setCurrentUpdateIndex(i => (i > 0 ? i - 1 : i));
  };
  const goNext = () => {
    setCurrentUpdateIndex(i => (i < updates.length - 1 ? i + 1 : i));
  };
  const share = (platform: 'facebook' | 'twitter' | 'linkedin') =>
    console.log(`Sharing to ${platform}: ${current.title}`);

  return (
    <div className="updates-wrapper">
      {isCharity && projectOwner && userData?.uid === projectOwner && ( // modified condition
        <button
          className="toggle-form-btn"
          onClick={() => setShowForm(s => !s)}
        >
          {showForm ? '✖ Close Form' : '+ Add News Update'}
        </button>
      )}

      {showForm && isCharity && projectOwner && userData?.uid === projectOwner && ( // modified condition
        <AddNewsUpdateForm projectId={projectId} />
      )}

      {!showForm && (
        <>
          {updates.length === 0 ? (
            <div className="updates-content">
              <p>No news updates available.</p>
            </div>
          ) : (
            <>
              <div className="news-update-header">
                <h2>{current.title}</h2>
                <p className="news-date">
                  {current.date} | by {current.author}
                </p>
              </div>

              <div className="news-update-content">
                <div className="news-image-container">
                  <img
                    src={current.imageUrl}
                    alt={current.title}
                    className="news-image"
                  />
                </div>
                <div className="news-text-content">
                  <p>{current.content}</p>

                  <div className="share-container">
                    <span className="share-label">Share Update</span>
                    <div className="share-buttons">
                      {(['facebook','twitter','linkedin'] as const).map(pl => (
                        <button
                          key={pl}
                          className={`share-button ${pl}`}
                          onClick={() => share(pl)}
                          aria-label={`Share on ${pl}`}
                        >
                          <img
                            src={`/assets/${pl}-logo-black.png`}
                            alt={pl}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="news-navigator">
                <button
                  className="nav-button prev"
                  onClick={goPrev}
                  disabled={currentUpdateIndex <= 0} // now disables when at the first update
                >
                  Previous Update
                </button>
                <div className="pagination-indicator">
                  {updates.map((_, idx) => (
                    <span
                      key={idx}
                      className={`pagination-dot ${
                        idx === currentUpdateIndex ? 'active' : ''
                      }`}
                      onClick={() => setCurrentUpdateIndex(idx)}
                    />
                  ))}
                </div>
                <button
                  className="nav-button next"
                  onClick={goNext}
                  disabled={currentUpdateIndex >= updates.length - 1} // now disables when at the last update
                >
                  Next Update
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UpdatesTab;
