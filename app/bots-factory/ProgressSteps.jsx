"use client";

import React from "react";

export default function ProgressSteps({ currentStep, totalSteps = 4 }) {
  // percent of track to fill
  const percent =
    totalSteps > 1 ? ((currentStep - 1) / (totalSteps - 1)) * 100 : 0;

  // Step titles
  const labels = [
    "Name Your Bot",
    "Select Requirements",
    "Configure Bot",
    "Configure Balance",
  ];

  // Palette
  const bgPage = "#0A1620"; // card background
  const trackOff = "#122430"; // muted track
  const trackOn = "#1E3A5F"; // accent blue
  const textOff = "rgba(255,255,255,0.5)";
  const textOn = "#FFFFFF";

  return (
    <div className="flex flex-col items-center w-full px-4">
      {/* Title */}
      <h2 className="mb-4 text-lg font-medium" style={{ color: textOn }}>
        {labels[currentStep - 1]}
      </h2>

      {/* Track + Circles */}
      <div className="relative flex items-center w-full max-w-md">
        {/* Inactive track */}
        <div
          className="absolute inset-0 h-1 rounded-full"
          style={{ backgroundColor: trackOff }}
        />

        {/* Active track */}
        <div
          className="absolute h-1 rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%`, backgroundColor: trackOn }}
        />

        {/* Circles */}
        <div className="relative flex justify-between w-full">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const step = i + 1;
            const isDone = step < currentStep;
            const isActive = step === currentStep;

            const circleBg = isDone ? trackOn : bgPage;
            const borderCol = isDone ? trackOn : isActive ? trackOn : trackOff;
            const textCol = isDone ? textOn : isActive ? trackOn : textOff;
            const size = isActive ? 36 : 32;

            return (
              <div key={step} className="flex flex-col items-center">
                <div
                  style={{
                    width: size,
                    height: size,
                    borderRadius: "9999px",
                    backgroundColor: circleBg,
                    border: `2px solid ${borderCol}`,
                    color: textCol,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 500,
                    transition: "all 0.3s ease",
                  }}
                >
                  {step}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
