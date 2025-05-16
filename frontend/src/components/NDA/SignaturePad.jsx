import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import SignaturePad from 'signature_pad';
import { Button } from 'antd';

const SignaturePadComponent = forwardRef(({ onEnd }, ref) => {
  const canvasRef = useRef(null);
  const padRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getSignature: () => {
      if (padRef.current && !padRef.current.isEmpty()) {
        // 生成透明背景的PNG
        return padRef.current.toDataURL('image/png');
      }
      return null;
    },
    clear: () => {
      padRef.current && padRef.current.clear();
    }
  }));

  useEffect(() => {
    if (canvasRef.current) {
      padRef.current = new SignaturePad(canvasRef.current, {
        // 不设置backgroundColor，保持透明
        penColor: 'black',
        onEnd: onEnd,
      });
      // 兼容PC和移动端所有签名结束场景
      canvasRef.current.addEventListener('mouseup', onEnd);
      canvasRef.current.addEventListener('mouseleave', onEnd);
      canvasRef.current.addEventListener('touchend', onEnd);
      canvasRef.current.addEventListener('touchcancel', onEnd);
    }
    return () => {
      if (padRef.current) padRef.current.off();
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mouseup', onEnd);
        canvasRef.current.removeEventListener('mouseleave', onEnd);
        canvasRef.current.removeEventListener('touchend', onEnd);
        canvasRef.current.removeEventListener('touchcancel', onEnd);
      }
    };
  }, [onEnd]);

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} width={400} height={120} style={{ border: '1px solid #ccc', background: 'transparent' }} />
      <div style={{ marginTop: 8 }}>
        <Button onClick={() => padRef.current && padRef.current.clear()}>Clear Signature</Button>
      </div>
    </div>
  );
});

export default SignaturePadComponent;
