// import { io, Socket } from "socket.io-client";
// import { BASE_URL } from "./constant";

// export const createSocketConnection = () => {
//     return io(BASE_URL);
// }



import { io, Socket } from "socket.io-client";
import { BASE_URL } from "./constant";

export const createSocketConnection = () => {
    return io("/",{path:"/api/socket.io"});
}