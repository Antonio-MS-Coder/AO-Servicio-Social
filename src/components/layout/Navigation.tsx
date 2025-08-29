import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Work,
  People,
  Person,
  Login,
  Logout,
  Language,
  SportsSoccer,
  School
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Navigation: React.FC = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { currentUser, userData, logout } = useAuth();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageMenu = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchorEl(null);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    handleLanguageClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const menuItems = [
    { text: t('nav.home'), icon: <Home />, path: '/' },
    { text: t('nav.jobs'), icon: <Work />, path: '/jobs' },
    { text: t('nav.workers'), icon: <People />, path: '/workers' },
    { text: 'Certificaciones', icon: <School />, path: '/certifications' }
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, backgroundColor: theme.palette.primary.main, color: 'white', display: 'flex', alignItems: 'center' }}>
        <img 
          src={`${process.env.PUBLIC_URL}/doom-logo.png`}
          alt="DOOM Logo" 
          style={{ height: 40, marginRight: 8 }}
        />
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => { navigate(item.path); setMobileOpen(false); }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        {currentUser && (
          <>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton onClick={() => { navigate('/profile'); setMobileOpen(false); }}>
                <ListItemIcon><Person /></ListItemIcon>
                <ListItemText primary={t('nav.profile')} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon><Logout /></ListItemIcon>
                <ListItemText primary={t('nav.logout')} />
              </ListItemButton>
            </ListItem>
          </>
        )}
        {!currentUser && (
          <>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton onClick={() => { navigate('/login'); setMobileOpen(false); }}>
                <ListItemIcon><Login /></ListItemIcon>
                <ListItemText primary={t('nav.login')} />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={4} sx={{ 
        background: 'linear-gradient(135deg, #007A33 0%, #005522 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        borderBottom: '5px solid #f7991c',
        position: 'sticky',
        zIndex: 1100,
      }}>
        <Toolbar sx={{ py: 1 }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Box component={Link} to="/" sx={{ 
            flexGrow: isMobile ? 1 : 0, 
            mr: 6,
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}>
            <img 
              src={`${process.env.PUBLIC_URL}/doom-logo.png`}
              alt="DOOM" 
              style={{ 
                height: isMobile ? 35 : 45,
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
              }}
            />
          </Box>

          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex' }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              onClick={handleLanguageMenu}
              sx={{ ml: 1 }}
            >
              <Language />
            </IconButton>
            <Menu
              anchorEl={languageAnchorEl}
              open={Boolean(languageAnchorEl)}
              onClose={handleLanguageClose}
            >
              <MenuItem onClick={() => changeLanguage('es')}>Español</MenuItem>
              <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
            </Menu>

            {currentUser ? (
              <>
                <IconButton
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                    {userData?.email?.[0]?.toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                    {t('nav.profile')}
                  </MenuItem>
                  {userData?.role === 'employer' && (
                    <MenuItem onClick={() => { navigate('/post-job'); handleClose(); }}>
                      {t('job.postJob')}
                    </MenuItem>
                  )}
                  {userData?.role === 'admin' && (
                    <MenuItem onClick={() => { navigate('/admin'); handleClose(); }}>
                      Panel Admin
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => { navigate('/dashboard'); handleClose(); }}>
                    Dashboard
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    {t('nav.logout')}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              !isMobile && (
                <>
                  <Button
                    variant="text"
                    component={Link}
                    to="/login"
                    sx={{
                      color: 'white',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      px: 3,
                      py: 1.2,
                      mr: 2,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    {t('nav.login')}
                  </Button>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/register"
                    sx={{ 
                      bgcolor: '#f7991c',
                      color: 'white',
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      px: 4,
                      py: 1.2,
                      borderRadius: 2,
                      boxShadow: '0 4px 16px rgba(247,153,28,0.4)',
                      border: '2px solid transparent',
                      position: 'relative',
                      zIndex: 1,
                      '&:hover': {
                        bgcolor: '#ff8c00',
                        transform: 'translateY(-3px) scale(1.05)',
                        boxShadow: '0 6px 20px rgba(247,153,28,0.5)',
                        border: '2px solid rgba(255,255,255,0.3)',
                      },
                    }}
                  >
                    REGISTRARSE
                  </Button>
                </>
              )
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation;