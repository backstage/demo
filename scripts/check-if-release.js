#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const fs = require('fs-extra');
const fetch = require('node-fetch');
const { EOL } = require('os');

async function getBackstageVersion() {
  const rootPath = path.resolve(__dirname, '../backstage.json');
  return fs.readJson(rootPath).then(_ => _.version);
}

async function main() {
  const [script, commitSha] = process.argv.slice(1);
  if (!commitSha) {
    throw new Error(`Argument must be ${script} <commit-sha>`);
  }

  // Check to see if commit has changes to the backstage.json file
  const response = await fetch(
    `https://api.github.com/repos/backstage/demo/commits/${commitSha}`,
  );

  if (!response.ok) {
    console.log(
      `Response from GitHub API for commit ${commitSha} failed with status ${response.status}`,
    );
    await fs.appendFile(process.env.GITHUB_OUTPUT, `is_release='false'${EOL}`);
    return;
  }

  const json = await response.json();
  const files = json.files;

  if (!files) {
    await fs.appendFile(process.env.GITHUB_OUTPUT, `is_release='false'${EOL}`);
    return;
  }

  const isRelease = files.some(file => file.filename === 'backstage.json');
  console.log(isRelease);
  await fs.appendFile(
    process.env.GITHUB_OUTPUT,
    `is_release=${isRelease}${EOL}`,
  );

  // Get the current Backstage version from the backstage.json file
  if (isRelease) {
    const backstageVersion = await getBackstageVersion();
    await fs.appendFile(
      process.env.GITHUB_OUTPUT,
      `current_version=${backstageVersion}${EOL}`,
    );
  }
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});
