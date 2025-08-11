import React from "react";

const LogoSpinner = ({
  size = 80,
  logoSrc = "logo.png",
  loadingText = "Loading...",
  className = "",
}) => {
  const spinnerStyles = {
    container: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        "linear-gradient(135deg, #1a0d2e 0%, #2d1b4e 50%, #1a0d2e 100%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    spinnerWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "24px",
    },
    spinner: {
      width: `${size}px`,
      height: `${size}px`,
      position: "relative",
      animation:
        "logoSpin 2s linear infinite, logoGlow 2s ease-in-out infinite",
    },
    logo: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.6))",
    },
    loadingText: {
      color: "#e2d5f3",
      fontSize: "18px",
      fontWeight: "300",
      letterSpacing: "2px",
      textAlign: "center",
      animation: "textPulse 1.5s ease-in-out infinite",
      textShadow: "0 0 10px rgba(226, 213, 243, 0.5)",
    },
    orb: {
      position: "absolute",
      width: `${size + 40}px`,
      height: `${size + 40}px`,
      border: "2px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "50%",
      top: "-20px",
      left: "-20px",
      animation: "orbRotate 4s linear infinite reverse",
    },
    orbInner: {
      position: "absolute",
      width: `${size + 20}px`,
      height: `${size + 20}px`,
      border: "1px solid rgba(147, 112, 219, 0.3)",
      borderRadius: "50%",
      top: "-10px",
      left: "-10px",
      animation: "orbRotate 3s linear infinite",
    },
  };

  return (
    <div style={spinnerStyles.container} className={className}>
      <style>{`
        @keyframes logoSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes logoGlow {
          0%, 100% { 
            filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.4));
          }
          50% { 
            filter: drop-shadow(0 0 35px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 50px rgba(147, 112, 219, 0.6));
          }
        }

        @keyframes textPulse {
          0%, 100% { 
            opacity: 0.7;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.02);
          }
        }

        @keyframes orbRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .logo-spinner-text {
            font-size: 16px !important;
            letter-spacing: 1px !important;
          }
        }
      `}</style>

      <div style={spinnerStyles.spinnerWrapper}>
        <div style={spinnerStyles.spinner}>
          <div style={spinnerStyles.orb}></div>
          <div style={spinnerStyles.orbInner}></div>
          <img
            src={logoSrc}
            alt="Loading"
            style={spinnerStyles.logo}
            onError={(e) => {
              // Fallback if logo.png doesn't load
              e.target.style.display = "none";
            }}
          />
        </div>
        <div style={spinnerStyles.loadingText} className="logo-spinner-text">
          {loadingText}
        </div>
      </div>
    </div>
  );
};

// Usage example component
const App = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {isLoading && (
        <LogoSpinner size={100} logoSrc="logo.png" loadingText="Loading..." />
      )}

      {!isLoading && (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            background: "#f5f5f5",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            <h1>Welcome! Loading Complete</h1>
            <button
              onClick={() => setIsLoading(true)}
              style={{
                padding: "12px 24px",
                background: "#6a4c93",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
                marginTop: "20px",
              }}
            >
              Show Loading Screen Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
