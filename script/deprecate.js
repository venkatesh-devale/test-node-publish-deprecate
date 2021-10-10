#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = require('child_process').execSync;

try {
  const supportedVersions = new Set();
  const versions = exec('npm view test-node-publish-deprecate-sample versions --json').toString();
  versionsArray = Object.values(JSON.parse(versions));
  const latest = versionsArray[versionsArray.length-1];
  supportedVersions.add(latest);

  const secondLatest = versionsArray[versionsArray.length-2];
  supportedVersions.add(secondLatest);
  
  const currentMajorVersion = latest.split('.')[0];
  const indexOfLatestVersionOfLastMajorVersion = versionsArray.indexOf(`${currentMajorVersion}.0.0`)-1;
  const latestVersionOfLastMajorVersion = versionsArray[indexOfLatestVersionOfLastMajorVersion];
  supportedVersions.add(latestVersionOfLastMajorVersion);
  console.log(supportedVersions);
  const versionsToDeprecate = versionsArray.filter((version) => !supportedVersions.has(version));
  console.log(`Deprecating versions: ${JSON.stringify(versionsToDeprecate)}`);

  for (const version of versionsToDeprecate) {
    try {
      exec(`npm deprecate test-node-publish-deprecate-sample@${version} "Deprecating in favor of newer versions"`);
    } catch (error) {
      console.log(`Error deprecating ${version}, looks like already deprecated`);
    }
  }
} catch (error) {
  console.log(`Error deprecating versions: ${JSON.stringify()}, error:`, error);
}