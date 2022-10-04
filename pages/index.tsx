import { useState } from 'react';
import type { NextPage } from 'next';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
} from '@mui/material';

export const validatorIPAddresses = [
  { ip: '164.92.191.219', name: 'Frankfurt' },
  { ip: '206.189.33.200', name: 'Singapore' },
  { ip: '134.122.38.54', name: 'Toronto' },
  { ip: '164.92.157.54', name: 'Amsterdam' },
  { ip: '188.166.145.51', name: 'London' },
  { ip: '165.232.134.41', name: 'Santa Clara' },
];

const twilightApiUrl = process.env.NEXT_PUBLIC_TWILIGHT_API_URL ?? '';
const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? '';

const Home: NextPage = () => {
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

  return (
    <>
      <Container maxWidth="xl" component="section">
        <Typography variant="h4" component="h1" color="text.secondary" mt={4} mb={2}>
          NYKS Chain
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} minHeight="291px">
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
                      <strong>Bonded Tokens: </strong>3
                      {nyksChainData?.unbonded_tokens?.pool?.bonded_tokens}
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
          </Grid>

          <Grid item xs={12} md={6}>
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
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="xl" component="section" sx={{ mb: 5 }}>
        <Typography variant="h4" component="h2" color="text.secondary" mt={6} mb={2}>
          Bitcoin Chaintip Info
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={12} minHeight="100%">
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
          </Grid>

          <Grid item xs={12} md={6}>
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
          </Grid>

          <Grid item xs={12} md={6}>
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
};

export default Home;

const ValidatorDialog = ({ open, handleClose, data }: any) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true} aria-labelledby="dialog-title">
      <DialogTitle id="dialog-title">NYKS Validators</DialogTitle>

      <DialogContent dividers>
        {data.map((item: any, index: number) => (
          <Card raised key={item.address} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
            <CardHeader title={`Validator ${validatorIPAddresses[index].name}`}></CardHeader>
            <Divider />
            <CardContent>
              <Paper variant="outlined">
                <List dense>
                  <ListItem divider>
                    <ListItemText
                      primary="Validator Address:"
                      secondary={item.address}
                      secondaryTypographyProps={{ sx: { wordBreak: 'break-all' } }}
                    />
                  </ListItem>

                  <ListItem divider>
                    <ListItemText
                      primary="Validator Voting Power: "
                      secondary={item.voting_power}
                    />
                  </ListItem>

                  <ListItem divider>
                    <ListItemText
                      primary="Validator Public Key: "
                      secondary={item.pub_key.value}
                      secondaryTypographyProps={{ sx: { wordBreak: 'break-all' } }}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Validator IP Address: "
                      secondary={validatorIPAddresses[index].ip}
                    />
                  </ListItem>
                </List>
              </Paper>
            </CardContent>
          </Card>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const BlocksDialog = ({ open, handleClose, data }: any) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true} aria-labelledby="dialog-title">
      <DialogTitle id="dialog-title">NYKS Latest Blocks</DialogTitle>

      <DialogContent dividers>
        {data
          .sort((a: any, b: any) => b.block.header.height - a.block.header.height)
          .map((item: any) => (
            <Card raised key={item.block.header.height} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
              <CardHeader title={`Block ${item.block.header.height}`}></CardHeader>
              <Divider />
              <CardContent>
                <Paper variant="outlined">
                  <List dense>
                    <ListItem divider>
                      <ListItemText
                        primary="Block hash: "
                        secondary={item.block_id.hash}
                        secondaryTypographyProps={{ sx: { wordBreak: 'break-all' } }}
                      />
                    </ListItem>

                    <ListItem divider>
                      <ListItemText
                        primary="Proposer address:"
                        secondary={item.block.header.proposer_address}
                        secondaryTypographyProps={{ sx: { wordBreak: 'break-all' } }}
                      />
                    </ListItem>

                    <ListItem divider>
                      <ListItemText primary="Height:" secondary={item.block.header.height} />
                    </ListItem>

                    <ListItem divider>
                      <ListItemText
                        primary="Transactions: "
                        secondary={item.block.data.txs.length}
                      />
                    </ListItem>

                    <ListItem>
                      <ListItemText
                        primary="Time: "
                        secondary={new Date(item.block.header.time).toLocaleString()}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </CardContent>
            </Card>
          ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
