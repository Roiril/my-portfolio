'use client';

import { useEffect } from 'react';
import { startFrontMotion } from './motion';

// 描画はしない。読み込み後にトップページへ動きを足し、離れるときに片付ける
export default function FrontMotion() {
  useEffect(() => startFrontMotion(), []);
  return null;
}
