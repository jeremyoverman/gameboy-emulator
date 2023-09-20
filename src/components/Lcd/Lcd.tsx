import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const LcdContainer = styled.div<{ $width: number, $height: number }>`
  width: ${(props) => props.$width}px;
  height: ${(props) => props.$height}px;
`

const LcdCanvas = styled.canvas`
  width: 100%;
  height: 100%;
`

const Lcd = ({
  className,
  scale = 1,
}: {
  className?: string;
  scale: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const width = 144 * scale;
  const height = 160 * scale;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // const pixels = new Uint8Array(width * height * 4);

    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }, []);

  return (
    <LcdContainer className={className} $width={width} $height={height}>
      <LcdCanvas ref={canvasRef} id='lcd'></LcdCanvas>
    </LcdContainer>
  )
}

export default Lcd;