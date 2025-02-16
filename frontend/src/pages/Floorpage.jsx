import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";

const FloorPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [block, setBlock] = useState(() => {
    return state?.block || JSON.parse(localStorage.getItem("block")) || null;
  });

  const [floorid, setFloorid] = useState(null);
  const [floorName, setFloorName] = useState("");
  const [roomdata, setRoomData] = useState([]);
  const [err, setErr] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchBlockData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/block/get-data/${block._id}`);
        setBlock(response.data);
        localStorage.setItem("block", JSON.stringify(response.data));
      } catch (error) {
        setErr("Failed to fetch updated block data");
      }
    };
    if (block) fetchBlockData();
  }, [block?._id]);

  const handleAddFloor = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/block/floor/${block._id}`, { floor_name: floorName });
      setFloorName("");
      const response = await axios.get(`http://localhost:5000/block/get-data/${block._id}`);
      setBlock(response.data);
    } catch (error) {
      setErr(error.message);
    }
  };

  const confirmDeleteFloor = () => {
    setDeleteDialogOpen(true);
  };

  const deleteFloor = async () => {
    setDeleteDialogOpen(false);
    try {
      await axios.delete(`http://localhost:5000/block/${block._id}/floor/${floorid._id}`);
      const updatedData = await axios.get(`http://localhost:5000/block/get-data/${block._id}`);

      if (!updatedData.data) {
        showAlert("Failed to delete the floor");
        return;
      }

      localStorage.setItem("block", JSON.stringify(updatedData.data));
      showAlert("Floor has been deleted");
      navigate(`/get-data/${updatedData.data.block_name}`, { state: { block: updatedData.data } });
    } catch (error) {
      showAlert("Something went wrong...");
    }
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertDialogOpen(true);
  };

  const displayRoom = (floor) => {
    setRoomData(floor.rooms);
    setFloorid(floor);
  };

  const addRooms = () => {
    navigate(`/get-data/${block.block_name}/${floorid.floor_name}`, { state: { floor: floorid, Block: block } });
  };

  const modifyRoom = (room) => {
    navigate(`/get-data/${block.block_name}/${floorid.floor_name}/modify/${room.room_name}`, { state: { Block: block, floor: floorid, Room: room } });
  };

  const deleteRoom = async (room) => {
    if (!room || !floorid || !block) {
      showAlert("Missing data to delete the room.");
      return;
    }

    setAlertMessage(`Are you sure you want to delete the room: ${room.room_name}?`);
    setAlertDialogOpen(true);

    try {
      await axios.delete(`http://localhost:5000/block/${block._id}/floor/${floorid._id}/room/${room._id}`);
      const updatedData = await axios.get(`http://localhost:5000/block/get-data/${block._id}`);

      if (!updatedData.data) {
        showAlert("Failed to delete the room.");
        return;
      }

      localStorage.setItem("block", JSON.stringify(updatedData.data));
      setBlock(updatedData.data);
      setRoomData(updatedData.data.floors.find((f) => f._id === floorid._id)?.rooms || []);

      showAlert(`Room '${room.room_name}' has been deleted.`);
    } catch (error) {
      showAlert("Something went wrong");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Floor Page for Block: {block?.block_name}
      </Typography>

      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <Paper sx={{ padding: 2, marginBottom: 3, boxShadow: 3 }}>
          <TextField
            label="Enter floor name"
            variant="outlined"
            fullWidth
            value={floorName}
            onChange={(e) => setFloorName(e.target.value)}
          />
          <Box sx={{ marginTop: 2, display: "flex", gap: 2 }}>
            <Button variant="contained" color="primary" onClick={handleAddFloor}>
              Add Floor
            </Button>
            {floorid && (
              <Button variant="contained" color="error" onClick={confirmDeleteFloor}>
                Delete Floor
              </Button>
            )}
          </Box>
        </Paper>
      </motion.div>

      <Grid container spacing={2}>
        {block?.floors?.map((floor, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card sx={{ padding: 2, cursor: "pointer" }} onClick={() => displayRoom(floor)}>
                <CardContent>
                  <Typography variant="h6">{floor.floor_name}</Typography>
                  <Typography variant="body2">{floor.rooms.length} Rooms</Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {floorid && (
        <Box sx={{ marginTop: 4 }}>
          <Button variant="contained" color="success" onClick={addRooms}>
            Add Room to {floorid.floor_name.toUpperCase()}
          </Button>
          <Typography variant="h5" sx={{ marginTop: 2 }}>
            Rooms:
          </Typography>
          <Grid container spacing={2}>
            {roomdata.map((room, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    padding: 2,
                    backgroundColor: room.occupied ? "#ffcccb" : "#d4edda",
                    transition: "background-color 0.3s ease",
                  }}
                >
                  <CardContent>
                  <Typography variant="h6">{room.room_name}</Typography>
<Typography variant="body2">
  {room.room_type} | Capacity: {room.room_capacity}
</Typography>
<Typography color={room.occupied ? "error" : "success"}>
  {room.occupied ? "Occupied" : "Empty"}
</Typography>
                    <Button variant="contained" color="info" onClick={() => modifyRoom(room)}>
                      Modify
                    </Button>
                    <Button variant="contained" color="error" onClick={() => deleteRoom(room)}>
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default FloorPage;
