import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const useQueryWithAxios = (
  queryKey: string[],
  url: string,
  config?: { refetchInterval?: number | false; enabled?: boolean | undefined },
) => {
  return useQuery(queryKey, () => axios.get(url).then((res) => res.data), config);
};

export default useQueryWithAxios;
