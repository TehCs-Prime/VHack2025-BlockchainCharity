import React from 'react';
import './Tab-Milestone.css';

interface Milestone {
  id: string;
  name: string;
  amount: string;
  isActive: boolean;
  isImplemented: boolean;
}

interface Expense {
  date: string;
  type: string;
  description: string;
  amount: string;
}

interface MilestoneTabProps {
  milestones: Milestone[];
  currentMilestone: Milestone;
  objective: string;
  description: string;
  supportText: string;
  whatWeDid: string;
  expenses: Expense[];
  totalExpenses: string;
  images: string[];
}

const MilestoneTab: React.FC<MilestoneTabProps> = ({
  milestones,
  currentMilestone,
  objective,
  description,
  supportText,
  whatWeDid,
  expenses,
  totalExpenses,
  images
}) => {
  return (
    <div className="milestone-container">
      <div className="milestone-header">
        <h1 className="milestone-title">The Milestones</h1>
        <div className="objective">
          <span className="objective-label">OUR OBJECTIVE</span>
          <span className="objective-amount">{objective}</span>
        </div>
      </div>

      <div className="milestone-progress">
        {milestones.map((milestone, index) => (
          <React.Fragment key={milestone.id}>
            <div className={`milestone-node ${milestone.isActive ? 'active' : ''}`}>
              <div className="milestone-circle">{milestone.id}</div>
              <div className="milestone-amount">{milestone.amount}</div>
            </div>
            {index < milestones.length - 1 && <div className="milestone-line"></div>}
          </React.Fragment>
        ))}
      </div>

      <div className="milestone-details">
        <div className="milestone-number">
          <h2>{currentMilestone.id}</h2>
        </div>
        <div className="milestone-status">
          <span className="status-label">STATUS</span>
          <span className="status-value">IMPLEMENTED</span>
        </div>
      </div>

      <h3 className="section-title">SILAGE TARPS</h3>
      <p className="milestone-description">{description}</p>
      <p className="support-text">{supportText}</p>

      <div className="milestone-content">
        <div className="left-column">
          <h3 className="section-title">WHAT DID WE DO?</h3>
          <p className="what-we-did">{whatWeDid}</p>

          <h3 className="section-title">IMAGES</h3>
          <div className="image-gallery">
            {images.map((image, index) => (
              <div key={index} className="image-thumbnail">
                <img src={image} alt={`Project image ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="right-column">
          <h3 className="section-title">EXPENSES</h3>
          <div className="expenses-summary">
            <div className="total-amount">
              <span className="total-label">TOTAL AMOUNT SPENT</span>
              <span className="total-value">{totalExpenses}</span>
            </div>
            <button className="view-graph-btn">
              <span className="graph-icon">📊</span> View in graph
            </button>
          </div>

          <div className="expenses-table">
            <div className="expense-header">
              <div className="expense-date">
                <span className="icon">📅</span> DATE
              </div>
              <div className="expense-type">
                <span className="icon">🔄</span> TYPE
              </div>
              <div className="expense-amount">
                <span className="icon">💰</span> AMOUNT
              </div>
              <div className="expense-receipt">
                <span className="icon">🧾</span> RECEIPT
              </div>
            </div>
            
            {expenses.map((expense, index) => (
              <div key={index} className="expense-row">
                <div className="expense-date">{expense.date}</div>
                <div className="expense-type">{expense.type}</div>
                <div className="expense-amount">{expense.amount}</div>
                <div className="expense-receipt">
                  <span className="receipt-icon">📄</span>
                </div>
              </div>
            ))}

            <div className="expense-details">
              <div className="expense-description">
                <span className="icon">📝</span> DESCRIPTION
              </div>
              <div className="description-text">{expenses[0]?.description}</div>
            </div>

            <div className="blockchain-transaction">
              <span className="icon">🔗</span> TRANSACTION
              <a href="#" className="blockchain-link">View in Blockchain</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneTab;