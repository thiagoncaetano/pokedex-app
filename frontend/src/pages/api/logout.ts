import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiRequestHandler } from '@/lib/ApiRequestHandler';
import { authUtils } from '@/features/auth/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const tokens = authUtils.getTokens({ req, res });
  
  const data = await ApiRequestHandler({
    method: 'POST',
    path: 'auth/logout',
    token: tokens?.token,
  });

  authUtils.removeTokens({ req, res });
  
  res.status(200).json(data);
}
