/** @type {import('semantic-release').GlobalConfig} */
export default {
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    [
      "@semantic-release/exec",
      {
        // Publish to JSR with token authentication
        publishCmd:
          'deno run -A jsr:@jsr/octane publish --token "$JSR_TOKEN" --version ${nextRelease.version}',
      },
    ],
    "@semantic-release/git",
  ],
};
