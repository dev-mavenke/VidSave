import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toaster from "./components/Toaster";
import ToastProvider from "./components/ToastProvider";

export default function App() {
  return (
    <ToastProvider>
      <div className="relative isolate flex min-h-dvh flex-col">
        <Navbar />

        <div className="flex-1">
          <Outlet />
        </div>

        <Footer />
        <Toaster />
      </div>
    </ToastProvider>
  );
}
