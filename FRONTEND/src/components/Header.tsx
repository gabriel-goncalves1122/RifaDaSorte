// src/components/Header.tsx
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useThemeMode } from "../theme/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./components.css"; // Importação do CSS

const Header = () => {
  const { isDark, toggleTheme } = useThemeMode();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static" className="app-header">
      <Toolbar className="header-toolbar">
        <Typography variant="h6" className="app-title">
          Meu App
        </Typography>
        <Box className="header-actions">
          <IconButton
            className="theme-toggle-button"
            onClick={toggleTheme}
            aria-label="Alternar tema"
          >
            {isDark ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <Button className="logout-button" onClick={handleLogout}>
            Sair
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
