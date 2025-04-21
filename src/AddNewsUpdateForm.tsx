import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import './AddNewsUpdateForm.css';

export interface NewsUpdate {
  title: string;
  date: string;
  author: string;
  content: string;
  imageUrl: string;
  projectId: string;
}

interface AddNewsUpdateFormProps {
  projectId?: string;  // make prop optional in type now
}

const uploadImageToImgbb = async (file: File): Promise<string> => {
  const API_KEY = 'ea041d81863434cecbdb34bfe3264458';
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', API_KEY);
  const response = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();

  if (data.success) {
    return data.data.url;
  }

  throw new Error('Image upload failed');
};

const AddNewsUpdateForm: React.FC<AddNewsUpdateFormProps> = ({ projectId }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  // If projectId is missing, render an error message rather than throwing
  if (!projectId) {
    return (
      <div className="news-update-error">
        <p className="error-message">
          Error: No project selected. Please select a project before adding a news update.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    // Guard against missing projectId at runtime
    if (!projectId) {
      console.error('[AddNewsUpdateForm] missing projectId');
      setMessage('Error: Project ID is missing. Cannot submit news update.');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImageToImgbb(imageFile);
      }

      const newsUpdate: NewsUpdate = {
        title: title.trim(),
        date: date || new Date().toISOString().split('T')[0],
        author: author.trim(),
        content: content.trim(),
        imageUrl,
        projectId,
      };

      await addDoc(collection(db, 'newsUpdates'), {
        ...newsUpdate,
        createdAt: serverTimestamp(),
      });

      setMessage('News update added successfully!');
      // Reset form fields
      setTitle('');
      setDate('');
      setAuthor('');
      setContent('');
      setImageFile(null);
    } catch (err: any) {
      console.error('[AddNewsUpdateForm] submit error:', err);
      alert("Failed to submit news update. " + err.message);
      setMessage('Error: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="news-update-form">
      <h3>Add News Update</h3>

      <div className="form-group">
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Author:</label>
        <input
          type="text"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Content:</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => e.target.files?.[0] && setImageFile(e.target.files[0])}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting…' : 'Submit News Update'}
      </button>

      {message && <p className="form-message">{message}</p>}
    </form>
  );
};

export default AddNewsUpdateForm;
