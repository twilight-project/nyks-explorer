import { StargateClient } from '@cosmjs/stargate';
import {
  Container,
  Typography,
  Box,
  Card,
  CardHeader,
  Divider,
  CardContent,
  Grid,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Tx } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { sha256 } from '@cosmjs/crypto';
import { toHex } from '@cosmjs/encoding';
import NextLinkComposed from '../NextLinkComposed';

const rpcUrl = process.env.RPC_URL ?? '';

function transactionType(typeUrl: string | undefined): 'Send' | 'MsgSeenBtcChainTip' | 'Unknown' {
  console.log('typeUrl', typeUrl);
  if (typeUrl === '/cosmos.bank.v1beta1.MsgSend') {
    return 'Send';
  } else if (typeUrl === '/twilightproject.nyks.nyks.MsgSeenBtcChainTip') {
    return 'MsgSeenBtcChainTip';
  } else {
    return 'Unknown';
  }
}

function transactionHash(rawTransactionBytes: Uint8Array) {
  return toHex(sha256(rawTransactionBytes)).toUpperCase();
}

export default function BlockDetail() {
  const router = useRouter();
  const { height } = router.query;

  const [blockDataState, setBlockDataState] = useState<any>(null);

  useEffect(() => {
    const getBlockInfo = async () => {
      try {
        const client = await StargateClient.connect(rpcUrl);
        const blockData = await client.getBlock(Number(height));
        setBlockDataState(blockData);
      } catch (error) {
        // history.push(`/404`);
        console.log(error);
      }
    };

    getBlockInfo();
  }, [height]);

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
        Details for Block # {height}
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <Box component="span" sx={{ maxWidth: 'md', width: '100%' }}>
          <Card raised sx={{ px: 3, pt: 1 }}>
            <CardHeader title="Header " />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Typography>chain id</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography>
                    {blockDataState === null ? (
                      <Skeleton width={250} variant="text" />
                    ) : (
                      blockDataState.header.chainId
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={3}>
                  <Typography>Height</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography>
                    {blockDataState === null ? (
                      <Skeleton width={250} variant="text" />
                    ) : (
                      blockDataState.header.height
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={3}>
                  <Typography>Time</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography>
                    {blockDataState === null ? (
                      <Skeleton width={250} variant="text" />
                    ) : (
                      new Date(blockDataState.header.time).toLocaleString()
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={3}>
                  <Typography>Block Hash</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography sx={{ wordBreak: 'break-all' }}>
                    {blockDataState === null ? (
                      <Skeleton width={250} variant="text" />
                    ) : (
                      blockDataState.id
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={3}>
                  <Typography>Number of Tx</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography>
                    {blockDataState === null ? (
                      <Skeleton width={250} variant="text" />
                    ) : (
                      blockDataState.txs.length
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card raised sx={{ mt: 3, px: 3, py: 1 }}>
            <CardHeader title="Transactions " />

            {blockDataState === null ? (
              <>
                <Divider />
                <CardContent>
                  <Skeleton width={450} variant="text" />
                </CardContent>
              </>
            ) : blockDataState?.txs.length === 0 ? (
              <>
                <Divider />
                <CardContent>No Transaction.</CardContent>
              </>
            ) : (
              <Table sx={{ minWidth: '100%' }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Hash</TableCell>
                    <TableCell>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {blockDataState?.txs.map((tx: Uint8Array) => (
                    <TableRow
                      key={transactionHash(tx)}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" sx={{ wordBreak: 'break-all' }}>
                        <NextLinkComposed
                          to={{
                            pathname: `/transaction/${transactionHash(tx)}`,
                          }}
                        >
                          {transactionHash(tx)}
                        </NextLinkComposed>
                      </TableCell>
                      <TableCell>
                        {transactionType(Tx.decode(tx)?.body?.messages[0]?.typeUrl!)}
                      </TableCell>
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
