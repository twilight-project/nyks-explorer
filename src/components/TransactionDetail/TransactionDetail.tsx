import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAsString } from 'src/utils/getAsString';
import { useQueryWithAxios } from 'src/hooks';

const messageTypeUrlEnum = {
  sendMessage: '/cosmos.bank.v1beta1.MsgSend',
  btcChainTip: '/twilightproject.nyks.nyks.MsgSeenBtcChainTip',
};

const twilightApiUrl = process.env.TWILIGHT_API_URL ?? '';

export default function TransactionDetail() {
  const router = useRouter();
  const { hash } = router.query;

  const hashString = getAsString(hash);

  const [msgType, setMsgType] = useState<string | undefined>('');

  const { data: transactionData, status: transactionDataStatus } = useQueryWithAxios(
    ['transactionData', hashString],
    `${twilightApiUrl}/cosmos/tx/v1beta1/txs/${hashString}`,
    { enabled: !!hashString },
  );

  useEffect(() => {
    if (transactionData?.tx?.body?.messages?.[0]['@type'])
      setMsgType(transactionData.tx.body.messages[0]['@type']);
  }, [transactionData]);

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
        Transasction Details
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <Box component="span" sx={{ maxWidth: 'md', width: '100%' }}>
          <Card raised sx={{ px: 3, pt: 1 }}>
            <CardHeader title="Information " />
            <Divider />

            {transactionData === null || transactionDataStatus === 'error' ? (
              <CardContent>Transaction not found on chain.</CardContent>
            ) : (
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <Typography>TxHash</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography>
                      {transactionDataStatus === 'loading' ? (
                        <Skeleton width={250} variant="text" />
                      ) : (
                        transactionData.tx_response.txhash
                      )}
                    </Typography>
                  </Grid>

                  <Grid item xs={3}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography>
                      {transactionDataStatus === 'loading' ? (
                        <Skeleton width={250} variant="text" />
                      ) : transactionData.tx_response.code === 0 ? (
                        'Success'
                      ) : (
                        'Failed'
                      )}
                    </Typography>
                  </Grid>

                  <Grid item xs={3}>
                    <Typography>Height</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography>
                      {transactionDataStatus === 'loading' ? (
                        <Skeleton width={250} variant="text" />
                      ) : (
                        transactionData.tx_response.height
                      )}
                    </Typography>
                  </Grid>

                  <Grid item xs={3}>
                    <Typography>Gas (used / wanted)</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography>
                      {transactionDataStatus === 'loading' ? (
                        <Skeleton width={250} variant="text" />
                      ) : (
                        `${transactionData.tx_response.gas_used} / ${transactionData.tx_response.gas_wanted}`
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            )}
          </Card>

          {msgType === messageTypeUrlEnum.btcChainTip ? (
            <MsgSeenBtcChainTip
              transactionData={transactionData}
              transactionDataStatus={transactionDataStatus}
            />
          ) : null}
        </Box>
      </Box>
    </Container>
  );
}

const MsgSeenBtcChainTip = ({
  transactionData,
  transactionDataStatus,
}: {
  transactionData: any;
  transactionDataStatus: 'loading' | 'error' | 'success';
}) => {
  return (
    <Card raised sx={{ mt: 3, px: 3, pt: 1 }}>
      <CardHeader title="Message " />
      <Divider />

      {transactionData === null || transactionDataStatus === 'error' ? (
        <CardContent>Transaction not found on chain.</CardContent>
      ) : (
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography>Type</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography>
                {transactionDataStatus === 'loading' ? (
                  <Skeleton width={250} variant="text" />
                ) : (
                  transactionData.tx.body.messages[0]['@type']
                )}
              </Typography>
            </Grid>

            <Grid item xs={3}>
              <Typography>Creator</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography>
                {transactionDataStatus === 'loading' ? (
                  <Skeleton width={250} variant="text" />
                ) : (
                  transactionData.tx.body.messages[0]['creator']
                )}
              </Typography>
            </Grid>

            <Grid item xs={3}>
              <Typography>Hash</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography>
                {transactionDataStatus === 'loading' ? (
                  <Skeleton width={250} variant="text" />
                ) : (
                  transactionData.tx.body.messages[0]['hash']
                )}
              </Typography>
            </Grid>

            <Grid item xs={3}>
              <Typography>Height</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography>
                {transactionDataStatus === 'loading' ? (
                  <Skeleton width={250} variant="text" />
                ) : (
                  transactionData.tx.body.messages[0]['height']
                )}
              </Typography>
            </Grid>

            <Grid item xs={3}>
              <Typography>Orchestrator Address</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography>
                {transactionDataStatus === 'loading' ? (
                  <Skeleton width={250} variant="text" />
                ) : (
                  transactionData.tx.body.messages[0]['orchestratorAddress']
                )}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      )}
    </Card>
  );
};
