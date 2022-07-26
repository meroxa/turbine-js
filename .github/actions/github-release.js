const { Octokit } = require("@octokit/action");

const octokit = new Octokit();
const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
const tag = process.env.TAG;

octokit.repos
  .createRelease({
    owner,
    repo,
    tag_name: tag,
    generate_release_notes: true,
  })
  .then(
    () => {
      console.log(`Github Release created for tag ${tag}`);
    },
    (error) => {
      process.exitCode = 1;
      console.error(error.message);
    }
  );
