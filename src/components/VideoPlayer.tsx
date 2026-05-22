import { AlertCircle } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  className?: string;
}

// Helper to detect video source type and extract embed URLs
const getVideoEmbedUrl = (url: string): { type: 'youtube' | 'vimeo' | 'html5' | 'unknown'; embedUrl: string } => {
  // YouTube patterns
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&?#]+)/,
    /youtube\.com\/embed\/([^\s&?#]+)/,
  ];
  
  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return {
        type: 'youtube',
        embedUrl: `https://www.youtube.com/embed/${match[1]}?autoplay=1`,
      };
    }
  }

  // Vimeo patterns
  const vimeoPatterns = [
    /vimeo\.com\/(\d+)/,
    /vimeo\.com\/embed\/(\d+)/,
  ];
  
  for (const pattern of vimeoPatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return {
        type: 'vimeo',
        embedUrl: `https://player.vimeo.com/video/${match[1]}`,
      };
    }
  }

  // Direct video files (MP4, WebM, Ogg)
  if (/\.(mp4|webm|ogg|mov|avi)$/i.test(url)) {
    return {
      type: 'html5',
      embedUrl: url,
    };
  }

  // If it looks like it might be a video embed URL already
  if (url.includes('embed') || url.includes('youtube') || url.includes('vimeo')) {
    return {
      type: 'youtube',
      embedUrl: url,
    };
  }

  return {
    type: 'unknown',
    embedUrl: url,
  };
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title, className = '' }) => {
  const { type, embedUrl } = getVideoEmbedUrl(videoUrl);

  if (!videoUrl || type === 'unknown') {
    return (
      <div className={`w-full bg-gray-100 rounded-lg flex flex-col items-center justify-center ${className}`} style={{ aspectRatio: '16/9' }}>
        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600 font-medium mb-1">Video not available</p>
        <p className="text-sm text-gray-500">The video URL could not be loaded</p>
        <p className="text-xs text-gray-400 mt-4 px-4 text-center break-all">{videoUrl}</p>
      </div>
    );
  }

  if (type === 'html5') {
    return (
      <video
        controls
        className={`w-full h-full rounded-lg bg-black ${className}`}
        title={title}
        style={{ maxHeight: '70vh', aspectRatio: '16/9', objectFit: 'contain' }}
      >
        <source src={embedUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  // For YouTube and Vimeo
  return (
    <iframe
      width="100%"
      height="100%"
      src={embedUrl}
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      className={`rounded-lg ${className}`}
      style={{ aspectRatio: '16/9', minHeight: '400px' }}
    />
  );
};
