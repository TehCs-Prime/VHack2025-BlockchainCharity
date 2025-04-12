// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CharityDonation {
    struct Milestone {
        string description;
        uint256 amount;
        bool released;
    }

    struct Campaign {
        address payable charityAddress;
        string name;
        uint256 totalGoal;
        uint256 totalDonated;
        uint256 startTime;
        uint256 endTime;
        Milestone[] milestones;
        bool verified;
        bool completed;
    }

    struct Donor {
        uint256 totalDonated;
        mapping(uint256 => uint256) campaignDonations; // campaignId => amount
    }

    address public admin;
    uint256 public campaignCount;
    mapping(uint256 => Campaign) public campaigns;
    mapping(address => bool) public verifiedCharities;
    mapping(address => Donor) private donors;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    modifier onlyCharity(uint256 campaignId) {
        require(msg.sender == campaigns[campaignId].charityAddress, "Not the campaign owner");
        _;
    }

    event CampaignCreated(uint256 indexed campaignId, address indexed charity);
    event DonationReceived(uint256 indexed campaignId, address indexed donor, uint256 amount);
    event MilestoneReleased(uint256 indexed campaignId, uint256 indexed milestoneIndex, uint256 amount);
    event CharityVerified(address indexed charity);

    constructor() {
        admin = msg.sender;
    }

    function verifyCharity(address charity) external onlyAdmin {
        verifiedCharities[charity] = true;
        emit CharityVerified(charity);
    }

    function createCampaign(
        string memory name,
        uint256 totalGoal,
        uint256 durationInDays,
        string[] memory milestoneDescriptions,
        uint256[] memory milestoneAmounts
    ) external {
        require(verifiedCharities[msg.sender], "Charity not verified");
        require(milestoneDescriptions.length == milestoneAmounts.length, "Milestone mismatch");

        uint256 totalMilestones;
        for (uint256 i = 0; i < milestoneAmounts.length; i++) {
            totalMilestones += milestoneAmounts[i];
        }
        require(totalMilestones == totalGoal, "Milestones must equal goal");

        Campaign storage newCampaign = campaigns[campaignCount];
        newCampaign.charityAddress = payable(msg.sender);
        newCampaign.name = name;
        newCampaign.totalGoal = totalGoal;
        newCampaign.startTime = block.timestamp;
        newCampaign.endTime = block.timestamp + (durationInDays * 1 days);
        newCampaign.verified = true;

        for (uint256 i = 0; i < milestoneDescriptions.length; i++) {
            newCampaign.milestones.push(
                Milestone({
                    description: milestoneDescriptions[i],
                    amount: milestoneAmounts[i],
                    released: false
                })
            );
        }

        emit CampaignCreated(campaignCount, msg.sender);
        campaignCount++;
    }

    function donate(uint256 campaignId) external payable {
        Campaign storage campaign = campaigns[campaignId];
        require(block.timestamp < campaign.endTime, "Campaign ended");
        require(campaign.totalDonated + msg.value <= campaign.totalGoal, "Exceeds goal");

        campaign.totalDonated += msg.value;
        donors[msg.sender].totalDonated += msg.value;
        donors[msg.sender].campaignDonations[campaignId] += msg.value;

        emit DonationReceived(campaignId, msg.sender, msg.value);
    }

    function releaseMilestone(uint256 campaignId, uint256 milestoneIndex) external onlyCharity(campaignId) {
        Campaign storage campaign = campaigns[campaignId];
        require(block.timestamp < campaign.endTime, "Campaign expired");
        require(!campaign.milestones[milestoneIndex].released, "Already released");
        require(campaign.totalDonated >= campaign.milestones[milestoneIndex].amount, "Insufficient funds");

        campaign.milestones[milestoneIndex].released = true;
        campaign.charityAddress.transfer(campaign.milestones[milestoneIndex].amount);

        emit MilestoneReleased(campaignId, milestoneIndex, campaign.milestones[milestoneIndex].amount);
    }

    // View functions
    function getCampaign(uint256 campaignId) external view returns (
        string memory name,
        address charityAddress,
        uint256 totalGoal,
        uint256 totalDonated,
        bool verified,
        bool completed,
        uint256 milestoneCount
    ) {
        Campaign storage c = campaigns[campaignId];
        return (
            c.name,
            c.charityAddress,
            c.totalGoal,
            c.totalDonated,
            c.verified,
            c.completed,
            c.milestones.length
        );
    }

    function getMilestone(uint256 campaignId, uint256 milestoneIndex) external view returns (
        string memory description,
        uint256 amount,
        bool released
    ) {
        Milestone storage m = campaigns[campaignId].milestones[milestoneIndex];
        return (m.description, m.amount, m.released);
    }

    function getDonationDetails(address donor, uint256 campaignId) external view returns (
        uint256 totalFromDonor,
        uint256 forCampaign
    ) {
        return (
            donors[donor].totalDonated,
            donors[donor].campaignDonations[campaignId]
        );
    }
}
