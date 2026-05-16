const youtubedl = require('yt-dlp-exec');
const { getVideoInfo, isSupportedUrl } = require('../services/ytdlService');

const getHeightFromText = (value) => {
  const match = String(value || '').match(/(?:^|x)(\d{3,4})(?:p)?$/i);
  return match ? Number(match[1]) : null;
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

  if (format.quality && format.quality !== 'p') {
    return format.quality;
  }

  if (format.format_note && format.format_note !== 'unknown') {
    return format.format_note;
  }

  return 'Standard Quality';
};

exports.getMetadata = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        error: 'URL is required'
      });
    }

    const info = await getVideoInfo(url);

    const formats = (info.formats || []).map((f) => ({
      format_id: f.format_id,
      ext: f.ext || 'mp4',
      height:
        f.height ||
        getHeightFromText(f.resolution) ||
        getHeightFromText(f.quality) ||
        null,
      quality: getQualityLabel(f)
    }));

    res.json({
      title: info.title || 'VidSave Media',
      thumbnail: info.thumbnail || '',
      formats
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
};

const sanitizeFilename = (value) =>
  String(value || 'vidsave-video')
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120) || 'vidsave-video';

exports.downloadVideo = async (req, res) => {
  const { url, formatId, title } = req.query;

  if (!url) {
    return res.status(400).json({
      error: 'URL is required'
    });
  }

  if (!isSupportedUrl(url)) {
    return res.status(400).json({
      error: 'Unsupported link. Paste a public TikTok, Instagram, Twitter/X, or YouTube video URL.'
    });
  }

  const filename = `${sanitizeFilename(title)}.mp4`;

  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  const subprocess = youtubedl.exec(
    url,
    {
      format: formatId || 'best[ext=mp4]/best',
      output: '-',
      noWarnings: true,
      noPlaylist: true,
      restrictFilenames: true
    },
    {
      stdio: ['ignore', 'pipe', 'pipe']
    }
  );

  subprocess.stdout.pipe(res);

  subprocess.stderr.on('data', (chunk) => {
    console.error(chunk.toString());
  });

  subprocess.on('error', (error) => {
    console.error(error);

    if (!res.headersSent) {
      res.status(500).json({
        error: 'Failed to start the download.'
      });
    } else {
      res.destroy(error);
    }
  });

  subprocess.on('close', (code) => {
    if (code !== 0 && !res.headersSent) {
      res.status(500).json({
        error: 'Failed to download this public video.'
      });
    }
  });

  res.on('close', () => {
    if (!res.writableEnded && !subprocess.killed) {
      subprocess.kill();
    }
  });
};
