// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Charity {
    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
        string message;
    }

    address public owner;
    string public charityName;
    uint256 public totalDonations;
    Donation[] public donations;
    
    event DonationReceived(
        address indexed donor,
        uint256 amount,
        uint256 timestamp,
        string message
    );
    
    event Withdrawal(address indexed owner, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor(string memory _charityName) {
        owner = msg.sender;
        charityName = _charityName;
    }
    
    function donate(string memory _message) public payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        
        donations.push(Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            message: _message
        }));
        
        totalDonations += msg.value;
        
        emit DonationReceived(
            msg.sender,
            msg.value,
            block.timestamp,
            _message
        );
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
    
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit Withdrawal(owner, balance);
    }
    
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
} 