// Tab-Milestone.tsx
import React, { useState, useEffect } from 'react';
import './Tab-Milestone.css';
import GraphOverlay from './Graph-Overlay';

export interface Expense {
  date: string;
  type: string;
  description: string;
  amount: string;
  receipt: File | null;
  receiptPreview: string | null;
}

export interface Milestone {
  title: string;           // Milestone title (used as an identifier)
  activities: string;      // Activities details
  expenses: Expense[];     // Expense breakdown array
  fundObjective: number;   // Funding objective for this milestone
  image: File | null;      // Original file (not used for display)
  imagePreview: string | null; // URL from imgbb for display
  solution: string;        // Text for the solution or outcome of the milestone
  status: string;          // Milestone status (e.g. Pending, In Progress, Implemented)
}

interface MilestoneTabProps {
  milestones: Milestone[];       // Data passed from your project document in the database
  objective: string;             // Overall objective as a formatted string (e.g., "US$ 10,000")
  initialMilestoneId?: string;   // Optional initial milestone identifier (using title as identifier)
}

const MilestoneTab: React.FC<MilestoneTabProps> = ({
  milestones,
  objective,
  initialMilestoneId,
}) => {
  // Use the provided initialMilestoneId or default to the first milestone's title.
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(
    initialMilestoneId || (milestones.length > 0 ? milestones[0].title : '')
  );

  // If milestones update and the current selection is missing, select the first milestone.
  useEffect(() => {
    if (milestones.length > 0 && !milestones.find(m => m.title === selectedMilestoneId)) {
      setSelectedMilestoneId(milestones[0].title);
    }
  }, [milestones, selectedMilestoneId]);

  // Using the milestone's title as its identifier (assumed unique).
  const selectedMilestone = milestones.find(m => m.title === selectedMilestoneId) || milestones[0];
  const selectedIndex = milestones.findIndex(m => m.title === selectedMilestoneId);

  const handleMilestoneClick = (id: string) => {
    setSelectedMilestoneId(id);
  };

  // State for toggling the graph overlay.
  const [isGraphOpen, setIsGraphOpen] = useState(false);
  const handleOpenGraph = () => setIsGraphOpen(true);
  const handleCloseGraph = () => setIsGraphOpen(false);

  return (
    <div className="milestone-container">
      <div className="milestone-header">
        <h1 className="milestone-title">Progress Milestones</h1>
        <div className="objective">
          <span className="objective-label">OUR OBJECTIVE</span>
          <span className="objective-amount">{objective}</span>
        </div>
      </div>

      <div className="milestone-progress">
        {milestones.map((milestone, index) => (
          <React.Fragment key={index}>
            <div 
              className={`milestone-node ${milestone.title === selectedMilestoneId ? 'active' : ''}`}
              onClick={() => handleMilestoneClick(milestone.title)}
            >
              <div className="milestone-circle">{milestone.title}</div>
              <div className="milestone-fund">{milestone.fundObjective}</div>
            </div>
            {index < milestones.length - 1 && (
              <div className={`milestone-line ${index < selectedIndex ? 'completed' : ''}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {selectedMilestone && (
        <>
          <div className="milestone-details">
            <div className="milestone-title-display">
              <h2>{selectedMilestone.title}</h2>
            </div>
            <div className="milestone-status">
              <span className="status-label">STATUS</span>
              <span className="status-value">
                {selectedMilestone.status}
              </span>
            </div>
          </div>

          <h3 className="section-title">SOLUTION</h3>
          <p className="milestone-solution">
            {selectedMilestone.solution ? selectedMilestone.solution : 'No solution provided.'}
          </p>

          <h3 className="section-title">WHAT DID WE DO?</h3>
          <p className="what-we-did">{selectedMilestone.activities}</p>

          <h3 className="section-title">IMAGES</h3>
          <div className="image-gallery">
            {selectedMilestone.imagePreview && (
              <div className="image-thumbnail">
                <img src={selectedMilestone.imagePreview} alt={selectedMilestone.title} />
              </div>
            )}
          </div>

          <div className="right-column">
            <h3 className="section-title">EXPENSES</h3>
            <div className="expenses-summary">
              <div className="total-amount">
                <span className="total-label">TOTAL AMOUNT SPENT</span>
                <span className="total-value">
                  {selectedMilestone.expenses 
                    ? selectedMilestone.expenses.reduce((acc, e) => acc + (parseFloat(e.amount) || 0), 0).toFixed(2)
                    : '0'}
                </span>
              </div>
              <button className="view-graph-btn" onClick={handleOpenGraph}>
                <span className="graph-icon">📊</span> View in graph
              </button>
            </div>

            <div className="expenses-table">
              <div className="expense-header">
                <div className="expense-date">
                  <span className="icon"></span> DATE
                </div>
                <div className="expense-type">
                  <span className="icon"></span> TYPE
                </div>
                <div className="expense-amount">
                  <span className="icon"></span> AMOUNT
                </div>
                <div className="expense-receipt">
                  <span className="icon"></span> RECEIPT
                </div>
              </div>
              
              {selectedMilestone.expenses.map((expense, index) => (
                <div key={index} className="expense-row">
                  <div className="expense-date">{expense.date}</div>
                  <div className="expense-type">{expense.type}</div>
                  <div className="expense-amount">{expense.amount}</div>
                  <div className="expense-receipt">
                    {expense.receiptPreview ? (
                      <a 
                        className="receipt-icon" 
                        href={expense.receiptPreview} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        📄
                      </a>
                    ) : (
                      'N/A'
                    )}                    
                  </div>
                </div>
              ))}

              {selectedMilestone.expenses.length > 0 && (
                <>
                  <div className="expense-details">
                    <div className="expense-description">
                      <span className="icon"></span> DESCRIPTION 📝
                    </div>
                    <div className="description-text">
                      {selectedMilestone.expenses[0].description}
                    </div>
                  </div>

                  <div className="blockchain-transaction">
                    <span className="icon"></span> TRANSACTION 🔗
                    <a 
                      href="https://bitpay.com/insight/BTC/mainnet/tx/e6b6d64675281f3e0e6eeb94a28da0717e77492ae7b4194ce9fbd500716aaeda" 
                      className="blockchain-link"
                    >
                      View in Blockchain
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      <GraphOverlay 
        isOpen={isGraphOpen}
        onClose={handleCloseGraph}
        expenses={selectedMilestone.expenses}
        milestoneName={selectedMilestone.title}
        totalExpenses={
          selectedMilestone.expenses
            ? selectedMilestone.expenses.reduce((acc, e) => acc + (parseFloat(e.amount) || 0), 0).toFixed(2)
            : '0'
        }
      />
    </div>
  );
};

export default MilestoneTab;
