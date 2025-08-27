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
  useTheme
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
  SportsSoccer
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
    { text: t('nav.workers'), icon: <People />, path: '/workers' }
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, backgroundColor: theme.palette.primary.main, color: 'white' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <SportsSoccer sx={{ mr: 1 }} />
          DOOM
        </Typography>
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
      <AppBar position="static">
        <Toolbar>
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
          
          <Typography variant="h6" component={Link} to="/" sx={{ 
            flexGrow: isMobile ? 1 : 0, 
            mr: 4,
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center'
          }}>
            <SportsSoccer sx={{ mr: 1 }} />
            DOOM
          </Typography>

          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex' }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
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
                    color="inherit"
                    component={Link}
                    to="/login"
                  >
                    {t('nav.login')}
                  </Button>
                  <Button
                    color="secondary"
                    variant="contained"
                    component={Link}
                    to="/register"
                    sx={{ ml: 1 }}
                  >
                    {t('nav.register')}
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