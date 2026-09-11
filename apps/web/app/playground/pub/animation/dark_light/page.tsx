<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smooth Paced Plasma Transition</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #020617;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #fff;
      overflow: hidden;
    }

    .viewport {
      position: relative;
      width: 640px;
      height: 440px;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.15);
      transform: translateZ(0);
    }

    .scene {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      will-change: mask-image, -webkit-mask-image;
      transform: translateZ(0);
    }

    .theme-card {
      width: 340px;
      padding: 26px;
      border-radius: 14px;
      user-select: none;
    }
    .theme-card h3 {
      margin: 0 0 8px 0;
      font-size: 20px;
      letter-spacing: -0.5px;
    }
    .theme-card p {
      margin: 0;
      font-size: 13px;
      line-height: 1.5;
      opacity: 0.85;
    }
    .theme-card input {
      width: 100%;
      margin-top: 14px;
      padding: 10px 14px;
      border-radius: 8px;
      outline: none;
      font-size: 14px;
    }
    .btn-toggle {
      display: block;
      width: 100%;
      text-align: center;
      padding: 12px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      margin-top: 14px;
      font-size: 14px;
      transition: transform 0.1s ease;
    }
    .btn-toggle:active {
      transform: scale(0.97);
    }

    /* 1. 라이트 테마 */
    .scene-light {
      background: #f8fafc;
      z-index: 1;
    }
    .scene-light .theme-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      color: #0f172a;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    }
    .scene-light input {
      background: #f1f5f9;
      color: #0f172a;
      border: 1px solid #cbd5e1;
    }
    .scene-light .btn-toggle {
      background: #4f46e5;
      color: #ffffff;
    }

    /* 2. 다크 테마 */
    .scene-dark {
      background: #090d16;
      z-index: 2;
    }
    .scene-dark .theme-card {
      background: #0f172a;
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: #f8fafc;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    .scene-dark input {
      background: #020617;
      color: #f8fafc;
      border: 1px solid #334155;
    }
    .scene-dark .btn-toggle {
      background: #0284c7;
      color: #ffffff;
    }

    #fxCanvas {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 10;
      transform: translateZ(0);
    }
  </style>
