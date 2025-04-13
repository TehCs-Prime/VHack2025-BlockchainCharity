// Tab-Donors.tsx
import React, { useEffect, useState } from 'react';
import './Tab-Donors.css';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase'; // Ensure that Firebase is properly initialized

export interface Donation {
  id: string;           // Firestore document ID
  currency: string;     // Currency type (e.g., "MYR" for card or "BNB" for crypto)
  amount: number;       // The donation amount
  donor: string;        // Donor's name or identifier
  date: string;         // Donation date (formatted)
  message: string | null;
  paymentMethod: string; // "crypto" or "card"
}

interface DonorTabProps {
  projectId: string;
}

const DonorTab: React.FC<DonorTabProps> = ({ projectId }) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  const truncateMessage = (message: string, maxLength: number = 30) => {
    if (!message) return "-";
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  // Listen to the 'donations' collection for documents with the matching projectId.
  useEffect(() => {
    const donationsQuery = query(
      collection(db, 'donations'),
      where('projectId', '==', projectId)
    );

    const unsubscribe = onSnapshot(
      donationsQuery,
      (querySnapshot) => {
        const donationList: Donation[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();

          // Determine donation type by checking if fiat fields are provided.
          // If both fiatAmount and fiatCurrency are present (and non-empty), treat it as a card donation.
          const isCardDonation = data.fiatAmount && data.fiatCurrency;
          const paymentMethod = isCardDonation ? "card" : "crypto";

          let amount = 0;
          let currency = "Unknown";

          if (paymentMethod === "card") {
            amount = parseFloat(data.fiatAmount);
            currency = data.fiatCurrency;
          } else if (paymentMethod === "crypto" && data.cryptoAmount) {
            amount = parseFloat(data.cryptoAmount);
            currency = data.cryptoType || "Crypto";
          }

          donationList.push({
            id: docSnap.id,
            donor: data.donor || "anonymous",
            date:
              data.date && data.date.toDate
                ? data.date.toDate().toLocaleDateString()
                : '',
            message: data.message || null,
            amount,
            currency,
            paymentMethod,
          });
        });
        setDonations(donationList);
        setLoading(false);
      },
      (error) => {
        console.error("Error retrieving donations:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [projectId]);

  if (loading) {
    return <div>Loading donations...</div>;
  }

  return (
    <div className="donors-content">
      <div className="donors-header">
        <h1>Donors</h1>
        <button className="view-more-button">View More</button>
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
              <div className="currency-icons">
                {/* Display different icons for crypto vs. card donations */}
                {donation.paymentMethod === "crypto" ? (
                  donation.currency === 'BNB' ? (
                    <div className="icons bnb-icon">₿</div>
                  ) : (
                    <div className="icons usdt-icon">T</div>
                  )
                ) : (
                  <div className="icons card-icon">
                    {/* Optionally, you could map the fiat currency to its symbol */}
                    {donation.currency === "MYR" ? "RM" : "$"}
                  </div>
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
              <button className="expand-btn">
                <a
                  href="https://bscscan.com/tx/0x192d2b9dc09637f580b3e913e99489922fca3820d87e9c8de59a542b7d76cc9f"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  ›
                </a>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonorTab;
