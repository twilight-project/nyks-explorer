import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useRouter } from 'next/router';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '32ch',
      '&:focus': {
        width: '36ch',
      },
    },
  },
}));

const SearchField = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const router = useRouter();
  const height = /^\d+$/;
  const txhash = /^[A-Z\d]{64}$/;
  const addr = /^[a-z]+1[a-z\d]{38}$/;

  console.log(searchQuery);

  const updateUrl = () => {
    if (height.test(searchQuery)) {
      router.push(`/block/${searchQuery}`);
    } else if (txhash.test(searchQuery)) {
      router.push(`/transaction/${searchQuery}`);
    } else if (addr.test(searchQuery)) {
      router.push(`/account/${searchQuery}`);
    } else {
      router.push(`/404`);
    }
  };
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon onClick={updateUrl} />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search By Address, Block Height, TxHash..."
        inputProps={{ 'aria-label': 'search' }}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => (e.key === 'Enter' ? updateUrl() : null)}
      />
    </Search>
  );
};

export default SearchField;
