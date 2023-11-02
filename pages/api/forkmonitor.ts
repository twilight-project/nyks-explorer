import type { NextApiRequest, NextApiResponse } from 'next';

const fetchData = async () => {
  const res = await fetch('https://forkmonitor.info/api/v1/chaintips/');
  const json = await res.json();
  return json;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = await fetchData();
  res.status(200).json(data);
}
