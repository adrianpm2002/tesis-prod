import { Link } from "react-router-dom";
import { styled } from "@mui/material";
import darkLogo from "src/assets/images/logos/logo.png"; // Importa el nuevo logo

const LinkStyled = styled(Link)(() => ({
  height: "70px",
  width: "200px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  return (
    <LinkStyled
      to="/"
      height={90}
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <img src={darkLogo} alt="Dark Logo" style={{ height: "60px" }} />
    </LinkStyled>
  );
};

export default Logo;
