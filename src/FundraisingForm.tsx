// FundraisingForm.tsx
import React, { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import './Fundraising.css';

interface Expense {
  date: string;
  amount: number;
  description: string;
  receipt: File | null;
  receiptPreview: string | null;
}

export interface Milestone {
  title: string;
  fundObjective: number;
  solution: string;
  activities: string;
  image: File | null;
  imagePreview: string | null;
  expenses: Expense[];
}

interface FundraisingFormData {
  projectTitle: string;
  coverImage: File | null;
  coverImagePreview: string | null;
  projectQuote: string;
  totalFundObjective: number;
  numberOfBeneficiaries: number;
  projectDescription: string;
  projectCategory: string; // <-- Added project category here.
  milestones: Milestone[];
}

const initialExpense: Expense = {
  date: '',
  amount: 0,
  description: '',
  receipt: null,
  receiptPreview: null,
};

const initialMilestone: Milestone = {
  title: '',
  fundObjective: 0,
  solution: '',
  activities: '',
  image: null,
  imagePreview: null,
  expenses: [{ ...initialExpense }],
};

const initialFormState: FundraisingFormData = {
  projectTitle: '',
  coverImage: null,
  coverImagePreview: null,
  projectQuote: '',
  totalFundObjective: 0,
  numberOfBeneficiaries: 0,
  projectDescription: '',
  projectCategory: 'Water', // Default category for the project.
  milestones: [],
};

// Helper function to upload an image file to imgbb and return its URL.
const uploadImageToImgbb = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  // Replace with your actual imgbb API key.
  formData.append('key', 'ea041d81863434cecbdb34bfe3264458');
  
  const res = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData,
  });
  
  const data = await res.json();
  if (data.success) {
    return data.data.url;
  }
  throw new Error('Image upload failed');
};

