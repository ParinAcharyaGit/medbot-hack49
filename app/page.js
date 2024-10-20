import { Button } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* AppBar */}
      <header className="flex justify-between items-center p-4 shadow-lg bg-gray-800 text-pink-600 cursor-pointer">
        <div className="logo text-2xl font-bold">MedBot</div>
        <nav className="flex space-x-4">
          <Link href="#home" passHref>
            <Button
              sx={{
                color: "#d81b60",
                fontWeight: "bold",
                "&:hover": { color: "white" },
              }}
            >
              Home
            </Button>
          </Link>
          <Link href="#features" passHref>
            <Button
              sx={{
                color: "#d81b60",
                fontWeight: "bold",
                "&:hover": { color: "white" },
              }}
            >
              Features
            </Button>
          </Link>
          <Link href="#register" passHref>
            <Button
              sx={{
                color: "#d81b60",
                fontWeight: "bold",
                "&:hover": { color: "white" },
              }}
            >
              Register as a Doctor
            </Button>
          </Link>
          <Link href="/login" passHref>
            <Button
              sx={{
                backgroundColor: "#d81b60",
                color: "white",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "white", color: "#d81b60" },
              }}
            >
              Login
            </Button>
          </Link>
          
        </nav>
      </header>

      {/* Home Section */}
      <section id="home" className="flex flex-col justify-center items-center h-screen bg-black text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to MedBot</h1>
        <p className="text-lg text-center mb-8 max-w-md">
          MedBot is an AI-powered platform where you can book doctor appointments, upload prescriptions for treatment plans, and chat with our AI chatbot to receive guidance for your health concerns.
        </p>
        <Link href="/signup" passHref>
          <Button
            sx={{
              backgroundColor: "#d81b60",
              color: "white",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "white", color: "#d81b60" },
            }}
          >
            Get Started
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section id="features" className="flex flex-col justify-center items-center h-screen bg-gray-800 text-white">
        <h2 className="text-3xl font-bold mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className="bg-black p-6 rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105">
            <h3 className="text-xl font-semibold mb-2 text-pink-600">Book Appointments with ease</h3>
            <p className="text-lg">
              Quickly and easily book appointments with your preferred doctors for all your health needs.
            </p>
          </div>
          <div className="bg-black p-6 rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105">
            <h3 className="text-xl font-semibold mb-2 text-pink-600">Get AI-powered treatment plans</h3>
            <p className="text-lg">
              Upload your prescriptions to receive personalized treatment plans curated by AI and standarised by the WHO.
            </p>
          </div>
          <div className="bg-black p-6 rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105">
            <h3 className="text-xl font-semibold mb-2 text-pink-600">Chat with MedBot</h3>
            <p className="text-lg">
              Describe your symptoms to our AI-powered chatbot and get guided treatment advice. Your privacy is upheld in all conversations.
            </p>
          </div>
        </div>
      </section>

      {/* Doctor Registration Section */}
      <section id="register" className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-4">Register as a Doctor</h2>
        <p className="text-lg text-center mb-8 max-w-md">
          Join our platform as a healthcare professional and help provide care to patients through MedBot.
        </p>
        <Link href="/doctor/register" passHref>
          <Button
            sx={{
              backgroundColor: "#d81b60",
              color: "white",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "white", color: "#d81b60" },
            }}
          >
            Register
          </Button>
        </Link>
      </section>
    </div>
  );
}
