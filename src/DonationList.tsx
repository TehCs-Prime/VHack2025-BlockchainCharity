// DonationList.tsx
import React from 'react';
import DonorTab from './Tab-Donors';

interface DonationListProps {
  projectId: string;
}

const DonationList: React.FC<DonationListProps> = ({ projectId }) => {
  // Delegate data fetching to the DonorTab component by passing the projectId.
  return <DonorTab projectId={projectId} />;
};

export default DonationList;
