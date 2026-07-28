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
    return String(format.quality);
  }

  if (format.format_note && format.format_note !== 'unknown') {
    return format.format_note;
  }

  return 'Standard Quality';
};

const MIME_TYPES = {
  mp4: 'video/mp4',
  m4v: 'video/mp4',
  mov: 'video/quicktime',
  webm: 'video/webm',
  mkv: 'video/x-matroska',
  flv: 'video/x-flv',
  '3gp': 'video/3gpp',
  m4a: 'audio/mp4',
  mp3: 'audio/mpeg',
  opus: 'audio/opus',
  ogg: 'audio/ogg',
  wav: 'audio/wav'
};

const getMimeType = (ext) =>
  MIME_TYPES[String(ext || '').toLowerCase()] || 'application/octet-stream';

const formatBytes = (bytes) => {
  const value = Number(bytes);

  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(
    Math.floor(Math.log(value) / Math.log(1024)),
    units.length - 1
  );
  const size = value / 1024 ** exponent;

  return `${size >= 10 || exponent === 0 ? Math.round(size) : size.toFixed(1)} ${units[exponent]}`;
};

module.exports = { getHeightFromText, getQualityLabel, getMimeType, formatBytes };
