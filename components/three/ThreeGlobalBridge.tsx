"use client";

import { useEffect } from "react";
import * as THREE from "three";

declare global {
  interface Window {
    THREE?: typeof THREE;
  }
}

export function ThreeGlobalBridge() {
  useEffect(() => {
    window.THREE = THREE;
  }, []);

  return null;
}
