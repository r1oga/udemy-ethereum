pragma solidity ^0.5.1;

contract Inbox {
    string public message;

    constructor(string memory initialMessage) public {
        message = initialMessage;
    }


    function setMEssage(string memory newMessage) public {
        message = newMessage;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }
}
