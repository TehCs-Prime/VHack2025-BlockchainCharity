import React, { useState, useEffect } from 'react';
import './Tab-Milestone.css';
import GraphOverlay from './Graph-Overlay';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase'; // adjust path as needed

export interface Expense {
  date: string;
  type: string;
  description: string;
  amount: string;
  receipt: File | null;
  receiptPreview: string | null;
  transaction: string;
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

const TabMilestone: React.FC<MilestoneTabProps> = ({
  milestones,
  objective,
  initialMilestoneId,
}) => {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(
    initialMilestoneId || (milestones.length > 0 ? milestones[0].title : '')
  );

  // Local state for dynamic expenses fetched from Firestore
  const [expensesData, setExpensesData] = useState<Expense[]>([]);
  // Form toggling and state
  const [showForm, setShowForm] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    date: '',
    type: '',
    amount: '',
    description: '',
    transaction: '',
    receiptFile: null as File | null,
  });

  // Sync selectedMilestoneId if props change
  useEffect(() => {
    if (milestones.length > 0 && !milestones.find(m => m.title === selectedMilestoneId)) {
      setSelectedMilestoneId(milestones[0].title);
    }
  }, [milestones, selectedMilestoneId]);

  // Fetch expenses from Firestore whenever milestone changes
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!selectedMilestoneId) return;
      const docRef = doc(db, 'milestones', selectedMilestoneId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setExpensesData(data.expenses || []);
      }
    };
    fetchExpenses();
  }, [selectedMilestoneId]);

  const selectedMilestone = milestones.find(m => m.title === selectedMilestoneId) || milestones[0];
  const selectedIndex = milestones.findIndex(m => m.title === selectedMilestoneId);

  const handleMilestoneClick = (id: string) => {
    setSelectedMilestoneId(id);
    setShowForm(false);
  };

  const handleOpenGraph = () => setIsGraphOpen(true);
  const handleCloseGraph = () => setIsGraphOpen(false);
  const [isGraphOpen, setIsGraphOpen] = useState(false);

  const handleToggleForm = () => setShowForm(prev => !prev);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setExpenseForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpenseForm(prev => ({
      ...prev,
      receiptFile: e.target.files ? e.target.files[0] : null,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { date, type, amount, description, transaction } = expenseForm;
    const newExpense: Expense = {
      date,
      type,
      description,
      amount,
      receipt: null,
      // Mock PDF receipt link (not actually stored)
      receiptPreview: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      transaction,
    };
    // Persist to Firestore
    const docRef = doc(db, 'milestones', selectedMilestoneId);
    await updateDoc(docRef, {
      expenses: arrayUnion(newExpense),
    });
    // Update local state
    setExpensesData(prev => [...prev, newExpense]);
    // Reset form
    setExpenseForm({ date: '', type: '', amount: '', description: '', transaction: '', receiptFile: null });
    setShowForm(false);
  };

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
              <span className="status-value">{selectedMilestone.status}</span>
            </div>
          </div>

          <h3 className="section-title">SOLUTION</h3>
          <p className="milestone-solution">
            {selectedMilestone.solution || 'No solution provided.'}
          </p>

          <div className="section-row">
            <div className="section-column">
              <h3 className="section-title aligned-title">WHAT DID WE DO?</h3>
              <p className="what-we-did">{selectedMilestone.activities}</p>
            </div>
            <div className="section-column">
              <h3 className="section-title aligned-title">IMAGES</h3>
              <div className="image-gallery">
                {selectedMilestone.imagePreview && (
                  <div className="image-thumbnail">
                    <img src={selectedMilestone.imagePreview} alt={selectedMilestone.title} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="right-column">
            <h3 className="section-title">EXPENSES</h3>
            <div className="expenses-summary">
              <div className="total-amount">
                <span className="total-label">TOTAL AMOUNT SPENT</span>
                <span className="total-value">
                  {expensesData.reduce((acc, e) => acc + (parseFloat(e.amount) || 0), 0).toFixed(2)}
                </span>
              </div>
              <button className="add-expense-btn" onClick={handleToggleForm}>
                + Add Expense
              </button>
              <button className="view-graph-btn" onClick={handleOpenGraph}>
                <span className="graph-icon">📊</span> View in graph
              </button>
            </div>

            {showForm && (
              <form className="expense-form" onSubmit={handleFormSubmit}>
                <input
                  type="date"
                  name="date"
                  value={expenseForm.date}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="type"
                  placeholder="Type"
                  value={expenseForm.type}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={expenseForm.amount}
                  onChange={handleInputChange}
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={expenseForm.description}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="url"
                  name="transaction"
                  placeholder="Transaction Link"
                  value={expenseForm.transaction}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                <div>
                  <button type="submit">Submit</button>
                  <button type="button" onClick={handleToggleForm}>Cancel</button>
                </div>
              </form>
            )}

            {expensesData.map((expense, idx) => (
              <div key={idx} className="expenses-table">
                <div className="expense-header">
                  <div className="expense-date">DATE</div>
                  <div className="expense-type">TYPE</div>
                  <div className="expense-amount">AMOUNT</div>
                  <div className="expense-receipt">RECEIPT</div>
                </div>
                <div className="expense-row">
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
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        📄
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </div>
                </div>

                <div className="expense-details">
                  <div className="expense-description">DESCRIPTION 📝</div>
                  <div className="description-text">{expense.description}</div>
                </div>
                <div className="blockchain-transaction">
                  <span className="icon"></span> TRANSACTION 🔗
                  <a href={expense.transaction} className="blockchain-link">
                    View Link
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <GraphOverlay
        isOpen={isGraphOpen}
        onClose={handleCloseGraph}
        expenses={expensesData}
        milestoneName={selectedMilestone.title}
        totalExpenses={
          expensesData.reduce((acc, e) => acc + (parseFloat(e.amount) || 0), 0).toFixed(2)
        }
      />
    </div>
  );
};

export default TabMilestone;
