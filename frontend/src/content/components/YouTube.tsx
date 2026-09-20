import React, { useState } from 'react';
import { PlayCircleFilled } from '@ant-design/icons';

export interface YouTubeProps {
  videoId: string;
  title: string;
  aspectRatio?: string;
}

export const YouTube: React.FC<YouTubeProps> = ({
  videoId,
  title,
  aspectRatio = '16 / 9'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio,
      borderRadius: '10px',
      overflow: 'hidden',
      margin: '24px 0',
      background: '#0F172A'
    }}>
      {isPlaying ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          aria-label={`Play video: ${title}`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            background: `url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg) center/cover no-repeat`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.35)',
            transition: 'background 0.2s'
          }} />
          <PlayCircleFilled style={{ fontSize: '56px', color: '#F97316', zIndex: 1 }} />
        </button>
      )}
    </div>
  );
};
