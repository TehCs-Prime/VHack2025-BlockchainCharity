import { ethers } from "hardhat";

async function main() {
  const [deployer, donor1, donor2] = await ethers.getSigners();

  console.log("👤 Deployer:", deployer.address);
  console.log("👥 Donor1:", donor1.address);
  console.log("👥 Donor2:", donor2.address);

  const CharityFactory = await ethers.getContractFactory("CharityDonation");
  const charityContract = await CharityFactory.deploy();
  await charityContract.waitForDeployment();

  const charityAddress = deployer.address;
  console.log("✅ Contract deployed to:", await charityContract.getAddress());

  // Step 1: Verify Charity
  const verifyTx = await charityContract.verifyCharity(charityAddress);
  await verifyTx.wait();
  console.log("🎉 Charity verified:", charityAddress);

  // Step 2: Create Campaign
  const milestoneDescriptions = ["Milestone 1", "Milestone 2"];
  const milestoneAmounts = [ethers.parseEther("1"), ethers.parseEther("1")];

  const campaignTx = await charityContract.createCampaign(
    "Test Campaign",
    ethers.parseEther("2"),
    10, // duration in days
    milestoneDescriptions,
    milestoneAmounts
  );
  await campaignTx.wait();
  console.log("📦 Sample campaign created");

  // Step 3: Simulate Donations
  const donateTx1 = await charityContract.connect(donor1).donate(0, {
    value: ethers.parseEther("0.4"),
  });
  await donateTx1.wait();

  const donateTx2 = await charityContract.connect(donor2).donate(0, {
    value: ethers.parseEther("1.6"),
  });
  await donateTx2.wait();
  console.log("💸 Donors donated 2 ETH to campaign 0");

  // Step 4: Release First Milestone
  const releaseTx1 = await charityContract.releaseMilestone(0, 0);
  await releaseTx1.wait();
  console.log("🔓 Milestone 0 released");

  // Step 5: Try releasing the same milestone again (should fail)
  try {
    await charityContract.releaseMilestone(0, 0);
  } catch {
    console.log("🚫 Cannot release milestone 0 again (as expected)");
  }

  // Step 6: Fast forward time and try donation again (should fail)
  await ethers.provider.send("evm_increaseTime", [11 * 86400]); // +11 days
  await ethers.provider.send("evm_mine", []);

  try {
    await charityContract.connect(donor1).donate(0, {
      value: ethers.parseEther("0.1"),
    });
  } catch {
    console.log("⏰ Donation after campaign end is not allowed (as expected)");
  }

  // Step 7: Query campaign info
  const campaign = await charityContract.getCampaign(0);
  console.log("📊 Campaign Info:", campaign);

  // Step 8: Query milestone info
  const milestone = await charityContract.getMilestone(0, 0);
  console.log("📍 Milestone 0 Info:", milestone);

  // Step 9: Query donation info
  const donation1 = await charityContract.getDonationDetails(donor1.address, 0);
  console.log("📈 Donor1 Donation Info:", donation1);

  const donation2 = await charityContract.getDonationDetails(donor2.address, 0);
  console.log("📈 Donor2 Donation Info:", donation2);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
