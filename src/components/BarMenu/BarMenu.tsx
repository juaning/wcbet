import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
import { navigate } from 'gatsby';

export interface IResponsiveAppBarProps {
  user?: object;
  login?: any;
  logout?: any;
}

function ResponsiveAppBar({ user, logout, login }: IResponsiveAppBarProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const execLogin = () => {
    login({ authorizationParams: { redirect_uri: '/account' } });
  }

  const execLogout = () => {
    logout({ returnTo: window.location.origin });
    handleClose();
  }

  const navigateToAccount = () => {
    navigate('/account');
  }

  return (
    <AppBar position="static" sx={{ marginBottom: '20px'}}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <EmojiEvents sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PYKARE
        </Typography>
        {user ? (
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar alt={user?.nickname} src={user?.picture} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={navigateToAccount}>Mi cuenta</MenuItem>
              <MenuItem onClick={execLogout}>Salir</MenuItem>
            </Menu>
          </div>
        ) : (
          <Button color="inherit" onClick={execLogin}>Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
export default ResponsiveAppBar;