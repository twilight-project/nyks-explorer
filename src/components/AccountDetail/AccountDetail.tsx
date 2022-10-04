import {
  Container,
  Typography,
  Box,
  Card,
  CardHeader,
  Divider,
  CardContent,
  Skeleton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getAsString } from 'src/utils/getAsString';

const twilightApiUrl = process.env.TWILIGHT_API_URL ?? '';

export default function AccountDetail() {
  const router = useRouter();
  const { address } = router.query;

  const addressString = getAsString(address);

  const { data: accountData, status: accountDataStatus } = useQuery(
    ['accountData', addressString],
    () =>
      axios
        .get(`${twilightApiUrl}cosmos/bank/v1beta1/balances/${addressString}`)
        .then((res) => res.data),
    {
      enabled: !!addressString,
    },
  );

  return (
    <Container maxWidth="xl" component="section">
      <Typography
        variant="h4"
        component="h1"
        color="text.secondary"
        mt={4}
        mb={2}
        textAlign="center"
      >
        Details for Account
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <Box component="span" sx={{ maxWidth: 'md', width: '100%' }}>
          <Card raised sx={{ mt: 3, px: 3, py: 1 }}>
            <CardHeader title="Assets " />

            {accountDataStatus === 'loading' ? (
              <>
                <Divider />
                <CardContent>
                  <Skeleton width={450} variant="text" />
                </CardContent>
              </>
            ) : accountDataStatus === 'error' ? (
              <>
                <Divider />
                <CardContent>No data found for address - {addressString}.</CardContent>
              </>
            ) : (
              <Table sx={{ minWidth: '100%' }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accountData?.balances.map((account: any, index: number) => (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {account.denom}
                      </TableCell>
                      <TableCell>{account.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
