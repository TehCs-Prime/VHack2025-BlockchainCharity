// CampaignsTable.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './CampaignsTable.css'; // This line imports the CSS file

interface Campaign {
  id: string;
  title: string;
  status: string;
  goalAmount: number;
  raisedAmount: number;
  createdAt?: any; // Adjust according to your timestamp type from Firestore
}

interface CampaignsTableProps {
  campaigns: Campaign[];
}

const CampaignsTable: React.FC<CampaignsTableProps> = ({ campaigns }) => {
  return (
    <table className="campaigns-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Goal Amount</th>
          <th>Raised Amount</th>
          <th>Created On</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {campaigns.map((campaign) => (
          <tr key={campaign.id}>
            <td>{campaign.title}</td>
            <td>{campaign.status}</td>
            <td>${Number(campaign.goalAmount).toLocaleString()}</td>
            <td>${Number(campaign.raisedAmount).toLocaleString()}</td>
            <td>
              {campaign.createdAt
                ? new Date(campaign.createdAt.seconds * 1000).toLocaleDateString()
                : 'N/A'}
            </td>
            <td>
              <Link to={`/project/${campaign.id}`} className="campaign-link">
                View Details
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CampaignsTable;
