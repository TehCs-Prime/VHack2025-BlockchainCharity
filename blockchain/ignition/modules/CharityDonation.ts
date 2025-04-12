import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CharityDonationModule = buildModule("CharityDonationModule", (m) => {
  const charityDonation = m.contract("CharityDonation");
  return { charityDonation };
});

export default CharityDonationModule;