</head>
<body>

  <h3 style="margin-bottom: 12px; color: #facc15;">완만하고 부드러운 플라즈마 테마 전환</h3>

  <div class="viewport" id="stage">
    <!-- 라이트 씬 -->
    <div class="scene scene-light" id="sceneLight">
      <div class="theme-card">
        <h3>플라즈마 타이포</h3>
        <p>1/3 완만해진 속도로 지글거리는 광원의 디테일이 살아납니다.</p>
        <input type="text" id="inputLight" placeholder="전환 중 실시간 타이핑" />
        <div class="btn-toggle" id="btnToDark">Dark 플라즈마 방출</div>
      </div>
    </div>

    <!-- 다크 씬 -->
    <div class="scene scene-dark" id="sceneDark">
      <div class="theme-card">
        <h3>플라즈마 타이포</h3>
        <p>1/3 완만해진 속도로 지글거리는 광원의 디테일이 살아납니다.</p>
        <input type="text" id="inputDark" placeholder="전환 중 실시간 타이핑" />
        <div class="btn-toggle" id="btnToLight">Light 플라즈마 방출</div>
      </div>
    </div>

    <canvas id="fxCanvas" width="640" height="440"></canvas>
  </div>

  <script>
    const stage = document.getElementById('stage');
    const sceneDark = document.getElementById('sceneDark');
    const sceneLight = document.getElementById('sceneLight');
    const inputLight = document.getElementById('inputLight');
    const inputDark = document.getElementById('inputDark');
    const btnToDark = document.getElementById('btnToDark');
    const btnToLight = document.getElementById('btnToLight');
    const fxCanvas = document.getElementById('fxCanvas');
    const fxCtx = fxCanvas.getContext('2d');

    inputLight.addEventListener('input', () => { inputDark.value = inputLight.value; });
    inputDark.addEventListener('input', () => { inputLight.value = inputDark.value; });

    let clickX = 320;
    let clickY = 220;
    let maxRadius = 0;
    let waveRadius = 0;
    let animFrameId = null;
    let time = 0;

    function getNoisyRadius(angle, baseRadius, timeOffset) {
      if (baseRadius <= 0) return 0;
      return baseRadius + 
        Math.sin(angle * 4 + timeOffset * 0.16) * 15 + 
        Math.cos(angle * 8 - timeOffset * 0.24) * 8;
    }

    function buildNoisyPath(ctx, cx, cy, baseRadius, timeOffset) {
      ctx.beginPath();
      const step = 0.1;
      for (let a = 0; a <= Math.PI * 2 + step; a += step) {
        const r = getNoisyRadius(a, baseRadius, timeOffset);
        const px = cx + Math.cos(a) * r;
        const py = cy + Math.sin(a) * r;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    }

    function startTransition(e, targetDark) {
      if (animFrameId) cancelAnimationFrame(animFrameId);

      const rect = stage.getBoundingClientRect();
      clickX = e.clientX - rect.left;
      clickY = e.clientY - rect.top;

      const corners = [
        { x: 0, y: 0 }, { x: rect.width, y: 0 },
        { x: 0, y: rect.height }, { x: rect.width, y: rect.height }
      ];
      maxRadius = Math.max(...corners.map(c => Math.hypot(c.x - clickX, c.y - clickY))) + 120;

      const targetLayer = targetDark ? sceneDark : sceneLight;
      const baseLayer = targetDark ? sceneLight : sceneDark;

      baseLayer.style.webkitMaskImage = 'none';
      baseLayer.style.maskImage = 'none';
      baseLayer.style.zIndex = '1';

      targetLayer.style.zIndex = '2';

      waveRadius = 0;
      time = 0;
      animFrameId = requestAnimationFrame(() => updateTransition(targetDark));
    }

    btnToDark.addEventListener('click', (e) => startTransition(e, true));
    btnToLight.addEventListener('click', (e) => startTransition(e, false));

    function updateTransition(targetDark) {
      // 속도 감속에 맞춰 노이즈 변화 속도도 완만하게 조정
      time += 0.8;
      
      // [1/3 완만해진 속도 공식]
      const speed = (maxRadius - waveRadius) * 0.025 + 2.5;
      waveRadius += speed;

      const targetLayer = targetDark ? sceneDark : sceneLight;

      // 1. [CSS 마스크 생성]
      const r = waveRadius;
      const coreR = Math.max(0, r - 65);
      const featherR = r + 48;

      const maskCSS = `radial-gradient(circle at ${clickX}px ${clickY}px, 
        #000 0px, 
        #000 ${coreR.toFixed(1)}px, 
        rgba(0,0,0,0.85) ${(coreR + (r - coreR) * 0.6).toFixed(1)}px, 
        rgba(0,0,0,0.35) ${r.toFixed(1)}px, 
        transparent ${featherR.toFixed(1)}px
      )`;

      targetLayer.style.webkitMaskImage = maskCSS;
      targetLayer.style.maskImage = maskCSS;

      // 2. [FX 광원 & 모션 스트릭]
      fxCtx.clearRect(0, 0, 640, 440);

      if (waveRadius < maxRadius) {
        fxCtx.save();

        // (A) 내부 방사형 모션 스트릭
        if (waveRadius > 35) {
          const numRays = 20;
          for (let i = 0; i < numRays; i++) {
            const angle = (i / numRays) * Math.PI * 2 + (time * 0.03);
            const outerR = getNoisyRadius(angle, waveRadius - 6, time);
            const innerR = Math.max(0, outerR - 38);

            const x1 = clickX + Math.cos(angle) * innerR;
            const y1 = clickY + Math.sin(angle) * innerR;
            const x2 = clickX + Math.cos(angle) * outerR;
            const y2 = clickY + Math.sin(angle) * outerR;

            fxCtx.beginPath();
            fxCtx.moveTo(x1, y1);
            fxCtx.lineTo(x2, y2);
            fxCtx.strokeStyle = 'rgba(254, 240, 138, 0.16)';
            fxCtx.lineWidth = 3;
            fxCtx.stroke();
          }
        }

        // (B) 플라즈마 에너지 림
        fxCtx.filter = 'blur(14px)';
        buildNoisyPath(fxCtx, clickX, clickY, waveRadius, time);
        fxCtx.fillStyle = targetDark ? 'rgba(245, 158, 11, 0.55)' : 'rgba(253, 224, 71, 0.65)';
        fxCtx.fill();

        // (C) 백색 코어 광원
        const whiteR = Math.max(0, waveRadius - 18);
        if (whiteR > 0) {
          fxCtx.filter = 'blur(6px)';
          buildNoisyPath(fxCtx, clickX, clickY, whiteR, time);
          fxCtx.fillStyle = 'rgba(255, 255, 255, 0.82)';
          fxCtx.fill();
        }

        // (D) 내부 소프트 컷아웃
        const clearR = Math.max(0, waveRadius - 60);
        if (clearR > 0) {
          fxCtx.filter = 'blur(16px)';
          fxCtx.globalCompositeOperation = 'destination-out';
          buildNoisyPath(fxCtx, clickX, clickY, clearR, time);
          fxCtx.fillStyle = '#000';
          fxCtx.fill();
        }

        fxCtx.restore();
      }

      // 3. 완료 처리
      if (waveRadius >= maxRadius) {
        targetLayer.style.webkitMaskImage = 'none';
        targetLayer.style.maskImage = 'none';
        fxCtx.clearRect(0, 0, 640, 440);
        animFrameId = null;
      } else {
        animFrameId = requestAnimationFrame(() => updateTransition(targetDark));
      }
    }
  </script>
</body>
</html>