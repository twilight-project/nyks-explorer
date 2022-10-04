import {
  Box,
  Button,
  Container,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { validatorIPAddresses } from 'src/constants/validatorIP';
import { ForkScannerDialog } from './ForkScannerDialog';

const backendApiUrl = process.env.BACKEND_API_URL ?? '';

export default function ForkOracle() {
  const [peerSelected, setPeerSelected] = useState('');
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (peerActive: string) => {
    setPeerSelected(peerActive);
    setShow(true);
  };

  const { data: dataList, status: forkScannerDataStatus } = useQuery(
    ['forkScannerData'],
    () => axios.get(`${backendApiUrl}forkscanner`).then((res) => res.data),
    {
      refetchInterval: 60000,
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
        Fork Scanners
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <TableContainer component={Paper} elevation={3} sx={{ px: 2, pt: 1, maxWidth: 'md' }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Fork scanner #</TableCell>
                <TableCell sx={{ width: 200 }} align="center">
                  IP address
                </TableCell>
                <TableCell sx={{ width: 130 }}>Validator</TableCell>
                <TableCell align="center">Nodes connected</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            {forkScannerDataStatus === 'success' ? (
              <TableBody>
                {Object.keys(dataList).map((peer, index) => (
                  <TableRow key={peer} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      Fork scanner {index + 1}
                    </TableCell>
                    <TableCell align="center">{dataList[peer]?.forkscanner_ip?.ip}</TableCell>
                    <TableCell>
                      {
                        validatorIPAddresses.find(
                          (item) => item.ip === dataList[peer]?.forkscanner_ip.ip,
                        )?.name
                      }
                    </TableCell>
                    <TableCell align="center">
                      {
                        dataList[peer].chaintips.filter((item: any) => item.status === 'active')
                          ?.length
                      }
                    </TableCell>
                    <TableCell align="center">
                      <Button variant="outlined" size="small" onClick={() => handleShow(peer)}>
                        More details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5}>
                    <Skeleton variant="text" sx={{ fontSize: '2rem', width: '100%' }} />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={5}>
                    <Skeleton variant="text" sx={{ fontSize: '2rem', width: '100%' }} />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={5}>
                    <Skeleton variant="text" sx={{ fontSize: '2rem', width: '100%' }} />
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Box>

      {peerSelected ? (
        <ForkScannerDialog
          open={show}
          handleClose={handleClose}
          data={dataList[peerSelected]?.chaintips}
        />
      ) : null}
    </Container>
  );
}
