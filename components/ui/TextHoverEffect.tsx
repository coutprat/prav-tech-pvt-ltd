"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextHoverEffect = ({
  text,
  duration,
  className,
}: {
  text: string;
  duration?: number;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 450 150"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn("select-none uppercase cursor-pointer", className)}
    >
      <defs>
        {/* Cursor-reveal colour gradient */}
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%"   stopColor="#eab308" />
              <stop offset="25%"  stopColor="#ef4444" />
              <stop offset="50%"  stopColor="#80eeb4" />
              <stop offset="75%"  stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </>
          )}
        </linearGradient>

        {/* Sweeping border-light gradient */}
        <linearGradient id="bwm-light" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="450" y2="0">
          <stop offset="0%"    stopColor="transparent" />
          <stop offset="20%"   stopColor="#3ca2fa"  stopOpacity="0" />
          <stop offset="38%"   stopColor="#06b6d4"  stopOpacity="0.9" />
          <stop offset="50%"   stopColor="#e0f2ff"  stopOpacity="1" />
          <stop offset="62%"   stopColor="#8b5cf6"  stopOpacity="0.9" />
          <stop offset="80%"   stopColor="#3ca2fa"  stopOpacity="0" />
          <stop offset="100%"  stopColor="transparent" />
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            from="-900 0"
            to="900 0"
            dur="4s"
            repeatCount="indefinite"
          />
        </linearGradient>

        {/* Soft glow filter for the light layer */}
        <filter id="bwm-glow" x="-10%" y="-40%" width="120%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Radial spotlight for mouse reveal */}
        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%"   stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        <mask id="textMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
        </mask>
      </defs>

      {/* Base stroke — appears on hover */}
      <text
        x="50%" y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        fill="transparent"
        stroke={hovered ? "rgba(200,220,255,0.5)" : "transparent"}
        fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
        fontSize="60"
        fontWeight="700"
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text}
      </text>

      {/* Draw animation on load */}
      <motion.text
        x="50%" y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        fill="transparent"
        stroke="#3ca2fa"
        fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
        fontSize="60"
        fontWeight="700"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{ strokeDashoffset: 0, strokeDasharray: 1000 }}
        transition={{ duration: 4, ease: "easeInOut" }}
      >
        {text}
      </motion.text>

      {/* Sweeping border-light layer */}
      <text
        x="50%" y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#bwm-light)"
        strokeWidth="0.6"
        fill="transparent"
        fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
        fontSize="60"
        fontWeight="700"
        filter="url(#bwm-glow)"
      >
        {text}
      </text>

      {/* Cursor-reveal gradient overlay */}
      <text
        x="50%" y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.3"
        fill="transparent"
        fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
        fontSize="60"
        fontWeight="700"
        mask="url(#textMask)"
      >
        {text}
      </text>
    </svg>
  );
};

export const FooterBackgroundGradient = () => {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, #0F0F1166 50%, #3ca2fa33 100%)",
      }}
    />
  );
};
