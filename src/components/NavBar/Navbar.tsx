import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Container,
  Toolbar,
  Tooltip,
  Typography,
  Box,
  IconButton,
  Avatar,
  Button,
  Menu,
  MenuItem,
  Link,
} from "@mui/material";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import MenuIcon from "@mui/icons-material/Menu";

const pages = [
  { pageName: "Start", pageLink: "/" },
  { pageName: "Cele", pageLink: "/cash-goals" },
  { pageName: "Przepływy", pageLink: "/cash-flow" },
  { pageName: "Bilans", pageLink: "/financial-balance" },
  { pageName: "Struktura kosztów", pageLink: "/cost-structure" },
];
// const settings = ['Profile', 'Logout'];

const NavBar = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleLogout = async () => {
    setAnchorElUser(null);
    try {
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Błąd podczas wylogowywania", error);
    }
  };
  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <PaymentsOutlinedIcon
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              FINAN
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={() => setAnchorElNav(null)}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem
                    component={Link}
                    href={page.pageLink}
                    key={page.pageName}
                  >
                    <Typography textAlign="center">{page.pageName}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <PaymentsOutlinedIcon
              sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
            />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "primary",
                textDecoration: "none",
              }}
            >
              FINAN
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page.pageName}
                  href={page.pageLink}
                  onClick={() => setAnchorElNav(null)}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page.pageName}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={() => setAnchorElUser(null)}
              >
                <MenuItem key={"logout"} onClick={handleLogout}>
                  <Typography textAlign="center">Wyloguj</Typography>
                </MenuItem>
                {/* {settings.map((setting) => (
                <MenuItem key={setting}
                 onClick={handleCloseUserMenu}
                 >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem> */}
                {/* ))} */}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};
export default NavBar;
