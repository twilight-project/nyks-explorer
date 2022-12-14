import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';

interface IForkScannerDialogProps {
  open: boolean;
  handleClose: () => void;
  data: any;
}

export function ForkScannerDialog({ open, handleClose, data }: IForkScannerDialogProps) {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true} aria-labelledby="dialog-title">
      <DialogTitle id="dialog-title">Connected Bitcoin Nodes </DialogTitle>

      <DialogContent dividers>
        {data.btc_node_info.map((item: any, index: number) => (
          <Card raised key={item.id} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
            <CardHeader title={`Bitcoin node ${index + 1}`}></CardHeader>
            <Divider />
            <CardContent>
              <Paper variant="outlined">
                <List dense>
                  <ListItem divider>
                    <ListItemText
                      primary="Chaintip hash: "
                      secondary={item.status.bestblockhash}
                      secondaryTypographyProps={{ sx: { wordBreak: 'break-all' } }}
                    />
                  </ListItem>

                  <ListItem divider>
                    <ListItemText primary="Chaintip height: " secondary={item.status.blocks} />
                  </ListItem>

                  <ListItem divider>
                    <ListItemText
                      primary="Node IP address: "
                      secondary={item.ip}
                      secondaryTypographyProps={{ sx: { wordBreak: 'break-all' } }}
                    />
                  </ListItem>

                  <ListItem divider>
                    <ListItemText primary="Node location: " secondary={item.location} />
                  </ListItem>

                  <ListItem divider>
                    <ListItemText primary="BTC node version: " secondary={item.version} />
                  </ListItem>

                  {/*  <ListItem>
                   <ListItemText primary="Status: " secondary={item.status} /> 
                  </ListItem>*/}
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
}
