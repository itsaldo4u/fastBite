/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "gradient-shift": "gradient-shift 8s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out infinite 2s",
        "float-extra": "float 6s ease-in-out infinite 4s",
        shake: "shake 0.5s ease-in-out",
      },
      keyframes: {
        "gradient-shift": {
          "0%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
          "100%": { "background-position": "0% 50%" },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0) rotate(0deg)",
          },
          "50%": {
            transform: "translateY(-20px) rotate(5deg)",
          },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-2px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(2px)" },
        },
      },
      boxShadow: {
        "3xl": "0 25px 50px rgba(0, 0, 0, 0.2)",
      },
      spacing: {
        "1/10": "10%",
        "1/6": "16.666667%",
        "1/5": "20%",
        "3/5": "60%",
        "1/4": "25%",
      },
    },
  },
  plugins: [],
};
