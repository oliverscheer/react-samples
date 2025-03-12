import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import LottieOverview from "./samples/lottie/LottieOverview";
import AudioOverview from "./samples/audioBars/AudioOverview";

function App() {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/audiobars" element={<AudioOverview />} />
      <Route path="/lottie" element={<LottieOverview />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  );
}

export default App;
