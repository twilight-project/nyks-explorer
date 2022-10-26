import { Card, CardContent, Divider, Typography } from '@mui/material';
import theme from 'src/theme';

interface BlockCardProps {
  height: number;
  transactions: number;
  blockHash: string;
  previousBlockHash: string;
  dataTime: string;
  id: string;
}

export function BlockCard({
  height,
  transactions,
  blockHash,
  previousBlockHash,
  dataTime,
  id,
}: BlockCardProps) {
  return (
    <Card
      sx={{ minWidth: 275, maxWidth: 325, borderLeft: `5px solid ${theme.palette.primary.main}` }}
      elevation={7}
      id={id}
    >
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Height
        </Typography>
        <Typography variant="h5" component="div">
          {height}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {transactions} Transactions
        </Typography>

        <Divider />

        <Typography sx={{ my: 1.5 }} variant="body1">
          Hash <br />
          {blockHash.substring(0, 9) + '---' + blockHash.substring(55, 64)}
        </Typography>

        <Typography sx={{ my: 1.5 }} variant="body1">
          Previous block hash <br />
          {previousBlockHash.substring(0, 9) + '---' + previousBlockHash.substring(55, 64)}
        </Typography>

        <Divider />

        <Typography sx={{ my: 1.5 }} variant="body1">
          DateTime <br />
          {new Date(dataTime).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
}
