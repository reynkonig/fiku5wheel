import { FaTwitch } from 'react-icons/fa';

interface ITwitchLoaderProps {
  ready: boolean;
}

export default function TwitchLoader({ ready }: ITwitchLoaderProps) {
  return (
    <div
      key="twitch-loader"
      className={
      `panel-container z-30 bg-violet-500 rounded-md text-white align-middle
       pointer-events-none transition-all duration-1000 ease-out
      ${ready ? (
        'opacity-0'
      ) : (
        'opacity-100'
      )}`}
    >
      <FaTwitch className="text-4xl m-auto animate-ping" />
    </div>
  );
}
