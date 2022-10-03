import { AppBar, Box, Grid, Toolbar } from '@mui/material';
import NextLinkComposed from 'src/components/NextLinkComposed';
import SearchField from '../SearchField';

const NavbarTop = () => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundImage: 'linear-gradient(to right,#272538,#35305e 81%)',
        px: { lg: 16, md: 8 },
      }}
    >
      <Toolbar>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6} sm={6} md={6} lg={8}>
            <NextLinkComposed
              to={{
                pathname: `/`,
              }}
            >
              {/* <Link href="/"> */}
              <Box
                component="img"
                pt={1}
                sx={{ height: 54 }}
                alt="Logo"
                src={'Twilight-logo.png'}
              />
              {/* </Link> */}
            </NextLinkComposed>
          </Grid>

          <Grid item xs={6} sm={6} md={6} lg={4}>
            <SearchField />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default NavbarTop;
