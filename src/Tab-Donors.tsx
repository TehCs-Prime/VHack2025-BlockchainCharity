import React from 'react';
import './Tab-Donors.css';

export interface Donation {
    id: number;
    currency: string;
    amount: number;
    donor: string;
    date: string;
    message: string | null;
}

interface DonorTabProps {
    donations: Donation[];
}

const DonorTab: React.FC<DonorTabProps> = ({ donations }) => {
    const truncateMessage = (message: string, maxLength: number = 30) => {
        if (!message) return "-";
        if (message.length <= maxLength) return message;
        return message.substring(0, maxLength) + "...";
    };

    return (
        <div className="donors-content">
            <div className="donors-header">
                <h1>Donors</h1>
                <button className="view-more-btn">View More</button>
            </div>
            
            <div className="donors-table">
                <div className="table-header">
                <div className="col currency">Currency</div>
                <div className="col amount">Amount</div>
                <div className="col donor">Donor</div>
                <div className="col date">Date</div>
                <div className="col message">Message</div>
                <div className="col actions"></div>
                </div>
                
                {donations.map((donation) => (
                <div key={donation.id} className="table-row">
                    <div className="col currency">
                    <div className="currency-icon">
                        {donation.currency === 'BNB' ? (
                        <div className="icon bnb-icon">₿</div>
                        ) : (
                        <div className="icon usdt-icon">T</div>
                        )}
                    </div>
                    {donation.currency}
                    </div>
                    <div className="col amount">{donation.amount}</div>
                    <div className="col donor">{donation.donor}</div>
                    <div className="col date">{donation.date}</div>
                    <div className="col message">
                    {donation.message ? (
                        <div className="message-content" title={donation.message}>
                            {truncateMessage(donation.message)}
                        </div>                        
                    ) : (
                        "-"
                    )}
                    </div>
                    <div className="col actions">
                    <button className="expand-btn"><a href='https://bscscan.com/tx/0x192d2b9dc09637f580b3e913e99489922fca3820d87e9c8de59a542b7d76cc9f'style={{ textDecoration: "none", color: "inherit" }}>›</a></button>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
};

export default DonorTab;