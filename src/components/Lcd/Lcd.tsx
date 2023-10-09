import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useEmulator } from '../../hooks/useEmulator';

const LcdContainer = styled.div<{ $width: number, $height: number }>`
  width: ${(props) => props.$width}px;
  height: ${(props) => props.$height}px;
`

const LcdCanvas = styled.canvas`
  border: 1px solid black;
`

const Lcd = ({
  className,
}: {
  className?: string;
}) => {
  const [width, setWidth] = useState(144 * 4);
  const [height, setHeight] = useState(160 * 4);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { lcd, fps } = useEmulator();

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContext = canvas?.getContext('2d')
    if (!canvasContext) return;
    setCtx(canvasContext);
    setWidth(lcd.width)
    setHeight(lcd.height)
  }, [lcd.width, lcd.height]);

  useEffect(() => {
    if (!ctx) return;
    if (lcd.data && lcd.width && lcd.height) {
      const writeText = (text: string, x: number, y: number) => {
        const width = ctx.measureText(text).width;
        const height = 16;

        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.fillRect(x, y, width + 8, height + 8);
        ctx.fillStyle = 'black';
        ctx.fillText(`FPS: ${fps.toFixed(0)}`, x + 4, y + height + 4)
      }

      const data = new ImageData(lcd.data, lcd.width, lcd.height);
      ctx.putImageData(data, 0, 0);
      writeText(`FPS: ${fps.toFixed(0)}`, 0, 0);
      // ctx.fillStyle = 'red';
      // ctx.fillRect(0, 0, 160, 144)
    }
  }, [ctx, lcd, fps])

  return (
    <LcdContainer className={className} $width={width} $height={height}>
      <LcdCanvas width={width} height={height} ref={canvasRef} id='lcd'></LcdCanvas>
    </LcdContainer>
  )
}

export default Lcd;