import React from 'react';
import './Graph-Overlay.css';
import { Expense } from './Tab-Milestone';

interface GraphOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
  milestoneName: string;
  totalExpenses: string;
}

const GraphOverlay: React.FC<GraphOverlayProps> = ({
  isOpen,
  onClose,
  expenses,
}) => {
  if (!isOpen) return null;

  // Group expenses by type for the pie chart data
  const expensesByType: Record<string, number> = {};
  expenses.forEach((expense) => {
    const amount = parseFloat(expense.amount.replace(/[^0-9.-]+/g, ''));
    if (!isNaN(amount)) {
      if (expensesByType[expense.type]) {
        expensesByType[expense.type] += amount;
      } else {
        expensesByType[expense.type] = amount;
      }
    }
  });

  return (
    <div className="graph-overlay">
      <div className="graph-content">
        <div className="graph-header">
          <div className="header-content">
            <h1 className="header-title">Funds Movements</h1>
            <div className="header-underline"></div>
            <p className="header-description">
              Here you can see the flow of donations in detail for the Project.
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <span className="back-text">BACK TO PROJECT DETAILS</span>
            <span className="back-icon">↩</span>
          </button>
        </div>
        
        <div className="graph-body">
          <p>Graph to be implemented in the future... Stay tuned!</p>
           {/* <a href='https://bitpay.com/insight/BTC/mainnet/tx/e6b6d64675281f3e0e6eeb94a28da0717e77492ae7b4194ce9fbd500716aaeda'><img src='/assets/FundMovement.png' ></img></a> */}
        </div>
      </div>
    </div>
  );
};

export default GraphOverlay;