interface User {
    name : string
    email : string
    image : string
    id : string
}

interface FriendRequest{
    senderId : string
    senderEmail : string
}

interface Chat {
    id : string
    messages : Message[]
}

interface Message {
    id : string
    senderId : string
    receiverId : string
    text : string
    timestamp : number
}