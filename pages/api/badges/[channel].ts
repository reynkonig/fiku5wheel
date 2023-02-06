import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

import { IBadgeSet } from '../../../common/interfaces';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { channel } = req.query;

  const headers = {
    "Authorization": `Bearer ${process.env.APP_TOKEN}`,
    "Client-Id": process.env.CLIENT_ID
  };

  const user = await axios({
    method: 'get',
    url: 'https://api.twitch.tv/helix/users',
    params: {
      login: channel
    },
    headers
  });

  const broadcaster_id = user.data.data?.[0]?.id;

  if(broadcaster_id) {
    const response = await axios<{ data: IBadgeSet }>({
      method: 'get',
      url: 'https://api.twitch.tv/helix/chat/badges',
      params: {
        broadcaster_id: broadcaster_id
      },
      headers
    });

    if(response.status === 200) {
      res
        .setHeader('Cache-Control', 's-maxage=21600')
        .status(200)
        .json(Object.fromEntries([[channel, response.data.data]]))
      ;
    }
  }
}
