import {io} from 'socket.io-client';
const socket=()=>{
    return io('http://localhost:5000',{
        "force new connection":true,
        reconnectionAttempts:'Infinity',
        timeout:10000,
        transports:['websocket']
    });
}
export default socket;