// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Charity {
    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
        string message;
    }

    struct Milestone {
        uint256 amount;
        bool released;
        string description;
    }

    address public owner;
    string public charityName;
    uint256 public totalDonations;
    uint256 public milestoneAmount = 0.0001 ether; // Milestone amount in ETH
    bool public paused = false;
    Donation[] public donations;
    Milestone[] public milestones;
    
    event DonationReceived(
        address indexed donor,
        uint256 amount,
        uint256 timestamp,
        string message
    );
    
    event Withdrawal(address indexed owner, uint256 amount);
    event MilestoneReached(uint256 milestoneIndex, uint256 amount);
    event ContractPaused(bool paused);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    constructor(string memory _charityName) {
        owner = msg.sender;
        charityName = _charityName;
    }
    
    function donate(string memory _message) public payable whenNotPaused {
        require(msg.value > 0, "Donation amount must be greater than 0");
        
        donations.push(Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            message: _message
        }));
        
        totalDonations += msg.value;
        
        // Check if milestone is reached
        checkMilestones();
        
        emit DonationReceived(
            msg.sender,
            msg.value,
            block.timestamp,
            _message
        );
    }

    function checkMilestones() internal {
        uint256 currentMilestone = totalDonations / milestoneAmount;
        uint256 lastMilestone = milestones.length;
        
        if (currentMilestone > lastMilestone) {
            for (uint256 i = lastMilestone; i < currentMilestone; i++) {
                milestones.push(Milestone({
                    amount: (i + 1) * milestoneAmount,
                    released: false,
                    description: string(abi.encodePacked("Milestone ", uint2str(i + 1)))
                }));
                emit MilestoneReached(i, (i + 1) * milestoneAmount);
            }
        }
    }
    
    function getDonationCount() public view returns (uint256) {
        return donations.length;
    }
    
    function getDonation(uint256 index) public view returns (
        address donor,
        uint256 amount,
        uint256 timestamp,
        string memory message
    ) {
        require(index < donations.length, "Donation does not exist");
        Donation memory donation = donations[index];
        return (
            donation.donor,
            donation.amount,
            donation.timestamp,
            donation.message
        );
    }

    function getMilestoneCount() public view returns (uint256) {
        return milestones.length;
    }

    function getMilestone(uint256 index) public view returns (
        uint256 amount,
        bool released,
        string memory description
    ) {
        require(index < milestones.length, "Milestone does not exist");
        Milestone memory milestone = milestones[index];
        return (
            milestone.amount,
            milestone.released,
            milestone.description
        );
    }
    
    function withdraw() public onlyOwner whenNotPaused {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit Withdrawal(owner, balance);
    }

    function withdrawMilestone(uint256 milestoneIndex) public onlyOwner whenNotPaused {
        require(milestoneIndex < milestones.length, "Milestone does not exist");
        require(!milestones[milestoneIndex].released, "Milestone already released");
        
        uint256 amount = milestoneAmount;
        require(address(this).balance >= amount, "Insufficient funds");
        
        milestones[milestoneIndex].released = true;
        
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit Withdrawal(owner, amount);
    }
    
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function pause() public onlyOwner {
        paused = true;
        emit ContractPaused(true);
    }

    function unpause() public onlyOwner {
        paused = false;
        emit ContractPaused(false);
    }

    function setMilestoneAmount(uint256 _amount) public onlyOwner {
        milestoneAmount = _amount;
    }

    // Helper function to convert uint to string
    function uint2str(uint256 _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        return string(bstr);
    }
} 