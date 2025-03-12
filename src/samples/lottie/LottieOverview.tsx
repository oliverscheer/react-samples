import LottieLoading from "./LottieLoading";
import LottieSmiley from "./LottieSmiley";
import LottieThinking from "./LottieThinking";

const LottieOverview = () => {
  return (
    <>
    <h1>Thinking</h1>
    <div style={{ width: "200px", height: "200px" }}>
      <LottieThinking />
    </div>
    <div>
      <LottieThinking />
    </div>
    
    <h1>Squares</h1>
    
    <div style={{ width: "200px", height: "200px" }}>
      <LottieLoading />
    </div>

    <div>
    <LottieLoading />
    </div>

    <h1>Smiley</h1>
    <div>
      <LottieSmiley />
    </div>

    <div style={{ width: "200px", height: "200px" }}>
      <LottieSmiley />
    </div>
    
    </>
  );
};

export default LottieOverview;
