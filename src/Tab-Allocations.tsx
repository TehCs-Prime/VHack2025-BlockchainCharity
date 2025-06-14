import React, { useState } from 'react';
import './Tab-Allocations.css';

export interface Allocation {
    id: number;
    receiver: string;
    date: string;
    amount: number;
    currency: string;
    useOfFunds: string | null;
}

interface AllocationsTabProps {
    allocations: Allocation[];
}

const AllocationsTab: React.FC<AllocationsTabProps> = ({ allocations }) => {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    // Add dummy data if no allocations provided
    const defaultAllocations: Allocation[] = allocations.length ? allocations : [{
        id: 1,
        receiver: "Lacial Charity",
        date: "2024-01-15",
        amount: 10,
        currency: "USDT",
        useOfFunds: "Development Fund"
    }];

    // Filter function based on date range
    const filteredAllocations = defaultAllocations.filter(allocation => {
        const allocationDate = new Date(allocation.date);
        const startDateObj = startDate ? new Date(startDate) : null;
        const endDateObj = endDate ? new Date(endDate) : null;
        
        // Date range filtering
        if (startDateObj && allocationDate < startDateObj) return false;
        if (endDateObj && allocationDate > endDateObj) return false;
        
        return true;
    });

    // Get the currency icon based on currency type
    const getCurrencyIcon = (currency: string) => {
        switch (currency) {
            case 'USDT':
                return <div className="currency-icon usdt-icon">T</div>;
            case 'BNB':
                return <div className="currency-icon busd-icon">B</div>;
            default:
                return null;
        }
    };

    return (
        <div className="receiver-content">
            <div className="filter-section">
                <h1 className="allocations-title">Allocation Records</h1> 
                <div className="date-filters">
                    <div className="date-filter">
                        <label>Start Date</label>
                        <div className="date-input-container">
                            <input 
                                type="date" 
                                value={startDate} 
                                onChange={(e) => setStartDate(e.target.value)}
                                className="date-input"
                            />
                        </div>
                    </div>
                    
                    <span className="to-text">To</span>
                    
                    <div className="date-filter">
                        <label>End Date</label>
                        <div className="date-input-container">
                            <input 
                                type="date" 
                                value={endDate} 
                                onChange={(e) => setEndDate(e.target.value)}
                                className="date-input"
                            />
                        </div>
                    </div>
                    <button className="view-more-button">View More</button>
                </div>
            </div>
            
            <div className="allocations-table">
                <div className="table-header">
                    <div className="col id">#</div>
                    <div className="col receiver">Receiver</div>
                    <div className="col date">Date</div>
                    <div className="col amount">Amount</div>
                    <div className="col currency">Currency</div>
                    <div className="col use-of-funds">Use of Funds</div>
                    <div className="col actions"></div>
                </div>
                
                {filteredAllocations.map((allocation) => (
                    <div key={allocation.id} className="table-row">
                        <div className="col id">{allocation.id}</div>
                        <div className="col receiver">{allocation.receiver}</div>
                        <div className="col date">{allocation.date}</div>
                        <div className="col amount">{allocation.amount.toLocaleString()}</div>
                        <div className="col currency">
                            {getCurrencyIcon(allocation.currency)}
                            {allocation.currency}
                        </div>
                        <div className="col use-of-funds">
                            {allocation.useOfFunds || '--'}
                        </div>
                        <div className="col actions">
                            <button className="expand-btn"><a style={{ textDecoration: "none", color: "inherit" }} href='https://sepolia.etherscan.io/tx/0x7763eafbb505a6451d93746b5cc8507626f24ec03c2dec954c401241d0f1c7fa'>›</a></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllocationsTab;