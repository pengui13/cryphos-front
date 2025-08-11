"use client";

import React from "react";

export default function ProgressSteps({ currentStep, totalSteps = 3 }) {
  // Step titles
  const labels = [
    "Name Your Bot",
    "Select Requirements",
    "Configure Bot",
    "Configure Balance",
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-6">
      {/* Current Step Title */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-white mb-2">
          {labels[currentStep - 1]}
        </h2>
        <p className="text-sm text-gray-400">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between relative">
        {/* Connection Line */}
        <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-700"></div>
        <div
          className="absolute top-4 left-0 h-0.5 bg-blue-500 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>

        {/* Step Items */}
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isPending = stepNumber > currentStep;

          return (
            <div
              key={stepNumber}
              className="flex flex-col items-center relative z-10"
            >
              {/* Step Circle */}
              <div
                className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                transition-all duration-300
                ${
                  isCompleted
                    ? "bg-blue-500 text-white"
                    : isCurrent
                    ? "bg-blue-500 text-white ring-4 ring-blue-500/30"
                    : "bg-gray-700 text-gray-400 border-2 border-gray-600"
                }
              `}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>

              {/* Step Label */}
              <div className="mt-3 text-center">
                <p
                  className={`text-xs font-medium leading-tight max-w-20
                  ${isCompleted || isCurrent ? "text-white" : "text-gray-500"}
                `}
                >
                  {labels[index]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
