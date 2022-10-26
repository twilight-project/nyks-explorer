import { Box } from '@mui/material';
import { LayoutGroup, motion } from 'framer-motion';
import Link from 'next/link';
import Xarrow from 'react-xarrows';
import theme from 'src/theme';
import { BlockCard } from './BlockCard';

export default function NyksBlocks({ nyksChainData }: { nyksChainData: any }) {
  return (
    <Box sx={{ display: 'flex', overflow: 'auto' }}>
      <LayoutGroup id="top5">
        {nyksChainData
          ?.sort((a: any, b: any) => b.block.header.height - a.block.header.height)
          .map((block: any, index: number, arr: any) => (
            <motion.div
              layout
              transition={{ type: 'spring', damping: 15, stiffness: 100 }}
              initial={{ x: -323, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              key={block.block.header.height}
            >
              <Link
                href={{
                  pathname: `/block/${encodeURIComponent(block.block.header.height)}`,
                }}
              >
                <Box sx={{ my: 3, mr: 6, cursor: 'pointer', position: 'relative' }}>
                  <BlockCard
                    height={block.block.header.height}
                    transactions={block.block.data.txs.length}
                    blockHash={block.block_id.hash}
                    previousBlockHash={block.block.header.last_block_id.hash}
                    dataTime={block.block.header.time}
                    id={`${block.block_id.hash}-${block.block.header.height}`}
                  />
                  {arr.length !== index + 1 ? (
                    <Xarrow
                      start={`${block.block_id.hash}-${block.block.header.height}`}
                      end={`${block.block.header.last_block_id.hash}-${
                        block.block.header.height - 1
                      }`}
                      color={theme.palette.primary.main}
                      strokeWidth={5}
                      zIndex={0}
                      headShape="arrow1"
                      headSize={2.5}
                      tailShape="arrow1"
                      tailSize={2.5}
                      showTail={true}
                    />
                  ) : null}
                </Box>
              </Link>
            </motion.div>
          ))}
      </LayoutGroup>
    </Box>
  );
}
