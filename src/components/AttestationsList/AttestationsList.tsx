import {
  Box,
  Container,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Skeleton,
} from '@mui/material';
import { useQueryWithAxios } from 'src/hooks';

const twilightApiUrl = process.env.TWILIGHT_API_URL ?? '';

export default function AttestationsList() {
  const { data: dataList, status: attestationsDataStatus } = useQueryWithAxios(
    ['attestationsData1'],
    `${twilightApiUrl}twilight-project/nyks/nyks/attestations?order_by=desc&limit=12`,
    { refetchInterval: 60000 },
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
        Latest Attestations
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box component="span" sx={{ maxWidth: 'sm', width: '100%' }}>
          {attestationsDataStatus === 'success' ? (
            dataList?.attestations.map((attestation: any) => (
              <Card raised key={attestation.height} sx={{ mb: 2 }}>
                <CardHeader title="Attestation " />
                <Divider />
                <CardContent>
                  <Paper variant="outlined">
                    <List dense>
                      <ListItem divider>
                        <ListItemText
                          primary="Nyks block height: "
                          secondary={attestation.height}
                        />
                      </ListItem>

                      <ListItem divider>
                        <ListItemText
                          primary="Observed: "
                          secondary={attestation.observed.toString()}
                        />
                      </ListItem>

                      <ListItem divider>
                        <ListItemText
                          primary="Proposal type : "
                          secondary={attestation.proposal['@type']}
                          secondaryTypographyProps={{ sx: { wordBreak: 'break-all' } }}
                        />
                      </ListItem>

                      <ListItem divider>
                        <ListItemText
                          primary="Proposal creator : "
                          secondary={attestation.proposal['creator']}
                          secondaryTypographyProps={{ sx: { wordBreak: 'break-all' } }}
                        />
                      </ListItem>

                      <ListItem divider>
                        <ListItemText
                          primary="Proposal height : "
                          secondary={attestation.proposal['height']}
                        />
                      </ListItem>

                      <ListItem divider>
                        <ListItemText
                          primary="Proposal hash : "
                          secondary={attestation.proposal['hash']}
                          secondaryTypographyProps={{ sx: { wordBreak: 'break-all' } }}
                        />
                      </ListItem>

                      <ListItem divider>
                        <ListItemText
                          primary="Proposal orchestratorAddress : "
                          secondary={attestation.proposal['orchestratorAddress']}
                          secondaryTypographyProps={{ sx: { wordBreak: 'break-all' } }}
                        />
                      </ListItem>

                      <ListItem>
                        <ListItemText
                          primary="Votes:"
                          secondary={attestation.votes.map((vote: any, index: number) => (
                            <ListItem key={vote + index} component="span">
                              <ListItemText>{vote}</ListItemText>
                            </ListItem>
                          ))}
                          secondaryTypographyProps={{
                            component: 'span',
                            sx: { wordBreak: 'break-all' },
                          }}
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card raised>
              <CardHeader title="Attestation " />

              <Divider />
              <CardContent>
                <Paper variant="outlined">
                  <List dense disablePadding>
                    <ListItem divider>
                      <Skeleton variant="text" sx={{ fontSize: '3rem', width: '100%' }} />
                    </ListItem>

                    <ListItem divider>
                      <Skeleton variant="text" sx={{ fontSize: '3rem', width: '100%' }} />
                    </ListItem>

                    <ListItem divider>
                      <Skeleton variant="text" sx={{ fontSize: '3rem', width: '100%' }} />
                    </ListItem>

                    <ListItem divider>
                      <Skeleton variant="text" sx={{ fontSize: '3rem', width: '100%' }} />
                    </ListItem>

                    <ListItem divider>
                      <Skeleton variant="text" sx={{ fontSize: '3rem', width: '100%' }} />
                    </ListItem>

                    <ListItem divider>
                      <Skeleton variant="text" sx={{ fontSize: '3rem', width: '100%' }} />
                    </ListItem>

                    <ListItem divider>
                      <Skeleton variant="text" sx={{ fontSize: '3rem', width: '100%' }} />
                    </ListItem>
                  </List>
                </Paper>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </Container>
  );
}
