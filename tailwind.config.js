module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xxs: "0px",
      xs: "300px",
      "2xs": "414px",
      sm: "479px",
      "2sm": "576px",
      md: "768px",
      mlg: "992px",
      lg: "1024px",
      "2lg": "1200px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        "black-33": "#333",
        "gray-ee": "#eee",
        "gray-99": "#999",
        "gray-cc": "#ccc",
        "hover-color": "#336699",
        "blue-33": "#336699",
        "red-a9": "#a94442",
        "gray-66": "#666666",
        "border-color": "#e5e5e5",
        "gray-99": "#999999",
        "gray-e4": "#E4E4E4",
        "gray-f5": "#f5f5f5",
        "gray-aa": "#AAAAAA",
      },
      backgroundImage: {},
      backgroundSize: {
        full: "100% 100%",
      },
      spacing: {
        "left-side-bar": "296px",
      },

      fontSize: {
        "menu-header": [
          "11px",
          {
            letterSpacing: "-0.022rem",
            lineHeight: 1.5,
          },
        ],
      },
    },
  },
  plugins: [],
};
