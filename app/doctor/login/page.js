"use client";

import { useState } from "react";
import { Button, TextField, Typography, AppBar, Toolbar } from "@mui/material";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import  { useRouter } from "next/navigation";


export default function DoctorLogin() {
    const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("Login successful!");
    } catch (error) {
      console.error("Error logging in:", error);
      alert(error.message);
    }

    await signInWithEmailAndPassword(auth, formData.email, formData.password);
    router.push('/doctor/dashboard');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* AppBar */}
      <AppBar position="static" sx={{ backgroundColor: "black", color: "#d81b60" }}>
        <Toolbar className="flex justify-between">
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} className="cursor-pointer">
            MedBot
          </Typography>
          <Link href="/doctor/register" passHref>
            <Button sx={{ color: "white", backgroundColor: "#d81b60" }}>Register</Button>
          </Link>
        </Toolbar>
      </AppBar>

      {/* Login Form */}
      <div className="flex justify-center items-center flex-grow">
        <form
          className="bg-white shadow-lg p-8 rounded-lg space-y-4 w-full max-w-md"
          onSubmit={handleSubmit}
        >
          <Typography variant="h4" className="mb-4 text-pink-600 font-bold" align="center">
            Doctor Login
          </Typography>

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ backgroundColor: "#d81b60", color: "white", mt: 2 }}
          >
            Login
          </Button>

          <Typography className="mt-4 text-center">
            Don&apos;t have an account yet?{" "}
            <Link href="/doctor/register" passHref>
              <span style={{ color: "#d81b60", fontWeight: "bold", cursor: "pointer" }}>
                Register
              </span>
            </Link>
          </Typography>
        </form>
      </div>
    </div>
  );
}
