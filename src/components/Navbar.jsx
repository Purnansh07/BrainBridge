import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Tooltip, Divider, ListItemIcon } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useUser, SignInButton, SignOutButton } from "@clerk/clerk-react";

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" className="bg-white shadow-md">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="logo" className="rounded-full w-10 mr-2" />
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontWeight: 700,
                color: "#333",
                textDecoration: "none",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              NEUROASSIST
            </Typography>
          </Link>

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
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
                flexDirection: "column",
              }}
              className="nav-menu"
            >
              <MenuItem key={"Home"} onClick={handleCloseNavMenu}>
                <Link to="/" className="w-full">
                  <Typography textAlign="center" className="navbar-menu-text">
                    Home
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem key={"About"} onClick={handleCloseNavMenu}>
                <Link to="/about" className="w-full">
                  <Typography textAlign="center" className="navbar-menu-text">
                    About
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem key={"Services"} onClick={handleCloseNavMenu}>
                <Link to="/services" className="w-full">
                  <Typography textAlign="center" className="navbar-menu-text">
                    Services
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem key={"Contact"} onClick={handleCloseNavMenu}>
                <Link to="/contact" className="w-full">
                  <Typography textAlign="center" className="navbar-menu-text">
                    Contact
                  </Typography>
                </Link>
              </MenuItem>
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "center" }}>
            <Button
              component={Link}
              to="/"
              onClick={handleCloseNavMenu}
              sx={{
                my: 2,
                color: "#333",
                display: "block",
                margin: "0 20px",
                fontWeight: 600,
                textTransform: "capitalize",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
                fontSize: "14pt",
                fontFamily: "Poppins, sans-serif",
              }}
              className="navbar-menu-text"
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/about"
              onClick={handleCloseNavMenu}
              sx={{
                my: 2,
                color: "#333",
                display: "block",
                margin: "0 20px",
                fontWeight: 600,
                textTransform: "capitalize",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
                fontSize: "14pt",
                fontFamily: "Poppins, sans-serif",
              }}
              className="navbar-menu-text"
            >
              About
            </Button>
            <Button
              component={Link}
              to="/services"
              onClick={handleCloseNavMenu}
              sx={{
                my: 2,
                color: "#333",
                display: "block",
                margin: "0 20px",
                fontWeight: 600,
                textTransform: "capitalize",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
                fontSize: "14pt",
                fontFamily: "Poppins, sans-serif",
              }}
              className="navbar-menu-text"
            >
              Services
            </Button>
            <Button
              component={Link}
              to="/contact"
              onClick={handleCloseNavMenu}
              sx={{
                my: 2,
                color: "#333",
                display: "block",
                margin: "0 20px",
                fontWeight: 600,
                textTransform: "capitalize",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
                fontSize: "14pt",
                fontFamily: "Poppins, sans-serif",
              }}
              className="navbar-menu-text"
            >
              Contact
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
            {isLoaded && (
              <>
                {isSignedIn ? (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mr: 1, 
                          color: '#333',
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 500,
                          display: { xs: 'none', sm: 'block' }
                        }}
                      >
                        {user?.firstName || user?.username || 'User'}
                      </Typography>
                      <Tooltip title="Account settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                          <Avatar 
                            alt={user?.fullName || "User"} 
                            src={user?.imageUrl || "https://ui-avatars.com/api/?name=User&background=random"} 
                            sx={{ 
                              width: 40, 
                              height: 40,
                              border: '2px solid #3b82f6'
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Menu
                      sx={{ 
                        mt: "45px",
                        '& .MuiPaper-root': {
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          minWidth: '200px'
                        }
                      }}
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
                      onClose={handleCloseUserMenu}
                    >
                      <Box sx={{ px: 2, py: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
                          {user?.fullName || user?.username || 'User'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                          {user?.primaryEmailAddress?.emailAddress || 'user@example.com'}
                        </Typography>
                      </Box>
                      <Divider />
                      <MenuItem onClick={handleCloseUserMenu}>
                        <ListItemIcon>
                          <PersonIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography textAlign="center" sx={{ fontFamily: 'Poppins, sans-serif' }}>Profile</Typography>
                      </MenuItem>
                      <MenuItem onClick={handleCloseUserMenu}>
                        <ListItemIcon>
                          <SettingsIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography textAlign="center" sx={{ fontFamily: 'Poppins, sans-serif' }}>Settings</Typography>
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleCloseUserMenu}>
                        <SignOutButton>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ListItemIcon>
                              <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            <Typography textAlign="center" sx={{ fontFamily: 'Poppins, sans-serif' }}>Logout</Typography>
                          </Box>
                        </SignOutButton>
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <SignInButton mode="modal">
                    <Button 
                      variant="contained" 
                      sx={{ 
                        backgroundColor: "#3b82f6", 
                        color: "white",
                        fontWeight: 600,
                        "&:hover": { backgroundColor: "#2563eb" },
                        fontFamily: "Poppins, sans-serif",
                        borderRadius: "8px",
                        textTransform: "none",
                        px: 3
                      }}
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                )}
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
