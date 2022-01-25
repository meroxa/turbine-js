const poll = require("./poller");
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_AUTH_TOKEN,
});

exports.triggerWorkflowRun = async () => {
  const date = new Date();

  await octokit.repos.createDispatchEvent({
    owner: process.env.GITHUB_REPO_PREFIX,
    repo: process.env.GITHUB_REPO_NAME,
    event_type: "meroxa_deploy",
  });

  const workflowRunsRequest = async () => {
    return await octokit.actions.listWorkflowRunsForRepo({
      owner: process.env.GITHUB_REPO_PREFIX,
      repo: process.env.GITHUB_REPO_NAME,
      created: `> ${date.toISOString()}`,
      branch: "master",
      event: "repository_dispatch",
      status: "in_progress",
    });
  };

  const workflowRunsPoller = await poll({
    fn: workflowRunsRequest,
    validate(res) {
      return res.data.workflow_runs.length > 0;
    },
    interval: 10000,
    maxAttempts: 20,
  });

  return workflowRunsPoller.data.workflow_runs[0].id;
};

exports.waitForWorkflowRun = async (runID) => {
  const workflowRunRequest = async () => {
    return await octokit.actions.getWorkflowRun({
      owner: process.env.GITHUB_REPO_PREFIX,
      repo: process.env.GITHUB_REPO_NAME,
      run_id: runID,
    });
  };

  const workflowRunPoller = await poll({
    fn: workflowRunRequest,
    validate(res) {
      return res.data.status != "in_progress";
    },
    interval: 10000,
    maxAttempts: 50,
  });

  return workflowRunPoller.data.head_sha;
};
