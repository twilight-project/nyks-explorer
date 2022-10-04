import {
  Button,
  Card,
  CardContent,
  CardHeader,
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

interface IBlocksDialogProps {
  open: boolean;
  handleClose: () => void;
  data: any;
}

export function BlocksDialog({ open, handleClose, data }: IBlocksDialogProps) {
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
}
