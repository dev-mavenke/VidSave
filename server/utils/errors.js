class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.expected = true;
  }
}

const UNSUPPORTED_LINK_MESSAGE =
  'Unsupported link. Paste a public TikTok, Instagram, Twitter/X, or YouTube video URL.';

// yt-dlp reports failures as free-form stderr text. Match the common signatures so
// the UI can show something actionable instead of a generic failure.
const YTDLP_ERROR_SIGNATURES = [
  {
    test: /age[-\s]?restricted|sign in to confirm your age|confirm your age/i,
    message: "This video is age-restricted and can't be fetched.",
    status: 403
  },
  {
    test: /not available in your country|geo[-\s]?(restricted|blocked)|blocked it in your country/i,
    message: "This video is blocked in the server's region.",
    status: 451
  },
  {
    test: /HTTP Error 429|Too Many Requests|rate[-\s]?limit/i,
    message: 'The platform is rate-limiting us right now. Try again shortly.',
    status: 429
  },
  {
    test: /private video|login required|sign in|requires authentication|cookies/i,
    message: 'This video is private or requires a login.',
    status: 403
  },
  {
    test: /video unavailable|has been removed|does not exist|no longer available|not found|404/i,
    message: 'That video is unavailable or has been removed.',
    status: 404
  },
  {
    test: /unsupported url|no video formats found|unable to extract/i,
    message: "Couldn't find a downloadable video at that link.",
    status: 422
  },
  {
    test: /timed out|timeout|network is unreachable|temporary failure in name resolution/i,
    message: 'The platform took too long to respond. Try again.',
    status: 504
  }
];

const mapYtDlpError = (details) => {
  const text = String(details || '');

  const match = YTDLP_ERROR_SIGNATURES.find((signature) => signature.test.test(text));

  if (match) {
    return new AppError(match.message, match.status);
  }

  return new AppError(
    "Couldn't fetch this link. Make sure it's public and supported.",
    502
  );
};

module.exports = { AppError, mapYtDlpError, UNSUPPORTED_LINK_MESSAGE };
