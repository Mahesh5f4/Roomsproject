import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Snackbar,
  Alert,
  Grow,
} from "@mui/material";

const Roomform = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Form state
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState("");
  const [roomCapacity, setRoomCapacity] = useState("");
  const [roomOccupied, setRoomOccupied] = useState(false);

  // Passed state
  const [floor] = useState(state.floor);
  const [Block] = useState(state.Block);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Set default roomId based on floor name
  useEffect(() => {
    setRoomId(floor.floor_name);
  }, [floor.floor_name]);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5000/block/floors/room/${Block._id}/${floor._id}`,
        {
          room_id: roomId,
          room_name: roomName,
          room_type: roomType,
          room_capacity: Number(roomCapacity),
          occupied: roomOccupied,
        }
      );

      setSnackbarMessage("✅ Room successfully added!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Reset form fields
      setRoomName("");
      setRoomType("");
      setRoomCapacity("");
      setRoomOccupied(false);

      setTimeout(() => {
        navigate(`/get-data/${Block.block_name}`, { state: { block: Block } });
      }, 2000);
    } catch (error) {
      setSnackbarMessage("❌ Failed to add room. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error(error);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Grow in timeout={1000}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: roomOccupied ? "#ffebee" : "#e8f5e9",
            transition: "background-color 0.4s ease",
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            🏠 Add Room to Floor
          </Typography>
          <Box component="form" onSubmit={handleAddRoom} noValidate>
            <TextField
              label="Room ID"
              variant="outlined"
              fullWidth
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              label="Room Name"
              variant="outlined"
              fullWidth
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              label="Year-branch section"
              variant="outlined"
              fullWidth
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              label="Room Capacity"
              variant="outlined"
              fullWidth
              type="number"
              value={roomCapacity}
              onChange={(e) => setRoomCapacity(e.target.value)}
              margin="normal"
              required
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={roomOccupied}
                  onChange={() => setRoomOccupied((prev) => !prev)}
                  color="primary"
                />
              }
              label="Occupied"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              🚀 Add Room
            </Button>
          </Box>
        </Paper>
      </Grow>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={Grow}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%", fontWeight: "bold", boxShadow: 4, borderRadius: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Roomform;
