import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#131921" },
    secondary: { main: "#FF9900" },
    background: { default: "#EAEDED", paper: "#FFFFFF" },
    text: { primary: "#0F1111", secondary: "#565959" },
  },
  typography: {
    fontFamily: '"Amazon Ember", "Helvetica Neue", Arial, sans-serif',
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "8px 16px",
        },
        containedSecondary: {
          color: "#0F1111",
          background: "linear-gradient(to bottom, #FFD814, #FF9900)",
          boxShadow: "0 2px 5px rgba(213,217,217,.5)",
          "&:hover": {
            background: "linear-gradient(to bottom, #F7CA00, #F08804)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(to bottom, #42a8e1, #007185)",
          "&:hover": { background: "linear-gradient(to bottom, #378ab4, #005f6b)" },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            "&.Mui-focused fieldset": { borderColor: "#FF9900", borderWidth: "2px" },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: "8px" },
      },
    },
  },
});

export default theme;
