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
import { validatorIPAddresses } from 'src/constants/validatorIP';

interface IValidatorDialogProps {
  open: boolean;
  handleClose: () => void;
  data: any;
}

export function ValidatorDialog({ open, handleClose, data }: IValidatorDialogProps) {
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
}
