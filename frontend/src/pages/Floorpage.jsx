import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Snackbar,
  Alert,
  Fade,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Avatar,
  Grow,
  Zoom,
  Slide,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  MeetingRoom as MeetingRoomIcon,
} from "@mui/icons-material";
import { Skeleton } from "@mui/lab";
import "./FloorPage.css";

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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteRoomDialogOpen, setDeleteRoomDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlockData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/block/get-data/${block._id}`);
        setBlock(response.data);
        localStorage.setItem("block", JSON.stringify(response.data));
        setLoading(false);
      } catch (error) {
        setErr("Failed to fetch updated block data");
        console.error(error);
        setLoading(false);
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
      setSnackbarMessage("Floor added successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      setErr(error.message);
      console.error(error);
    }
  };

  const handleDeleteFloor = async () => {
    try {
      await axios.delete(`http://localhost:5000/block/${block._id}/floor/${floorid._id}`);
      const updatedData = await axios.get(`http://localhost:5000/block/get-data/${block._id}`);

      if (!updatedData.data) {
        alert("Failed to delete the floor");
        return;
      }

      localStorage.setItem("block", JSON.stringify(updatedData.data));
      setBlock(updatedData.data);
      setSnackbarMessage("Floor deleted successfully!");
      setSnackbarOpen(true);
      setDeleteDialogOpen(false);
    } catch (error) {
      alert("Something went wrong...");
      console.error(error);
    }
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

  const handleDeleteRoom = async () => {
    if (!roomToDelete || !floorid || !block) {
      alert("Missing data to delete the room.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/block/${block._id}/floor/${floorid._id}/room/${roomToDelete._id}`);
      const updatedData = await axios.get(`http://localhost:5000/block/get-data/${block._id}`);

      if (!updatedData.data) {
        alert("Failed to delete the room.");
        return;
      }

      localStorage.setItem("block", JSON.stringify(updatedData.data));
      setBlock(updatedData.data);
      setRoomData(updatedData.data.floors.find((f) => f._id === floorid._id)?.rooms || []);
      setSnackbarMessage(`Room '${roomToDelete.room_name}' deleted successfully!`);
      setSnackbarOpen(true);
      setDeleteRoomDialogOpen(false);
    } catch (error) {
      alert("Something went wrong");
      console.error(error);
    }
  };

  const backtohome = () => {
    navigate(`/`);
  };

  return (
    <Container className="floor-form">
      <Slide direction="up" in={!loading} mountOnEnter unmountOnExit>
        <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px", background: "#fff" }}>
          <Typography variant="h4" gutterBottom>
            Floor Page for Block: {block?.block_name}
          </Typography>
          {err && <Alert severity="error">{err}</Alert>}
          <Button variant="contained" color="primary" onClick={backtohome} style={{ marginBottom: "20px", borderRadius: "20px" }}>
            Back
          </Button>

          <form onSubmit={handleAddFloor} style={{ marginBottom: "20px" }}>
            <TextField
              label="Floor Name"
              value={floorName}
              onChange={(e) => setFloorName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" startIcon={<AddIcon />} style={{ borderRadius: "20px" }}>
              Add Floor
            </Button>
            {floorid && (
              <Button variant="contained" color="secondary" startIcon={<DeleteIcon />} onClick={() => setDeleteDialogOpen(true)} style={{ marginLeft: "10px", borderRadius: "20px" }}>
                Delete Floor
              </Button>
            )}
          </form>
        </Paper>
      </Slide>

      <Grid container spacing={3}>
        {loading ? (
          Array.from(new Array(3)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" width="100%" height={150} />
            </Grid>
          ))
        ) : (
          block?.floors?.map((floor, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Grow in timeout={500}>
                <Card className="floor-text" onClick={() => displayRoom(floor)} style={{ cursor: "pointer", background: "#fff", color: "#000" }}>
                  <CardContent>
                    <Typography variant="h5">{floor.floor_name}</Typography>
                    <Typography variant="body2">{floor.rooms.length} Rooms</Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))
        )}
      </Grid>

      {floorid && (
        <Zoom in style={{ transitionDelay: "500ms" }}>
          <Paper elevation={3} style={{ padding: "20px", marginTop: "20px", background: "#fff" }}>
            <Button variant="contained" color="primary" onClick={addRooms} style={{ marginBottom: "20px", borderRadius: "20px" }}>
              Add Room to {floorid.floor_name.toUpperCase()}
            </Button>
            <Typography variant="h5" gutterBottom>
              Rooms:
            </Typography>
            {roomdata.length > 0 ? (
              <Grid container spacing={3}>
                {roomdata.map((room, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Grow in timeout={500}>
                      <Card className={`room ${room.occupied ? "occupied-room" : ""}`} style={{ padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", background: room.occupied ? "#FFCCCC" : "#CCFFCC" }}>
                        <CardContent>
                          <Avatar style={{ backgroundColor: room.occupied ? "#FF9999" : "#99FF99", marginBottom: "10px" }}>
                            <MeetingRoomIcon />
                          </Avatar>
                          <Typography variant="h6" style={{ marginBottom: "10px", fontWeight: "bold" }}>{room.room_name}</Typography>
                          <Typography variant="body2" style={{ marginBottom: "5px", fontWeight: "bold" }}>Room ID: {room.room_id}</Typography>
                          <Typography variant="body2" style={{ marginBottom: "5px", fontWeight: "bold" }}>Type: {room.room_type}</Typography>
                          <Typography variant="body2" style={{ marginBottom: "5px", fontWeight: "bold" }}>Capacity: {room.room_capacity}</Typography>
                          <Typography variant="body2" style={{ fontWeight: "bold" }}>Status: {room.occupied ? "Occupied" : "Empty"}</Typography>
                        </CardContent>
                        <CardActions>
                          <Button variant="contained" color="primary" onClick={(e) => { e.stopPropagation(); modifyRoom(room); }} style={{ borderRadius: "20px", marginRight: "10px" }}>
                            Modify
                          </Button>
                          <Button variant="contained" color="secondary" onClick={(e) => { e.stopPropagation(); setRoomToDelete(room); setDeleteRoomDialogOpen(true); }} style={{ borderRadius: "20px" }}>
                            Delete
                          </Button>
                        </CardActions>
                      </Card>
                    </Grow>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1">No rooms available for this floor.</Typography>
            )}
          </Paper>
        </Zoom>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Floor</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this floor? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteFloor} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteRoomDialogOpen} onClose={() => setDeleteRoomDialogOpen(false)}>
        <DialogTitle>Delete Room</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the room: {roomToDelete?.room_name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteRoomDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteRoom} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FloorPage;
