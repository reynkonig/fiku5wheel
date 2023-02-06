import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

import { IBadgeSet } from '../../../common/interfaces';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await axios<{ data: IBadgeSet }>({
    method: 'get',
    url: 'https://api.twitch.tv/helix/chat/badges/global',
    headers: {
      "Authorization": `Bearer ${process.env.APP_TOKEN}`,
      "Client-Id": process.env.CLIENT_ID
    }
  });

  if(response.status === 200) {
    return res
      .status(200)
      .setHeader('Cache-Control', 'public, s-maxage=21600')
      .json({ global: response.data.data })
    ;
  }
}
