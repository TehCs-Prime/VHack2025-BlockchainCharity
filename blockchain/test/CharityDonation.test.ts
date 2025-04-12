import { expect } from "chai";
import { ethers } from "hardhat";
import { CharityDonation, CharityDonation__factory } from "../typechain-types";
import { Signer } from "ethers";

describe("CharityDonation", () => {
  let charityDonation: CharityDonation;
  let admin: Signer, charity: Signer, donor1: Signer, donor2: Signer;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    [admin, charity, donor1, donor2] = signers;

    const CharityDonationFactory = (await ethers.getContractFactory("CharityDonation", admin)) as CharityDonation__factory;
    charityDonation = await CharityDonationFactory.deploy();
    // No need to call waitForDeployment(); deploy already waits
  });

  it("should verify a charity", async () => {
    await charityDonation.connect(admin).verifyCharity(await charity.getAddress());
    const isVerified = await charityDonation.verifiedCharities(await charity.getAddress());
    expect(isVerified).to.equal(true);
  });

  it("should allow a verified charity to create a campaign", async () => {
    await charityDonation.connect(admin).verifyCharity(await charity.getAddress());

    const milestoneDescriptions = ["Phase 1", "Phase 2"];
    const milestoneAmounts = [ethers.parseEther("1"), ethers.parseEther("1")];

    await charityDonation.connect(charity).createCampaign(
      "Charity A",
      ethers.parseEther("2"),
      30,
      milestoneDescriptions,
      milestoneAmounts
    );

    const campaign = await charityDonation.getCampaign(0);
    expect(campaign.name).to.equal("Charity A");
    expect(campaign.charityAddress).to.equal(await charity.getAddress());
    expect(campaign.totalGoal).to.equal(ethers.parseEther("2"));
    expect(campaign.totalDonated).to.equal(0n);
  });

  it("should allow donors to donate and track donation data", async () => {
    await charityDonation.connect(admin).verifyCharity(await charity.getAddress());

    await charityDonation.connect(charity).createCampaign(
      "Donation Campaign",
      ethers.parseEther("1"),
      10,
      ["Milestone 1"],
      [ethers.parseEther("1")]
    );

    await charityDonation.connect(donor1).donate(0, { value: ethers.parseEther("0.4") });
    await charityDonation.connect(donor2).donate(0, { value: ethers.parseEther("0.6") });

    const campaign = await charityDonation.getCampaign(0);
    expect(campaign.totalDonated).to.equal(ethers.parseEther("1"));

    const [donor1Total, donor1ForCampaign] = await charityDonation.getDonationDetails(await donor1.getAddress(), 0);
    const [donor2Total, donor2ForCampaign] = await charityDonation.getDonationDetails(await donor2.getAddress(), 0);

    expect(donor1Total).to.equal(ethers.parseEther("0.4"));
    expect(donor1ForCampaign).to.equal(ethers.parseEther("0.4"));
    expect(donor2Total).to.equal(ethers.parseEther("0.6"));
    expect(donor2ForCampaign).to.equal(ethers.parseEther("0.6"));
  });

  it("should release milestone funds only by charity", async () => {
    await charityDonation.connect(admin).verifyCharity(await charity.getAddress());

    await charityDonation.connect(charity).createCampaign(
      "Milestone Campaign",
      ethers.parseEther("1"),
      10,
      ["Milestone 1"],
      [ethers.parseEther("1")]
    );

    await charityDonation.connect(donor1).donate(0, { value: ethers.parseEther("1") });

    const milestoneBefore = await charityDonation.getMilestone(0, 0);
    expect(milestoneBefore.released).to.equal(false);

    await charityDonation.connect(charity).releaseMilestone(0, 0);

    const milestoneAfter = await charityDonation.getMilestone(0, 0);
    expect(milestoneAfter.released).to.equal(true);
  });

  it("should not release milestone twice", async () => {
    await charityDonation.connect(admin).verifyCharity(await charity.getAddress());

    await charityDonation.connect(charity).createCampaign(
      "One Milestone",
      ethers.parseEther("1"),
      10,
      ["Milestone A"],
      [ethers.parseEther("1")]
    );

    await charityDonation.connect(donor1).donate(0, { value: ethers.parseEther("1") });

    await charityDonation.connect(charity).releaseMilestone(0, 0);

    await expect(
      charityDonation.connect(charity).releaseMilestone(0, 0)
    ).to.be.revertedWith("Already released");
  });

  it("should not allow donation after campaign end", async () => {
    await charityDonation.connect(admin).verifyCharity(await charity.getAddress());

    await charityDonation.connect(charity).createCampaign(
      "Expired Campaign",
      ethers.parseEther("1"),
      0, // ends immediately
      ["Milestone"],
      [ethers.parseEther("1")]
    );

    // Fast forward time by 1 day
    await ethers.provider.send("evm_increaseTime", [86400]);
    await ethers.provider.send("evm_mine", []);

    await expect(
      charityDonation.connect(donor1).donate(0, { value: ethers.parseEther("1") })
    ).to.be.revertedWith("Campaign ended");
  });
});
