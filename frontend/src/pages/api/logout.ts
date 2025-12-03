import type { NextApiRequest, NextApiResponse } from 'next';
import { authUtils } from '@/features/auth/lib/auth';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = authUtils.getAuthToken(req);
    
    if (!token) {
      authUtils.removeTokens(res);
      return res.status(200).json({ message: 'Logout successful' });
    }

    const response = await fetch(`${process.env.API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return res.status(400).json({ message: 'Logout failed' });
    }

    authUtils.removeTokens(res);
    return res.status(200).json({ message: 'Logout successful' });
    
  } catch (error) {
    console.error('Logout API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
