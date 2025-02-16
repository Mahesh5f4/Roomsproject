import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Snackbar,
  Alert,
  Slide,
  Grow,
} from "@mui/material";

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

const ModifyRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState("");
  const [roomCapacity, setRoomCapacity] = useState(null);
  const [isOccupied, setIsOccupied] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const navigate = useNavigate();
  const { state } = useLocation();
  const [floor] = useState(state.floor);
  const [Block] = useState(state.Block);
  const [Room] = useState(state.Room);

  useEffect(() => {
    setRoomId(Room.room_id);
    setRoomName(Room.room_name);
    setRoomType(Room.room_type);
    setRoomCapacity(Room.room_capacity);
    setIsOccupied(Room.occupied);
  }, [Room]);

  const handleModifyRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/block/floors/room/${Block._id}/${floor._id}/${Room._id}`,
        {
          room_id: roomId,
          room_name: roomName,
          room_type: roomType,
          room_capacity: roomCapacity,
          occupied: isOccupied,
        }
      );
      showAlert("Room modified successfully.", "success");
      setTimeout(() => {
        navigate(`/get-data/${Block.block_name}`, { state: { block: Block } });
      }, 1500);
    } catch (error) {
      showAlert("Failed to modify room.", "error");
      console.error(error);
    }
  };

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setAlertOpen(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Grow in timeout={1000}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: isOccupied ? "#ffcccb" : "#d4edda",
            transition: "background-color 0.4s ease",
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Update Room
          </Typography>
          <form onSubmit={handleModifyRoom}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Room ID"
                  variant="outlined"
                  fullWidth
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Room Name"
                  variant="outlined"
                  fullWidth
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Year and section"
                  variant="outlined"
                  fullWidth
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Room Capacity"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={roomCapacity}
                  onChange={(e) => setRoomCapacity(Number(e.target.value))}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isOccupied}
                      onChange={() => setIsOccupied(!isOccupied)}
                      color="primary"
                    />
                  }
                  label="Occupied"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Modify Room
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grow>
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={alertSeverity}
          variant="filled"
          sx={{ width: "100%", fontWeight: "bold", boxShadow: 4, borderRadius: 2 }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ModifyRoom;
