// SPDX-License-Identifier: MIT
pragma solidity >=0.5.17;

contract Lottery{
     address public manager;
     address[] public players;
     
     constructor(){
         manager = msg.sender;
     }
     
     function enter() public payable{
         require(msg.value >= 0.01 ether);
         players.push(msg.sender);
     }
     
     function random() private view returns(uint){
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
     }
     
     function pickWinner() public restricted{
         // Select random index
         uint index = random() % players.length;
         
         // Transfer all of the ether to this account
         // _to.transfer(msg.value);
         payable(players[index]).transfer(address(this).balance);
         
         // Reset players array
         players = new address[](0); // Dynamic array with initial length = 0
     }
     
     modifier restricted(){
         // Make sure only manager able to call
         require(msg.sender == manager);
         _;
     }
     
     function getAddress() public view returns(address){
         return address(this);
     }
     
     function getBalance() public view returns(uint){
         return address(this).balance;
     }
     
     function getPlayers() public view returns(address[] memory){
         return players;
     }
}