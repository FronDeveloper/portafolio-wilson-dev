"use client";

export default function AnimatedCSSBackground() {
  return (
    <div className="animated-bg-css">
      <div className="circle circle-1" />
      <div className="circle circle-2" />
      <div className="circle circle-3" />
      <div className="circle circle-4" />
      <div className="circle circle-5" />
      <div className="circle circle-6" />
      <div className="circle circle-7" />
      <div className="circle circle-8" />
      
      <style jsx global>{`
        .animated-bg-css {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -10;
          overflow: hidden;
          background-color: #0B0B0B;
        }

        @keyframes float1 {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
            opacity: 0.15;
          }
          25% {
            transform: translate(50px, -30px) scale(1.05);
            opacity: 0.25;
          }
          50% {
            transform: translate(-30px, 50px) scale(0.95);
            opacity: 0.2;
          }
          75% {
            transform: translate(30px, -20px) scale(1.02);
            opacity: 0.22;
          }
        }

        @keyframes float2 {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
            opacity: 0.1;
          }
          33% {
            transform: translate(-40px, -40px) scale(1.08);
            opacity: 0.2;
          }
          66% {
            transform: translate(40px, 20px) scale(0.92);
            opacity: 0.15;
          }
        }

        @keyframes float3 {
          0%, 100% {
            transform: translate(0px, 0px) rotate(0deg);
            opacity: 0.12;
          }
          50% {
            transform: translate(60px, -40px) rotate(180deg);
            opacity: 0.22;
          }
        }

        .circle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(194, 178, 128, 0.4) 0%,
            rgba(194, 178, 128, 0.15) 40%,
            rgba(194, 178, 128, 0) 70%
          );
          filter: blur(2px);
        }

        /* Círculos grandes */
        .circle-1 {
          width: 500px;
          height: 500px;
          top: -150px;
          left: -150px;
          animation: float1 20s ease-in-out infinite;
        }

        .circle-2 {
          width: 400px;
          height: 400px;
          bottom: -150px;
          right: -150px;
          animation: float2 25s ease-in-out infinite;
          animation-delay: 1s;
        }

        .circle-3 {
          width: 350px;
          height: 350px;
          top: 40%;
          left: -100px;
          animation: float3 18s ease-in-out infinite;
          animation-delay: 2s;
        }

        .circle-4 {
          width: 300px;
          height: 300px;
          bottom: 20%;
          right: -80px;
          animation: float1 22s ease-in-out infinite;
          animation-delay: 3s;
        }

        /* Círculos medianos */
        .circle-5 {
          width: 200px;
          height: 200px;
          top: 15%;
          right: 10%;
          animation: float2 15s ease-in-out infinite;
          animation-delay: 0.5s;
          opacity: 0.2;
        }

        .circle-6 {
          width: 180px;
          height: 180px;
          bottom: 30%;
          left: 20%;
          animation: float3 17s ease-in-out infinite;
          animation-delay: 1.5s;
          opacity: 0.18;
        }

        /* Círculos pequeños */
        .circle-7 {
          width: 100px;
          height: 100px;
          top: 60%;
          right: 25%;
          animation: float1 12s ease-in-out infinite;
          animation-delay: 2.5s;
          opacity: 0.25;
        }

        .circle-8 {
          width: 80px;
          height: 80px;
          top: 80%;
          left: 15%;
          animation: float2 14s ease-in-out infinite;
          animation-delay: 1s;
          opacity: 0.22;
        }
      `}</style>
    </div>
  );
}