const chatHandler = (io) => {
  const rooms = new Map();
  let onlineUsers = 0;

  rooms.set("global", new Set());

  io.on("connection", (socket) => {
    onlineUsers++;
    io.emit("user-count", onlineUsers);

    // Initially join global
    socket.join("global");
    rooms.get("global").add(socket.id);

    socket.on("create-room", (roomId) => {
      if (rooms.has(roomId)) {
        socket.emit("room-error", "Room ID already exists");
        return;
      }

      leaveAllRoomsExceptSocketId(socket, rooms);

      rooms.set(roomId, new Set([socket.id]));
      socket.join(roomId);
      socket.emit("room-created", roomId);
    });

    socket.on("join-room", (roomId) => {
      if (!rooms.has(roomId) && roomId !== "global") {
        socket.emit("room-error", "Room does not exist");
        return;
      }

      leaveAllRoomsExceptSocketId(socket, rooms);

      if (!rooms.has(roomId)) rooms.set(roomId, new Set());
      rooms.get(roomId).add(socket.id);

      socket.join(roomId);
      socket.emit("room-joined", roomId);
    });

    socket.on("message", (data) => {
      if (!rooms.has(data.room)) return;

      // Fixed: Send only socket ID, not "You" text
      io.to(data.room).emit("message", {
        text: data.text,
        sender: data.sender, // Send raw socket ID
        room: data.room
      });
    });

    socket.on("disconnect", () => {
      onlineUsers--;
      io.emit("user-count", onlineUsers);

      rooms.forEach((users, roomId) => {
        if (users.has(socket.id)) {
          users.delete(socket.id);
          if (users.size === 0 && roomId !== "global") {
            rooms.delete(roomId);
          }
        }
      });
    });
  });

  function leaveAllRoomsExceptSocketId(socket, rooms) {
    Array.from(socket.rooms)
      .filter(room => room !== socket.id)
      .forEach(room => {
        socket.leave(room);
        if (rooms.has(room)) {
          rooms.get(room).delete(socket.id);
          if (rooms.get(room).size === 0 && room !== "global") {
            rooms.delete(room);
          }
        }
      });
  }
};

module.exports = chatHandler;