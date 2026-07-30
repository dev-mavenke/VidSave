import PageShell from "../components/PageShell";

export default function Terms() {
  return (
    <PageShell
      title="Terms of Use"
      lede="Public content only, and you are responsible for what you save."
    >
      <h2>Acceptable use</h2>
      <p>
        VidSave is intended for public media. You are responsible for making sure you
        have the right to download or save any content you request, and for complying
        with the terms of service of the platform it came from.
      </p>

      <h2>Copyright</h2>
      <p>
        Downloading a video does not give you rights to redistribute it. Respect the
        copyright of the people who made the content you are saving.
      </p>

      <h2>Availability</h2>
      <p>
        VidSave is provided as-is, with no guarantee of uptime or of any particular
        link working. Platforms change their systems frequently, and downloads may
        fail without notice.
      </p>

      <h2>Limits</h2>
      <p>
        Requests are rate-limited to keep the service usable for everyone. Automated
        or bulk scraping is not supported.
      </p>
    </PageShell>
  );
}
