/** @type {import('semantic-release').GlobalConfig} */
export default {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/npm',
      {
        npmPublish: 'restricted',
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
