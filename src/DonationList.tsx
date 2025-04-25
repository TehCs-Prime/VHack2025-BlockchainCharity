// DonationList.tsx
import React from 'react';
import DonorTab from './Tab-Donors';

interface DonationListProps {
  projectId: string;
}

const DonationList: React.FC<DonationListProps> = ({ projectId }) => {
  // Delegates data fetching to the DonorTab component.
  // Make sure that Tab-Donors subscribes (via snapshot listeners or queries)
  // so that it automatically displays the updated donor count and progress.
  return <DonorTab projectId={projectId} />;
};

export default DonationList;
