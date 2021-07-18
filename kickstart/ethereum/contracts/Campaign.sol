pragma solidity >=0.5.0;

contract CampaignFactory{
    address[] public deployedCampaigns;
    
    function createCampaign(uint _minimum) public{
        // Instrust this contract to deploy an instance of Campaign contract
        address newCampaign = address(new Campaign(_minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaign() public view returns(address[] memory){
        return deployedCampaigns;
    }
}

contract Campaign{
    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping (address=>bool) approvals;
    }
    
    uint numRequests;
    mapping (uint => Request) public requests;
    address public manager;
    uint public minimumContribution;
    mapping (address=>bool) public approvers;
    uint public approversCount;
    
    modifier restricted(){
         require(manager == msg.sender);
         _;
    }
    
    constructor(uint _minimum, address _creator){
        manager = _creator;
        minimumContribution = _minimum;
    }
    
    function contribute() public payable{
        require(msg.value > minimumContribution);
        
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function createRequest(string memory _description, uint _value, address _recipient) public restricted{
       Request storage r = requests[numRequests++];
       
       r.description = _description;
       r.value = _value;
       r.recipient = _recipient;
       r.complete = false;
       r.approvalCount = 0;
    }
    
    function approveRequest(uint _index) public{
        // Define a local variable for convenience
        // Storage means the variable'll represent expression on the right-hand side
        // If use memory, it'll behave like deep copy in JS
        Request storage request = requests[_index];
        
        // Making sure this person has donated
        require(approvers[msg.sender]);
        
        // Making sure this person hasn't voted
        require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }   
    
    function finalizeRequest(uint _index) public restricted{
        Request storage request = requests[_index];
        
        // Make sure the number is satisfied
        require(request.approvalCount > (approversCount / 2));
        
        // If it hasn't completed
        require(!request.complete);
        
        request.complete = true;
        
        payable(request.recipient).transfer(request.value);
    }
}