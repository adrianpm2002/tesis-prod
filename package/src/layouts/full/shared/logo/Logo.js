import { Link } from "react-router-dom";
import { styled } from "@mui/material";
import darkLogo from "src/assets/images/logos/dark-logo.ico"; // Importa el nuevo logo

const LinkStyled = styled(Link)(() => ({
  height: "70px",
  width: "180px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  return (
    <LinkStyled
      to="/"
      height={70}
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <img src={darkLogo} alt="Dark Logo" style={{ height: "70px" }} />
    </LinkStyled>
  );
};

export default Logo;
