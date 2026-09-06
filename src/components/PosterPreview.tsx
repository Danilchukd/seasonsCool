import {
  useEffect,
  useState,
} from 'react';

interface PosterPreviewProps {
  posterPath: string | null;
  alt: string;
}

export default function PosterPreview({
  posterPath,
  alt,
}: PosterPreviewProps) {
  const [posterUrl, setPosterUrl] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadPoster = async () => {
      if (!posterPath) {
        setPosterUrl(null);
        return;
      }

      const result =
        await window.electronAPI.getPosterDataUrl(
          posterPath,
        );

      if (active) {
        setPosterUrl(result);
      }
    };

    void loadPoster();

    return () => {
      active = false;
    };
  }, [posterPath]);

  if (!posterUrl) {
    return null;
  }

  return (
    <img
      src={posterUrl}
      alt={alt}
      width={160}
    />
  );
}