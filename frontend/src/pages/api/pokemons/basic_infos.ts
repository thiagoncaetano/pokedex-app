import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiRequestHandler, ApiError } from '../../../lib/ApiRequestHandler';
import { authUtils } from '@/features/auth/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const tokens = authUtils.getTokens({ req, res });

    const data = await ApiRequestHandler({
      method: 'POST',
      path: 'pokemons/basic_infos',
      body: req.body,
      token: tokens?.token,
    });

    res.status(200).json(data);
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return res.status(err.status).json({ message: err.message });
    }
    res.status(500).json({ message: (err as Error)?.message || 'Error fetching pokemon basic infos' });
  }
}
