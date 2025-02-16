import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { motion } from "framer-motion";

const Homepage = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/block/get-data");
        setBlocks(data);
      } catch (error) {
        setErr(error.message);
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, []);

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:5000/block/delete-data/${selectedBlock._id}`);
      setBlocks(blocks.filter((block) => block._id !== selectedBlock._id));
      setOpenDialog(false);
    } catch (error) {
      setErr("Failed to delete block");
      setOpenSnackbar(true);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, textAlign: "center" }}>
      <Button variant="contained" color="primary" onClick={() => navigate("/add-block")} sx={{ mb: 3, borderRadius: "20px" }}>
        Add Block
      </Button>

      <Typography variant="h4" gutterBottom>
        Home Page
      </Typography>

      {!blocks.length ? (
        <Typography variant="h5" color="textSecondary">
          No data found...
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {blocks.map((block, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card sx={{ maxWidth: 345, boxShadow: 4, borderRadius: "15px" }}>
                  <CardContent
                    onClick={() => navigate(`/get-data/${block.block_name}`, { state: { block } })}
                    sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f0f0f0" } }}
                  >
                    <Skeleton variant="rectangular" height={140} animation="wave" />
                    <Typography variant="h5" mt={2} gutterBottom>
                      {block.block_name.toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      No of Floors: {block.floors.length}
                    </Typography>
                  </CardContent>

                  <CardActions>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => {
                        setSelectedBlock(block);
                        setOpenDialog(true);
                      }}
                      sx={{ borderRadius: "20px" }}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <strong>{selectedBlock?.block_name}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={`Error: ${err}`}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </Box>
  );
};

export default Homepage;
