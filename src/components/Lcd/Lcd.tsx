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

  const { lcd } = useEmulator();

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
      const data = new ImageData(lcd.data, lcd.width, lcd.height);
      ctx.putImageData(data, 0, 0);
    }
  }, [ctx, lcd])

  return (
    <LcdContainer className={className} $width={width} $height={height}>
      <LcdCanvas width={width} height={height} ref={canvasRef} id='lcd'></LcdCanvas>
    </LcdContainer>
  )
}

export default Lcd;