import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BlockCraft from "@/pages/BlockCraft";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BlockCraft />} />
      </Routes>
    </Router>
  );
}
