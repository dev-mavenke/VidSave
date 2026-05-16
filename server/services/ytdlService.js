const youtubedl = require('yt-dlp-exec');

const SUPPORTED_PLATFORMS = [
  {
    name: 'YouTube',
    domains: ['youtube.com', 'youtu.be', 'youtube-nocookie.com']
  },
  {
    name: 'TikTok',
    domains: ['tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com']
  },
  {
    name: 'Instagram',
    domains: ['instagram.com', 'instagr.am']
  },
  {
    name: 'Twitter/X',
    domains: ['twitter.com', 'x.com', 'mobile.twitter.com']
  }
];

const getHeightFromText = (value) => {
  const match = String(value || '').match(/(?:^|x)(\d{3,4})(?:p)?$/i);
  return match ? Number(match[1]) : null;
};

const isSupportedUrl = (url) => {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./i, '').toLowerCase();

    return SUPPORTED_PLATFORMS.some((platform) =>
      platform.domains.some(
        (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
      )
    );

  } catch {
    return false;
  }
};

const getQualityLabel = (format) => {
  if (format.height) {
    return `${format.height}p`;
  }

  const height =
    getHeightFromText(format.resolution) ||
    getHeightFromText(format.format_note) ||
    getHeightFromText(format.quality);

  if (height) {
    return `${height}p`;
  }

  if (format.format_note && format.format_note !== 'unknown') {
    return format.format_note;
  }

  return 'Standard Quality';
};

const isDownloadableVideo = (format) =>
  format.format_id &&
  format.ext &&
  format.ext !== 'mhtml' &&
  format.vcodec !== 'none' &&
  format.acodec !== 'none';

const sortByQuality = (a, b) => {
  const heightDiff = (b.height || 0) - (a.height || 0);

  if (heightDiff !== 0) {
    return heightDiff;
  }

  return (b.tbr || 0) - (a.tbr || 0);
};

const getVideoInfo = async (url) => {
  try {
    if (!isSupportedUrl(url)) {
      throw new Error(
        'Unsupported link. Paste a public TikTok, Instagram, Twitter/X, or YouTube video URL.'
      );
    }

    const info = await youtubedl(url, {
      dumpSingleJson: true,
      noWarnings: true,
      preferFreeFormats: true,
      noPlaylist: true
    });

    const formats = (info.formats || [])
      .filter(isDownloadableVideo)
      .sort(sortByQuality);

    return {
      title: info.title,
      thumbnail: info.thumbnail,
      duration: info.duration,

      formats: [
        ...new Map(
          formats
            .map((f) => [
              `${f.height || f.resolution || f.format_id}-${f.ext}`,
              {
                format_id: f.format_id,
                ext: f.ext,
                height:
                  f.height ||
                  getHeightFromText(f.resolution) ||
                  getHeightFromText(f.format_note) ||
                  null,
                quality: getQualityLabel(f)
              }
            ])
        ).values()
      ]
    };

  } catch (error) {
    console.error(error);

    throw new Error(
      'Failed to fetch media info. Make sure the link is public and supported.'
    );
  }
};

module.exports = { getVideoInfo, isSupportedUrl, SUPPORTED_PLATFORMS };
