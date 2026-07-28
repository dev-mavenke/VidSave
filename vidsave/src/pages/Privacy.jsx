import PageShell from "../components/PageShell";

export default function Privacy() {
  return (
    <PageShell
      title="Privacy"
      lede="No accounts, no profiles, no tracking pixels."
    >
      <h2>What we collect</h2>
      <p>
        No accounts and no social profile connections are required or supported, so
        there is nothing to sign up for and no profile attached to your activity.
      </p>

      <h2>What happens to the links you paste</h2>
      <p>
        A submitted URL is used only to fetch that video's public metadata and to
        stream the file you choose. Links are processed in memory for the duration of
        the request and are not written to a database. Downloaded video data passes
        through the server without being saved.
      </p>

      <h2>Logs</h2>
      <p>
        Ordinary server logs may record failed requests so problems can be diagnosed.
        These are operational records, not a profile of you, and they are not sold or
        shared.
      </p>

      <h2>Third parties</h2>
      <p>
        Fetching a video necessarily contacts the platform hosting it. That platform's
        own privacy practices apply to the request, and they are outside our control.
      </p>
    </PageShell>
  );
}
