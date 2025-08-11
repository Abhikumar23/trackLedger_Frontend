import { Outlet } from "react-router-dom";
import Navbar from "./Navebar"; // You called it "Navebar", keep it as is

export default function Layout() {
  return (
    <div className="p-4 px-8 flex flex-col min-h-screen">
      <Navbar />
      <Outlet /> {/* Only this will render Home OR TransactionList based on route */}
    </div>
  );
}
