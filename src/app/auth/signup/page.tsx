"use client";

import { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Link as MuiLink,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Visibility, VisibilityOff, Person, Email, Lock } from "@mui/icons-material";
import { authClient } from "@/utils/auth/auth-client";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name.trim()) {
      setError("Full name is required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (result && result.data) {
        router.push("/");
      }
    } catch (err) {
      console.error("Sign-up error:", err);
      setError(err instanceof Error ? err.message : "Sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            background: "rgba(26, 26, 26, 0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid #333333",
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#fff",
                mb: 1,
                fontFamily: "Satoshi, sans-serif",
              }}
            >
              Create Account
            </Typography>
            <Typography variant="body2" sx={{ color: "#999" }}>
              Join PromptHub and start sharing your prompts
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                backgroundColor: "rgba(211, 47, 47, 0.1)",
                color: "#ef5350",
                "& .MuiAlert-icon": {
                  color: "#ef5350",
                },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* Full Name Field */}
            <TextField
              fullWidth
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Doe"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: "#FF5722", mr: 1 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  backgroundColor: "#2a2a2a",
                  "& fieldset": {
                    borderColor: "#3a3a3a",
                  },
                  "&:hover fieldset": {
                    borderColor: "#4a4a4a",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FF5722",
                  },
                },
                "& .MuiOutlinedInput-input::placeholder": {
                  color: "#666",
                  opacity: 1,
                },
              }}
            />

            {/* Email Field */}
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: "#FF5722", mr: 1 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  backgroundColor: "#2a2a2a",
                  "& fieldset": {
                    borderColor: "#3a3a3a",
                  },
                  "&:hover fieldset": {
                    borderColor: "#4a4a4a",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FF5722",
                  },
                },
                "& .MuiOutlinedInput-input::placeholder": {
                  color: "#666",
                  opacity: 1,
                },
              }}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="At least 8 characters"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#FF5722", mr: 1 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      sx={{ color: "#999" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  backgroundColor: "#2a2a2a",
                  "& fieldset": {
                    borderColor: "#3a3a3a",
                  },
                  "&:hover fieldset": {
                    borderColor: "#4a4a4a",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FF5722",
                  },
                },
              }}
            />

            {/* Confirm Password Field */}
            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#FF5722", mr: 1 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                      sx={{ color: "#999" }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  backgroundColor: "#2a2a2a",
                  "& fieldset": {
                    borderColor: "#3a3a3a",
                  },
                  "&:hover fieldset": {
                    borderColor: "#4a4a4a",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FF5722",
                  },
                },
              }}
            />

            {/* Sign Up Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                backgroundColor: "#FF5722",
                color: "#fff",
                fontWeight: 600,
                fontSize: "1rem",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#FF6B3D",
                },
                "&:disabled": {
                  backgroundColor: "#666",
                  color: "#ccc",
                },
                transition: "all 0.3s ease",
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: "#fff" }} />
                  Creating account...
                </Box>
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Sign In Link */}
            <Box sx={{ textAlign: "center", mt: 1 }}>
              <Typography variant="body2" sx={{ color: "#999" }}>
                Already have an account?{" "}
                <Link href="/auth/signin">
                  <MuiLink
                    component="span"
                    sx={{
                      color: "#FF5722",
                      fontWeight: 600,
                      textDecoration: "none",
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline",
                        color: "#FF6B3D",
                      },
                    }}
                  >
                    Sign in
                  </MuiLink>
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
