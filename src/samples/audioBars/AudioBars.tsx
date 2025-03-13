import { useEffect, useRef } from "react";

interface AudioBarsProps {
  data: Float32Array | null;
  color: string;
  width?: number;
  height?: number;
  barWidth?: number;
  barSpacing?: number;
  demoMode?: boolean;
  center?: boolean;
}

const AudioBars = (props: AudioBarsProps) => {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWidth = props.width ?? 200;
  const canvasHeight = props.height ?? 100;
  const barWidth = props.barWidth ?? 4;
  const barSpacing = props.barSpacing ?? 4;
  const center = props.center ?? true;
  const color: string = props.color ?? "red";

  useEffect(() => {
    if (props.data) {
      WavRenderer.drawBars(props.data);
    }

    if ((props.demoMode ?? false))
      setInterval(() => {
        updateSampleData();
      }, 1000);
  });

  const dataMap = new WeakMap();

  const updateSampleData = () => {
    console.log("updateSampleData: " + 10);
        // const numberOfBars = numberOfBars ?? defaultNumberOfBars;
        const data = new Float32Array(10).map(() => Math.random());
        WavRenderer.drawBars(data);
      };

  const normalizeArray = (
    data: Float32Array,
    arrayLength: number,
    downsamplePeaks: boolean = false,
    memoize: boolean = false
  ) => {
    // console.log("normalizeArray", data);
    let cache, mKey, dKey;

    if (memoize) {
      mKey = arrayLength.toString();
      dKey = downsamplePeaks.toString();
      cache = dataMap.has(data) ? dataMap.get(data) : {};
      dataMap.set(data, cache);
      cache[mKey] = cache[mKey] || {};
      if (cache[mKey][dKey]) {
        return cache[mKey][dKey];
      }
    }

    const dataLength = data.length;
    const result = new Array(arrayLength);
    if (arrayLength <= dataLength) {
      result.fill(0);
      const count = new Array(arrayLength).fill(0);
      for (let i = 0; i < dataLength; i++) {
        const index = Math.floor(2*(i * arrayLength / dataLength));
        console.log("newIndex: " + index);
        if (downsamplePeaks) {
          result[index] = Math.max(result[index], Math.abs(data[i]));
        } else {
          result[index] += Math.abs(data[i]);
        }
        count[index]++;
      }
      if (!downsamplePeaks) {
        for (let i = 0; i < result.length; i++) {
          result[i] = result[i] / count[i];
        }
      }
    } else {
      for (let i = 0; i < arrayLength; i++) {
        const index = (i * (dataLength - 1)) / (arrayLength - 1);
        const low = Math.floor(index);
        const high = Math.ceil(index);
        const t = index - low;
        if (high >= dataLength) {
          result[i] = data[dataLength - 1];
        } else {
          result[i] = data[low] * (1 - t) + data[high] * t;
        }
      }
    }
    if (memoize) {
      if (mKey && dKey && cache) {
        cache[mKey][dKey] = result;
      }
    }
    return result;
  };

  const WavRenderer = {
    drawBars: (data: Float32Array) => {
      
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }
      const ctx = canvas.getContext("2d");
      if (ctx === null) {
        return;
      }
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      if (data.length === 0) {
        return;
      }

      const pointCount = Math.floor(
         (canvasWidth - barSpacing) / (Math.max(barWidth, 1) + barSpacing));
      
      // const pointCount = 20
      console.log("pointCount: " + pointCount);
    console.log("dataLength" + data.length);
      const points = normalizeArray(data, pointCount, true);
      const totalBarsWidth = pointCount * barWidth;
      const totalSpacingWidth = (pointCount - 1) * barSpacing;
      const totalWidth = totalBarsWidth + totalSpacingWidth;
      const startX = (canvasWidth - totalWidth) / 2;

      for (let i = 0; i < pointCount; i++) {
        const amplitude = 1-Math.abs(points[i]*0.0125);
        const height = Math.max(1, amplitude * canvas.height);
        const x = startX + i * (barWidth + barSpacing);
        const y = center
          ? (canvas.height - height) / 2
          : canvas.height - height;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, height, 20);
        ctx.fill();
      }
    },
  };

  return (
    <>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight}></canvas>
    </>
  );
};

export default AudioBars;
