import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

import { IBadges } from '../../../common/Interfaces';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const badges: IBadges = { global: [], local: [] };

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
    const response = await axios({
      method: 'get',
      url: 'https://api.twitch.tv/helix/chat/badges',
      params: {
        broadcaster_id: broadcaster_id
      },
      headers
    });

    if(response.status === 200) {
      badges.local = response.data?.data ?? [];
    }
  }

  const globalBadgesResponse = await axios({
    method: 'get',
    url: 'https://api.twitch.tv/helix/chat/badges/global',
    headers
  });

  if(globalBadgesResponse.status === 200) {
    badges.global = globalBadgesResponse.data?.data ?? [];
  }

  return (
    res
    .setHeader('Cache-Control', 's-maxage=21600')
    .status(200)
    .json(badges)
  );
}
