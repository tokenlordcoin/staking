import "./styles/tailwind.css";
import "./styles/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StakingPage from "./pages/StakingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StakingPage />} />
        <Route path="/staking" element={<StakingPage />} />
        <Route path="/referral/:wallet" element={<StakingPage />} />
        <Route path="*" element={<StakingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
