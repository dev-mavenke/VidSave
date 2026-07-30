import PageShell from "../components/PageShell";

export default function About() {
  return (
    <PageShell
      title="About VidSave"
      lede="A no-login tool for saving public videos from the platforms you already use."
    >
      <p>
        VidSave exists because saving a public clip should not mean wading through
        pop-ups, fake download buttons, or an installer you did not ask for. Paste a
        link, pick a quality, get the file.
      </p>

      <h2>How it works</h2>
      <p>
        When you submit a link, the server asks the platform for that video's public
        metadata and returns the list of available formats. Choosing one streams the
        file straight through to your browser - nothing is stored on the server, and
        there is no queue or waiting room.
      </p>

      <h2>What it will not do</h2>
      <p>
        VidSave only reads content that is already publicly visible. It cannot and
        will not access private posts, age-gated videos, or anything that requires
        signing in. It never asks for your platform credentials, because it never
        needs them.
      </p>
    </PageShell>
  );
}
