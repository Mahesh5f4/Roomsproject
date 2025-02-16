import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Snackbar,
} from "@mui/material";

const BlockForm = () => {
  const [blockName, setBlockName] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/block/add-data", {
        block_name: blockName,
      });
      navigate("/");
    } catch (err) {
      setErr(err.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          sx={{
            width: 400,
            padding: 3,
            boxShadow: 5,
            borderRadius: 3,
            backdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#fff",
          }}
        >
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              🏢 Add a New Block
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Block Name"
                variant="outlined"
                value={blockName}
                onChange={(e) => setBlockName(e.target.value)}
                required
                sx={{
                  marginBottom: 2,
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.6)" },
                    "&:hover fieldset": { borderColor: "#fff" },
                  },
                  "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.8)" },
                }}
              />

              <motion.div whileHover={{ scale: 1.05 }}>
                <Button type="submit" variant="contained" fullWidth>
                  Add Block
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Error Snackbar */}
      <Snackbar
        open={!!err}
        autoHideDuration={3000}
        onClose={() => setErr("")}
        message={`Error: ${err}`}
        sx={{ background: "red" }}
      />
    </Box>
  );
};

export default BlockForm;
