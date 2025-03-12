import { useEffect, useState } from "react";
import Lottie from "lottie-react";

const LottieThinking = () => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    import("./loading.json")
      .then((data: any) => {
        console.log(data.default);
            setAnimationData(data.default);
    })
      .catch(error => console.error("Lottie JSON-Fehler:", error));
  }, []);

  if (!animationData) return <p>Lädt...</p>;

  return (
    <>
        <Lottie animationData={animationData} loop={true} />
    </>
  );
};

export default LottieThinking;
