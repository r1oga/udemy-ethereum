message: public(bytes32)

@public
def __init__(_initialMessage: bytes32):
  self.message = _initialMessage

@public
def setMessage(_newMessage: bytes32):
  self.message = _newMessage
