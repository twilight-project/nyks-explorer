import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Container,
  Skeleton,
} from '@mui/material';
import { ValidatorDialog } from './ValidatorDialog';
import { BlocksDialog } from './BlocksDialog';

const twilightApiUrl = process.env.NEXT_PUBLIC_TWILIGHT_API_URL ?? '';
const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? '';

export default function Dashboard() {
  const [showValidatorModal, setShowValidatorModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);

  const handleCloseValidator = () => setShowValidatorModal(false);
  const handleShowValidator = () => setShowValidatorModal(true);

  const handleCloseBlock = () => setShowBlockModal(false);
  const handleShowBlock = () => setShowBlockModal(true);

  const { data: nyksChainData, status: nyksChainDataStatus } = useQuery(
    ['nyksChainData'],
    () => axios.get(`${backendApiUrl}/nyks`).then((res) => res.data),
    {
      refetchInterval: 3000,
    },
  );

  const { data: attestationsData, status: attestationsDataStatus } = useQuery(
    ['attestationsData'],
    () =>
      axios
        .get(`${twilightApiUrl}twilight-project/nyks/nyks/attestations?order_by=asc`)
        .then((res) => res.data),
    {
      refetchInterval: 60000,
    },
  );

  const { data: forkScannerData, status: forkScannerDataStatus } = useQuery(
    ['forkScannerData'],
    () => axios.get(`${backendApiUrl}/forkscanner`).then((res) => res.data),
    {
      refetchInterval: 60000,
    },
  );

  const { data: mempoolSpaceData, status: mempoolSpaceDataStatus } = useQuery(
    ['mempoolSpaceData'],
    async () => {
      const blocksTipHeight = await axios.get(`https://mempool.space/api/blocks/tip/height`);
      const blocksTipHeightData = await blocksTipHeight.data;

      const blocksTipHash = await axios.get(
        `https://mempool.space/api/block-height/${blocksTipHeightData}`,
      );
      const blocksTipHashData = await blocksTipHash.data;

      return { height: blocksTipHeightData, hash: blocksTipHashData };
    },
    {
      refetchInterval: 60000,
    },
  );

  const { data: forkMonitorData, status: forkMonitorDataStatus } = useQuery(
    ['forkMonitorData'],
    () => axios.get(`${backendApiUrl}/forkmonitor`).then((res) => res.data),
    {
      refetchInterval: 60000,
    },
  );

  const attestedItems = attestationsData?.attestations?.filter(
    (item: any) => item.observed === true,
  );
  const attestationsListLength = attestedItems?.length;

  const NYKSChainInfo = (
    <Card sx={{ minWidth: 275, p: 2, minHeight: '100%' }} raised>
      <CardHeader title="NYKS Chain Info"></CardHeader>

      <CardContent>
        {nyksChainDataStatus === 'success' ? (
          <>
            <Typography color="text.secondary" gutterBottom>
              <strong>Height: </strong>
              {nyksChainData?.blocks?.[0]?.block?.header?.height}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              <strong>Bonded Tokens: </strong>3{nyksChainData?.unbonded_tokens?.pool?.bonded_tokens}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              <strong>Number of Validators: </strong>{' '}
              {nyksChainData?.validators?.result?.validators.length}
            </Typography>
          </>
        ) : (
          <>
            <Skeleton width={250} variant="text" />
            <Skeleton width={250} variant="text" />
            <Skeleton width={250} variant="text" />
          </>
        )}
      </CardContent>
      <CardActions>
        <Button
          variant="outlined"
          onClick={handleShowValidator}
          disabled={!(nyksChainDataStatus === 'success')}
        >
          Validator&apos;s info
        </Button>

        <Button
          variant="outlined"
          onClick={handleShowBlock}
          disabled={!(nyksChainDataStatus === 'success')}
        >
          Block Info
        </Button>
      </CardActions>
    </Card>
  );

  const NYKSAttested = (
    <Card sx={{ minWidth: 275, p: 2, minHeight: '100%' }} raised>
      <CardHeader title="NYKS Attested"></CardHeader>

      <CardContent>
        {attestationsDataStatus === 'success' ? (
          <>
            <Typography color="text.secondary" gutterBottom>
              <strong>Height: </strong>
              {attestedItems?.[attestationsListLength - 1]?.proposal.height}
            </Typography>

            <Typography color="text.secondary" gutterBottom sx={{ wordBreak: 'break-all' }}>
              <strong>Attested Chaintip: </strong>
              {attestedItems?.[attestationsListLength - 1]?.proposal.hash}
            </Typography>

            <Typography color="text.secondary" gutterBottom sx={{ wordBreak: 'break-all' }}>
              <strong>Proposer Address: </strong>
              {attestedItems?.[attestationsListLength - 1]?.proposal.creator}
            </Typography>

            <Typography color="text.secondary" gutterBottom>
              <strong>Number of Attestations: </strong>
              {attestedItems?.[attestationsListLength - 1]?.votes.length}
            </Typography>
          </>
        ) : (
          <>
            <Skeleton width={250} variant="text" />
            <Skeleton width={250} variant="text" />
            <Skeleton width={250} variant="text" />
            <Skeleton width={250} variant="text" />
          </>
        )}
      </CardContent>
    </Card>
  );

  const ForkOracle = (
    <Card sx={{ minWidth: 275, p: 2, minHeight: '100%' }} raised>
      <CardHeader title="Fork Oracle"></CardHeader>

      <CardContent>
        {forkScannerDataStatus === 'success' ? (
          <>
            <Typography color="text.secondary" gutterBottom>
              <strong>Height: </strong>
              {forkScannerData?.['forkscanner_6']?.chaintips[0]?.height}
            </Typography>

            <Typography color="text.secondary" gutterBottom sx={{ wordWrap: 'break-word' }}>
              <strong>Chaintip: </strong>
              {forkScannerData?.['forkscanner_6']?.chaintips[0]?.block}
            </Typography>

            <Typography color="text.secondary" gutterBottom>
              <strong>Number of ForkScanners: </strong>6
            </Typography>

            <Typography color="text.secondary" gutterBottom>
              <strong>Number of BTC Nodes: </strong>18
            </Typography>
          </>
        ) : (
          <>
            <Skeleton width={250} variant="text" />
            <Skeleton width={250} variant="text" />
            <Skeleton width={250} variant="text" />
            <Skeleton width={250} variant="text" />
          </>
        )}
      </CardContent>
    </Card>
  );

  const BTCMempoolSpace = (
    <Card sx={{ minWidth: 275, p: 2, minHeight: '100%' }} raised>
      <CardHeader title="BTC Mempool Space"></CardHeader>

      <CardContent>
        {mempoolSpaceDataStatus === 'success' ? (
          <>
            <Typography color="text.secondary" gutterBottom>
              <strong>Height: </strong>
              {mempoolSpaceData?.height}
            </Typography>
            <Typography color="text.secondary" gutterBottom sx={{ wordWrap: 'break-word' }}>
              <strong>Chaintip: </strong>
              {mempoolSpaceData?.hash}
            </Typography>
          </>
        ) : (
          <>
            <Skeleton width={250} variant="text" />
            <Skeleton width={250} variant="text" />
          </>
        )}
      </CardContent>

      <CardActions>
        <Button variant="outlined" href="https://mempool.space">
          Source Link
        </Button>
      </CardActions>
    </Card>
  );

  const BitmexForkMonitor = (
    <Card sx={{ minWidth: 275, p: 2, minHeight: '100%' }} raised>
      <CardHeader title="Bitmex Fork Monitor"></CardHeader>

      <CardContent>
        {forkMonitorDataStatus === 'success' ? (
          <>
            <Typography color="text.secondary" gutterBottom>
              <strong>Height: </strong>
              {forkMonitorData?.[0]?.block.height}
            </Typography>

            <Typography color="text.secondary" gutterBottom sx={{ wordWrap: 'break-word' }}>
              <strong>Chaintip: </strong>
              {forkMonitorData?.[0]?.block.hash}
            </Typography>
          </>
        ) : (
          <>
            <Skeleton width={250} variant="text" />
            <Skeleton width={250} variant="text" />
          </>
        )}
      </CardContent>

      <CardActions>
        <Button variant="outlined" href="https://forkmonitor.info/">
          Source Link
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <>
      <Container maxWidth="xl" component="section">
        <Typography variant="h4" component="h1" color="text.secondary" mt={4} mb={2}>
          NYKS Chain
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} minHeight="291px">
            {NYKSChainInfo}
          </Grid>

          <Grid item xs={12} md={6}>
            {NYKSAttested}
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="xl" component="section" sx={{ mb: 5 }}>
        <Typography variant="h4" component="h2" color="text.secondary" mt={6} mb={2}>
          Bitcoin Chaintip Info
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={12} minHeight="100%">
            {ForkOracle}
          </Grid>

          <Grid item xs={12} md={6}>
            {BTCMempoolSpace}
          </Grid>

          <Grid item xs={12} md={6}>
            {BitmexForkMonitor}
          </Grid>
        </Grid>
      </Container>

      {showValidatorModal ? (
        <ValidatorDialog
          open={showValidatorModal}
          handleClose={handleCloseValidator}
          data={nyksChainData?.validators?.result?.validators}
        />
      ) : null}

      {showBlockModal ? (
        <BlocksDialog
          open={showBlockModal}
          handleClose={handleCloseBlock}
          data={nyksChainData?.blocks}
        />
      ) : null}
    </>
  );
}
