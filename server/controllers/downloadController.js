const youtubedl = require('yt-dlp-exec');
const { getVideoInfo } = require('../services/ytdlService');
const { AppError, mapYtDlpError } = require('../utils/errors');
const { getMimeType } = require('../utils/format');

const STDERR_BUFFER_LIMIT = 4096;

const sanitizeFilename = (value) =>
  String(value || 'vidsave-video')
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120) || 'vidsave-video';

exports.getMetadata = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    throw new AppError('URL is required', 400);
  }

  // getVideoInfo already returns normalized, deduped formats - pass them straight
  // through rather than re-deriving the labels a second time.
  res.json(await getVideoInfo(url));
};

exports.downloadVideo = async (req, res) => {
  const { url, formatId, title } = req.query;

  if (!url) {
    throw new AppError('URL is required', 400);
  }

  // Doubles as the URL allowlist check and as the source of truth for which
  // format ids are acceptable, so `formatId` can never be an arbitrary yt-dlp
  // format expression.
  const info = await getVideoInfo(url);

  const chosen = formatId
    ? info.formats.find((f) => f.format_id === formatId)
    : null;

  if (formatId && !chosen) {
    throw new AppError('That format is no longer available for this video.', 400);
  }

  const ext = chosen?.ext || 'mp4';
  const filename = `${sanitizeFilename(title || info.title)}.${ext}`;

  const subprocess = youtubedl.exec(
    url,
    {
      format: chosen ? chosen.format_id : 'best[ext=mp4]/best',
      output: '-',
      noWarnings: true,
      noPlaylist: true,
      restrictFilenames: true
    },
    {
      stdio: ['ignore', 'pipe', 'pipe']
    }
  );

  let streaming = false;
  let aborted = false;
  let stderr = '';

  subprocess.stderr?.on('data', (chunk) => {
    stderr = (stderr + chunk.toString()).slice(-STDERR_BUFFER_LIMIT);
  });

  // Headers are deferred until yt-dlp actually produces bytes. Setting them up
  // front would lock the response to video/mp4 and make any later error render
  // as a corrupt download instead of a readable JSON error.
  subprocess.stdout.once('data', () => {
    streaming = true;
    res.setHeader('Content-Type', getMimeType(ext));
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  });

  subprocess.stdout.pipe(res);

  res.on('close', () => {
    if (!res.writableEnded && !subprocess.killed) {
      aborted = true;
      subprocess.kill();
    }
  });

  // yt-dlp-exec returns an execa promise. Leaving it unhandled means a failed
  // download - or our own kill() above - becomes an unhandled rejection, which
  // terminates the process on Node 15+.
  try {
    await subprocess;

  } catch (error) {
    if (aborted || error.isCanceled || error.isTerminated) {
      return; // Client hung up; nothing to report.
    }

    console.error('[yt-dlp] download failed:', stderr || error.message);

    if (streaming || res.headersSent) {
      // Bytes are already on the wire, so the only honest signal left is to
      // break the connection and let the client see a truncated transfer.
      res.destroy();
      return;
    }

    throw mapYtDlpError(stderr || error.message);
  }
};
