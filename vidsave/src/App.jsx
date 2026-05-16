import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-[#071016] text-white">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
