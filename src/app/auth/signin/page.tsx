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
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { authClient } from "@/utils/auth/auth-client";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result && result.data) {
        router.push("/");
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ color: "#999" }}>
              Sign in to access your account and manage your prompts
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
              placeholder="Enter your password"
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

            {/* Forgot Password Link */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Link href="/forgot-password">
                <MuiLink
                  component="span"
                  sx={{
                    color: "#FF5722",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                      color: "#FF6B3D",
                    },
                  }}
                >
                  Forgot password?
                </MuiLink>
              </Link>
            </Box>

            {/* Sign In Button */}
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
                  Signing in...
                </Box>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Sign Up Link */}
            <Box sx={{ textAlign: "center", mt: 1 }}>
              <Typography variant="body2" sx={{ color: "#999" }}>
                Don't have an account?{" "}
                <Link href="/auth/signup">
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
                    Sign up
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