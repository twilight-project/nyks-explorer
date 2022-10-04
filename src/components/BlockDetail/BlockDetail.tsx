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
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';

// const twilightApiUrl = process.env.TWILIGHT_API_URL ?? '';
const rpcUrl = process.env.RPC_URL ?? '';

// const getHeightString = (hash: string | string[] | undefined): string => {
//   if (typeof hash === 'object') {
//     return hash[0];
//   }
//   return hash ?? '';
// };

function transactionType(typeUrl: any) {
  console.log('typeUrl', typeUrl);
  if (typeUrl === '/cosmos.bank.v1beta1.MsgSend') {
    return 'Send';
  }

  if (typeUrl === '/twilightproject.nyks.nyks.MsgSeenBtcChainTip') {
    return 'MsgSeenBtcChainTip';
  }

  return 'Unknown';
}

function transactionHash(rawTransactionBytes: Uint8Array) {
  return toHex(sha256(rawTransactionBytes)).toUpperCase();
}

export default function BlockDetail() {
  const router = useRouter();
  const { height } = router.query;

  // const heightString = getHeightString(height);
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

  // const [txDataState, setTxDataState] = useState<IndexedTx | null | undefined>(undefined);
  // const [sendMessage, setSendMessage] = useState({});
  // const [msgType, setMsgType] = useState<string | undefined>('');
  // const { data: blockData, status: blockDataStatus } = useQuery(
  //   ['transactionData', heightString],
  //   () =>
  //     axios
  //       .get(`${twilightApiUrl}cosmos/tx/v1beta1/txs/block/${heightString}`)
  //       .then((res) => res.data),
  //   {
  //     enabled: !!heightString,
  //   },
  // );
  // console.log(blockData);

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
                        {transactionHash(tx)}
                      </TableCell>
                      <TableCell>
                        {transactionType(Tx.decode(tx)?.body?.messages[0]?.typeUrl)}
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