const FundraisingForm: React.FC = () => {
  const [formData, setFormData] = useState<FundraisingFormData>({ ...initialFormState });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [wordCount, setWordCount] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [currentMilestones, setCurrentMilestones] = useState<Milestone[]>([{ ...initialMilestone }]);
  const [totalMilestoneFunds, setTotalMilestoneFunds] = useState<number>(0);
  const quoteRef = useRef<HTMLTextAreaElement>(null);

  // Update word count for project quote.
  useEffect(() => {
    const words = formData.projectQuote.trim().split(/\s+/);
    setWordCount(formData.projectQuote.trim() === '' ? 0 : words.length);
  }, [formData.projectQuote]);

  // Compute total milestone funds.
  useEffect(() => {
    const total = currentMilestones.reduce((sum, milestone) => sum + (milestone.fundObjective || 0), 0);
    setTotalMilestoneFunds(total);
  }, [currentMilestones]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInputSentences = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const words = value.trim().split(/\s+/);
    const count = value.trim() === '' ? 0 : words.length;
    
    if (count <= 20) {
      setFormData({ ...formData, projectQuote: value });
    } else {
      e.target.value = formData.projectQuote;
    }
  };

  const handleQuoteKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const value = e.currentTarget.value;
    const words = value.trim().split(/\s+/);
    const count = value.trim() === '' ? 0 : words.length;
    
    const specialKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    if (count >= 20 && !specialKeys.includes(e.key) && !e.metaKey && !e.ctrlKey) {
      if (e.key === ' ' || e.key === 'Enter') e.preventDefault();
      const lastChar = value[value.length - 1];
      if (lastChar === ' ' || lastChar === '\n') e.preventDefault();
    }
  };

  const resetForm = () => {
    setFormData({ ...initialFormState });
    setCurrentMilestones([{ ...initialMilestone }]);
    setCurrentStep(1);
    setIsSubmitted(false);
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = value === '' ? 0 : parseFloat(value);
    setFormData({ ...formData, [name]: numberValue });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        coverImage: file,
        coverImagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleContinueToMilestones = (e: FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  // Handle milestone field changes.
  const handleMilestoneChange = (index: number, field: keyof Milestone, value: unknown) => {
    const updatedMilestones = [...currentMilestones];
    updatedMilestones[index] = { ...updatedMilestones[index], [field]: value };
    setCurrentMilestones(updatedMilestones);
  };

  const handleMilestoneImageChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const updatedMilestones = [...currentMilestones];
      updatedMilestones[index] = {
        ...updatedMilestones[index],
        image: file,
        imagePreview: URL.createObjectURL(file),
      };
      setCurrentMilestones(updatedMilestones);
    }
  };

  const addMilestone = () => {
    setCurrentMilestones([...currentMilestones, { ...initialMilestone }]);
  };

  const removeMilestone = (index: number) => {
    if (currentMilestones.length > 1) {
      const updatedMilestones = currentMilestones.filter((_, i) => i !== index);
      setCurrentMilestones(updatedMilestones);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Upload the cover image.
      let coverImageUrl = '';
      if (formData.coverImage) {
        coverImageUrl = await uploadImageToImgbb(formData.coverImage);
      }

      // Process each milestone image and add default status.
      const processedMilestones: Milestone[] = await Promise.all(
        currentMilestones.map(async (m) => {
          let milestoneImageUrl = '';
          if (m.image) {
            milestoneImageUrl = await uploadImageToImgbb(m.image);
          }
          return {
            ...m,
            imagePreview: milestoneImageUrl || m.imagePreview,
            image: null, // Remove File object after upload.
            // Set default status here
            status: 'Pending',
          };
        })
      );

      // Map the fundraising form fields to match the project schema used in the explore page.
      const finalFormData = {
        title: formData.projectTitle,
        subtitle: formData.projectQuote,
        description: formData.projectDescription,
        goalAmount: formData.totalFundObjective,
        raisedAmount: 0,
        mainImage: coverImageUrl || formData.coverImagePreview,
        category: formData.projectCategory,
        // Record numberOfBeneficiaries in the database.
        numberOfBeneficiaries: formData.numberOfBeneficiaries,
        milestones: processedMilestones,
        status: 'Funding',
        location: '',
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'projects'), finalFormData);
      setIsSubmitted(true);
      console.log('Project created successfully:', finalFormData);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="fundraising-success">
        <div className="text-center">
          <h2 className="form-title" style={{ color: '#16a34a', background: "#FFFFFF" }}>
            Fundraising Proposal Submitted!
          </h2>
          <p>Thank you for making this world better with us!</p>
          <small style={{ opacity: "0.5" }}>
            This proposal is under review and verification process. <br />
            Please wait as this process usually takes less than 24 hours<br />
          </small>
          <button onClick={resetForm} className="form-button" style={{ marginTop: "20px" }}>
            Submit Another Proposal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fundraising-container">
      {currentStep === 1 ? (
        <>
          <h1 className="form-title">Fundraising Proposal Form</h1>
          <form onSubmit={handleContinueToMilestones} className="fundraising-form">
            <div className="form-group">
              <label htmlFor="projectTitle" className="form-label">
                Project Title *
              </label>
              <input
                type="text"
                id="projectTitle"
                name="projectTitle"
                value={formData.projectTitle}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Enter your project title"
              />
            </div>
            <div className="form-group">
              <label htmlFor="projectQuote" className="form-label">
                Project Quote *{' '}
                <span style={{ fontSize: '0.8rem', color: wordCount >= 20 ? 'red' : 'inherit' }}>
                  ({wordCount}/20 words)
                </span>
              </label>
              <textarea
                id="projectQuote"
                name="projectQuote"
                value={formData.projectQuote}
                onChange={handleInputSentences}
                onKeyDown={handleQuoteKeyDown}
                ref={quoteRef}
                required
                rows={1}
                className="form-textarea"
                placeholder="Describe your project in one sentence"
              />
            </div>
            <div className="form-group">
              <label htmlFor="coverImage" className="form-label">
                Cover Image *
              </label>
              <input
                type="file"
                id="coverImage"
                name="coverImage"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="form-file"
              />
              {formData.coverImagePreview && (
                <div className="img-preview">
                  <img src={formData.coverImagePreview} alt="Cover preview" />
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="totalFundObjective" className="form-label">
                Total Fund Objective ($) *
              </label>
              <input
                type="number"
                id="totalFundObjective"
                name="totalFundObjective"
                value={formData.totalFundObjective || ''}
                onChange={handleNumberChange}
                required
                min="1"
                step="0.01"
                className="form-input"
                placeholder="Enter the total funding amount proposed"
              />
            </div>
            <div className="form-group">
              <label htmlFor="numberOfBeneficiaries" className="form-label">
                Number of Beneficiaries *
              </label>
              <input
                type="number"
                id="numberOfBeneficiaries"
                name="numberOfBeneficiaries"
                value={formData.numberOfBeneficiaries || ''}
                onChange={handleNumberChange}
                required
                min="1"
                className="form-input"
                placeholder="Enter the number of people who will benefit from this project"
              />
            </div>
            <div className="form-group">
              <label htmlFor="projectDescription" className="form-label">
                Project Description *
              </label>
              <textarea
                id="projectDescription"
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleInputChange}
                required
                rows={6}
                className="form-textarea"
                placeholder="Describe your project, what's happening, what dilemma facing, and how you try to solve it..."
              />
            </div>
            {/* New project category field */}
            <div className="form-group">
              <label htmlFor="projectCategory" className="form-label">
                Project Category *
              </label>
              <select
                id="projectCategory"
                name="projectCategory"
                value={formData.projectCategory}
                onChange={handleInputChange}
                required
                className="form-input"
              >
                <option value="Water">Water</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Technology">Technology</option>
                <option value="Community">Community</option>
                {/* Add other categories as needed */}
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="form-button">
                Continue to Budget Breakdown
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <h1 className="form-title">Budget Breakdown & Milestones</h1>
          <div className="form-progress">
            <div className="budget-summary">
              <p>
                <strong>Project Title:</strong> {formData.projectTitle}
              </p>
              <p>
                <strong>Total Fund Objective:</strong> ${formData.totalFundObjective.toFixed(2)}
              </p>
              <p>
                <strong>Allocated to Milestones:</strong>{' '}
                <span
                  style={{ 
                    color: totalMilestoneFunds > formData.totalFundObjective 
                      ? 'red' 
                      : totalMilestoneFunds === formData.totalFundObjective 
                        ? 'green' 
                        : 'inherit'
                  }}
                >
                  ${totalMilestoneFunds.toFixed(2)}
                </span>
                {totalMilestoneFunds > formData.totalFundObjective && (
                  <span className="warning"> (Exceeds total objective)</span>
                )}
              </p>
              <p>
                <strong>Remaining to Allocate:</strong> ${Math.max(0, formData.totalFundObjective - totalMilestoneFunds).toFixed(2)}
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="fundraising-form">
            {currentMilestones.map((milestone, milestoneIndex) => (
              <div key={milestoneIndex} className="milestone-container">
                <h3>Milestone {milestoneIndex + 1}</h3>
                <div className="form-group">
                  <label htmlFor={`milestone-title-${milestoneIndex}`} className="form-label">
                    Milestone Title *
                  </label>
                  <input
                    type="text"
                    id={`milestone-title-${milestoneIndex}`}
                    value={milestone.title}
                    onChange={(e) => handleMilestoneChange(milestoneIndex, 'title', e.target.value)}
                    required
                    className="form-input"
                    placeholder="Enter milestone title"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`milestone-fund-${milestoneIndex}`} className="form-label">
                    Fund Objective for this Milestone ($) *
                  </label>
                  <input
                    type="number"
                    id={`milestone-fund-${milestoneIndex}`}
                    value={milestone.fundObjective || ''}
                    onChange={(e) => handleMilestoneChange(milestoneIndex, 'fundObjective', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                    required
                    min="1"
                    step="0.01"
                    className="form-input"
                    placeholder="Enter fund amount for this milestone"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`milestone-solution-${milestoneIndex}`} className="form-label">
                    Solution/Outcome *
                  </label>
                  <textarea
                    id={`milestone-solution-${milestoneIndex}`}
                    value={milestone.solution}
                    onChange={(e) => handleMilestoneChange(milestoneIndex, 'solution', e.target.value)}
                    required
                    rows={3}
                    className="form-textarea"
                    placeholder="Describe the solution or outcome for this milestone"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`milestone-activities-${milestoneIndex}`} className="form-label">
                    What We Will Do *
                  </label>
                  <textarea
                    id={`milestone-activities-${milestoneIndex}`}
                    value={milestone.activities}
                    onChange={(e) => handleMilestoneChange(milestoneIndex, 'activities', e.target.value)}
                    required
                    rows={3}
                    className="form-textarea"
                    placeholder="Describe the activities that will be performed"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`milestone-image-${milestoneIndex}`} className="form-label">
                    Milestone Image *
                  </label>
                  <input
                    type="file"
                    id={`milestone-image-${milestoneIndex}`}
                    accept="image/*"
                    onChange={(e) => handleMilestoneImageChange(milestoneIndex, e)}
                    required={!milestone.image}
                    className="form-file"
                  />
                  {milestone.imagePreview && (
                    <div className="img-preview">
                      <img src={milestone.imagePreview} alt="Milestone preview" />
                    </div>
                  )}
                </div>
                {currentMilestones.length > 1 && (
                  <div className="milestone-actions">
                    <button
                      type="button"
                      onClick={() => removeMilestone(milestoneIndex)}
                      className="remove-button"
                    >
                      Remove This Milestone
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div className="milestone-actions" style={{ marginTop: '20px' }}>
              <button
                type="button"
                onClick={addMilestone}
                className="add-button"
              >
                Add Another Milestone
              </button>
            </div>
            <div className="form-actions" style={{ marginTop: '30px' }}>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="back-button"
                style={{ marginRight: '10px' }}
              >
                Back to Project Details
              </button>
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  totalMilestoneFunds > formData.totalFundObjective ||
                  totalMilestoneFunds < formData.totalFundObjective
                }
                className="form-button"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Complete Proposal'}
              </button>
            </div>
            {totalMilestoneFunds !== formData.totalFundObjective && (
              <div className="form-error" style={{ marginTop: '10px', color: 'red' }}>
                {totalMilestoneFunds > formData.totalFundObjective
                  ? 'Total milestone funds exceed the project fund objective. Please adjust milestone budgets.'
                  : 'Total milestone funds must equal the project fund objective. Please allocate the remaining budget.'}
              </div>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default FundraisingForm;
