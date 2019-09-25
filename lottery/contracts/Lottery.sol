pragma solidity ^0.5.1;

contract Lottery {
    address payable public manager;
    address payable[] public players;

    event winner(address);

    constructor() public {
        manager = msg.sender;
    }

    modifier onlyManager() {
        require(
            msg.sender == manager,
            'Only manager of lottery can pick a winner'
        );
        _;
    }
    function enter() public payable {
        require(msg.value > .01 ether,
        'You must send money to the pool to enter the lottery'
        );
        players.push(msg.sender);
    }

    function pickWinner() onlyManager public {
        uint index = random() % players.length;
        players[index].transfer(address(this).balance);
        emit winner(players[index]);
        players = new address payable[](0);
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(
            block.difficulty,
            now,
            players
            )));
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }
}
