// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

/// @title ServiceEscrow — Escrow for x402 service payments on X Layer
contract ServiceEscrow {
    IERC20 public immutable usdc;
    address public immutable owner;
    uint256 public constant FEE_BPS = 100; // 1% protocol fee

    struct Escrow {
        address buyer;
        address seller;
        uint256 amount;
        string serviceId;
        bool released;
        bool refunded;
        uint256 createdAt;
    }

    mapping(bytes32 => Escrow) public escrows;
    uint256 public totalVolume;
    uint256 public totalFees;

    event EscrowCreated(bytes32 indexed id, address buyer, address seller, uint256 amount, string serviceId);
    event EscrowReleased(bytes32 indexed id, uint256 sellerAmount, uint256 fee);
    event EscrowRefunded(bytes32 indexed id);

    constructor(address _usdc) {
        usdc = IERC20(_usdc);
        owner = msg.sender;
    }

    function createEscrow(address seller, uint256 amount, string calldata serviceId) external returns (bytes32) {
        require(amount > 0, "Amount must be > 0");
        bytes32 id = keccak256(abi.encodePacked(msg.sender, seller, amount, serviceId, block.timestamp));
        require(escrows[id].buyer == address(0), "Escrow exists");

        usdc.transferFrom(msg.sender, address(this), amount);
        escrows[id] = Escrow(msg.sender, seller, amount, serviceId, false, false, block.timestamp);
        emit EscrowCreated(id, msg.sender, seller, amount, serviceId);
        return id;
    }

    function release(bytes32 id) external {
        Escrow storage e = escrows[id];
        require(msg.sender == e.buyer || msg.sender == owner, "Unauthorized");
        require(!e.released && !e.refunded, "Already settled");

        e.released = true;
        uint256 fee = (e.amount * FEE_BPS) / 10000;
        uint256 sellerAmount = e.amount - fee;

        usdc.transfer(e.seller, sellerAmount);
        usdc.transfer(owner, fee);
        totalVolume += e.amount;
        totalFees += fee;

        emit EscrowReleased(id, sellerAmount, fee);
    }

    function refund(bytes32 id) external {
        Escrow storage e = escrows[id];
        require(msg.sender == owner, "Only owner");
        require(!e.released && !e.refunded, "Already settled");
        require(block.timestamp > e.createdAt + 1 hours, "Too early");

        e.refunded = true;
        usdc.transfer(e.buyer, e.amount);
        emit EscrowRefunded(id);
    }
}
