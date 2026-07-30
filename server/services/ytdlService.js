const youtubedl = require('yt-dlp-exec');
const { AppError, mapYtDlpError, UNSUPPORTED_LINK_MESSAGE } = require('../utils/errors');
const { getHeightFromText, getQualityLabel } = require('../utils/format');

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

const isSupportedUrl = (url) => {
  try {
    const { protocol, hostname } = new URL(url);

    if (protocol !== 'http:' && protocol !== 'https:') {
      return false;
    }

    const host = hostname.replace(/^www\./i, '').toLowerCase();

    return SUPPORTED_PLATFORMS.some((platform) =>
      platform.domains.some(
        (domain) => host === domain || host.endsWith(`.${domain}`)
      )
    );

  } catch {
    return false;
  }
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

const toPublicFormat = (f) => ({
  format_id: f.format_id,
  ext: f.ext,
  height:
    f.height ||
    getHeightFromText(f.resolution) ||
    getHeightFromText(f.format_note) ||
    null,
  quality: getQualityLabel(f),
  filesize: f.filesize || f.filesize_approx || null
});

const getVideoInfo = async (url) => {
  // Validated outside the try below so it surfaces as a 400, not as a generic
  // upstream failure.
  if (!isSupportedUrl(url)) {
    throw new AppError(UNSUPPORTED_LINK_MESSAGE, 400);
  }

  let info;

  try {
    info = await youtubedl(url, {
      dumpSingleJson: true,
      noWarnings: true,
      preferFreeFormats: true,
      noPlaylist: true
    });

  } catch (error) {
    console.error('[yt-dlp] info failed:', error.stderr || error.message);
    throw mapYtDlpError(error.stderr || error.message);
  }

  const formats = (info.formats || [])
    .filter(isDownloadableVideo)
    .sort(sortByQuality);

  // Collapse duplicates that differ only in bitrate, keeping the highest-quality
  // entry per resolution/container pair (the list is already sorted).
  const deduped = [
    ...new Map(
      formats.map((f) => [
        `${f.height || f.resolution || f.format_id}-${f.ext}`,
        toPublicFormat(f)
      ])
    ).values()
  ];

  return {
    title: info.title || 'VidSave Media',
    thumbnail: info.thumbnail || '',
    duration: info.duration || null,
    formats: deduped
  };
};

module.exports = { getVideoInfo, isSupportedUrl, SUPPORTED_PLATFORMS };
