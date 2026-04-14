/** @type {import('semantic-release').GlobalConfig} */
export default {
  branches: ['main'],
  dryRun: process.env.DRY_RUN === 'true',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/npm',
      {
        trustedPublish: true,
      },
    ],
    [
      '@semantic-release/exec',
      {
        // Publish to JSR with OIDC authentication (--github flag)
        publishCmd: 'deno run -A jsr:@jsr/octane publish --github --version ${nextRelease.version}',
      },
    ],
    '@semantic-release/git',
  ],
};
