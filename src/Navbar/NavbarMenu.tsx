import { Box, Button, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';
import { grey } from '@mui/material/colors';
import NextLinkComposed from 'src/components/NextLinkComposed';
import { useRouter } from 'next/router';

const pages = [
  { name: 'DASHBOARD', route: '/' },
  { name: 'FORK ORACLE', route: '/fork-oracle' },
  { name: 'ATTESTATIONS LIST', route: '/attestations-list' },
];

const NavbarMenu = () => {
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          color="inherit"
          sx={{ ml: 'auto' }}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{
            display: { xs: 'block', md: 'none' },
          }}
        >
          {pages.map((page) => (
            <MenuItem
              key={page.name}
              onClick={handleCloseNavMenu}
              component={NextLinkComposed}
              to={{
                pathname: `${page.route}`,
              }}
            >
              <Typography textAlign="center">{page.name}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          display: {
            xs: 'none',
            md: 'flex',
            justifyContent: 'space-evenly',
            backgroundColor: '#f8f9fa',
          },
        }}
      >
        {pages.map((page) => (
          <Button
            key={page.name}
            onClick={handleCloseNavMenu}
            sx={{
              my: 2,
              display: 'block',
              fontSize: '1rem',
              color: grey[600],
              fontWeight: router.pathname === page.route ? 900 : 'inheret',
            }}
            component={NextLinkComposed}
            to={{
              pathname: `${page.route}`,
            }}
          >
            {page.name}
          </Button>
        ))}
      </Box>
    </>
  );
};

export default NavbarMenu;
