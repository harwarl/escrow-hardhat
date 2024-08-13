// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Escrow {
    address public arbiter;
    address public beneficiary;
    address public depositor;

    bool public isApproved;
    bool public isRefunded;

    constructor(address _arbiter, address _beneficiary) payable {
        require(
            _arbiter != msg.sender,
            "You can not be the arbiter of your the escrow"
        );
        arbiter = _arbiter;
        beneficiary = _beneficiary;
        depositor = msg.sender;
        isApproved = false;
        isRefunded = false;
    }

    event Approved(uint);

    function approve() external onlyArbiter {
        require(!isApproved, "This has already been approved");
        require(!isRefunded, "This has already been refunded");
        uint balance = address(this).balance;
        (bool sent, ) = payable(beneficiary).call{value: balance}("");
        require(sent, "Failed to send Ether");
        emit Approved(balance);
        isApproved = true;
    }

    event Refunded(uint);

    function refund() external onlyArbiter {
        require(!isApproved, "This has already been approved");
        require(!isRefunded, "This has already been refunded");
        uint balance = address(this).balance;
        (bool sent, ) = payable(depositor).call{value: balance}("");
        require(sent, "Failed to send ether");
        emit Refunded(balance);
        isRefunded = true;
    }

    modifier onlyArbiter() {
        require(
            msg.sender == arbiter,
            "Only Arbiter has access to this function"
        );
        _;
    }
}
