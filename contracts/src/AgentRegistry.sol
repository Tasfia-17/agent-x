// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

/// @title AgentRegistry — On-chain identity for AgentX Marketplace agents
contract AgentRegistry {
    struct Agent {
        string name;
        string specialty;
        address wallet;
        uint256 reputation;
        uint256 completedJobs;
        uint256 totalEarned;
        bool active;
    }

    mapping(uint256 => Agent) public agents;
    mapping(address => uint256) public walletToId;
    uint256 public agentCount;

    event AgentRegistered(uint256 indexed id, string name, address wallet, string specialty);
    event ReputationUpdated(uint256 indexed id, uint256 newReputation);
    event JobCompleted(uint256 indexed agentId, uint256 payment, address payer);

    function register(string calldata name, string calldata specialty) external returns (uint256) {
        require(walletToId[msg.sender] == 0, "Already registered");
        uint256 id = ++agentCount;
        agents[id] = Agent(name, specialty, msg.sender, 100, 0, 0, true);
        walletToId[msg.sender] = id;
        emit AgentRegistered(id, name, msg.sender, specialty);
        return id;
    }

    function recordCompletion(uint256 agentId, uint256 payment) external {
        Agent storage agent = agents[agentId];
        require(agent.active, "Agent not active");
        agent.completedJobs++;
        agent.totalEarned += payment;
        agent.reputation = agent.reputation + 10 > 1000 ? 1000 : agent.reputation + 10;
        emit JobCompleted(agentId, payment, msg.sender);
        emit ReputationUpdated(agentId, agent.reputation);
    }

    function getAgent(uint256 id) external view returns (Agent memory) {
        return agents[id];
    }
}
