import React from "react";

const Footer = () => (
  <footer style={s.footer}>
    <div style={s.inner}>
      <span style={s.text}>© 2025 AI Phone Directory. Made with ❤️ by </span>
      <a href="https://cloudwebsimple.com" target="_blank" rel="noopener noreferrer" style={s.link}>
        cloudwebsimple.com
      </a>
    </div>
  </footer>
);

const s = {
  footer: { backgroundColor: "#232F3E", borderTop: "1px solid #3a4553", marginTop: "auto", padding: "20px 16px" },
  inner: { maxWidth: 1100, margin: "0 auto", textAlign: "center" },
  text: { fontSize: 13, color: "#999" },
  link: { fontSize: 13, color: "#FF9900", textDecoration: "none" },
};

export default Footer;
