// YoutubePlayer.tsx
import YouTube from "react-youtube";

export default function YoutubePlayer({
  videoId,
  onEnd,
}: {
  videoId: string;
  onEnd?: () => void;
}) {
  return (
    <YouTube
      videoId={videoId}
      onEnd={onEnd}
      opts={{
        width: "100%",
        playerVars: {
          autoplay: 1,
        },
      }}
    />
  );
}
