import * as filesystem from 'fs';
import { mailMap } from './mailmap.mjs';
import JSON5 from 'json5';

const fs = filesystem.promises;

// Function to check if a file exists asynchronously
async function checkFileExists(filePath) {
  try {
    await fs.access(filePath, fs.constants.F_OK);
    return true; // File exists
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false; // File does not exist
    }
    throw err; // Other error occurred
  }
}


const processRepository = async (repository) => {
  console.log(`-- Processing ${repository.dirname}`);

  // Read all the emails of the repository:
  const emails_filename = `../static/data/${repository.dirname}/emails.json`;
  const emails = JSON.parse(await fs.readFile(emails_filename, "utf8"));

  // If the email requested to mail their username to a different one, we need to
  // merge the data from the old username to the new one.
  for(const email of emails) {
    if (email === mailMap(email)) {
      continue;
    }
    console.log(`---- Merging ${email} into ${mailMap(email)}`);

    const old_file = `../static/data/${repository.dirname}/emails/${email}.json`;
    const new_file = `../static/data/${repository.dirname}/emails/${mailMap(email)}.json`;

    if (!await checkFileExists(new_file)) {
      console.log(`------ ${email}.json does not exist, renaming ${email}.json to ${mailMap(email)}.json`);
      await fs.rename(old_file, new_file);
      continue;
    }

    console.log(`------ ${email}.json exists, merging it into ${mailMap(email)}.json`);

    const old_data = JSON.parse(await fs.readFile(old_file, "utf8"));
    const new_data = JSON.parse(await fs.readFile(new_file, "utf8"));

    // Merge author data:
    for (const [key, value] of Object.entries(old_data.author)) {
      new_data.author[key] = value;
    }
    for (const [key, value] of Object.entries(old_data.review)) {
      new_data.review[key] = value;
    }

    // Write the new data:
    await fs.writeFile(new_file, JSON.stringify(new_data, null, 1));
  }

  // Update the emails.json file:
  const new_users = [...new Set(emails.map(mailMap))].sort();
  await fs.writeFile(emails_filename, JSON.stringify(new_users, null, 1));

  // Update the content of every files:
  for(const email of new_users) {
    const email_file = `../static/data/${repository.dirname}/emails/${email}.json`;
    const email_data = JSON.parse(await fs.readFile(email_file, "utf8"));

    // Update author data:
    for (const [time, reviewer] of Object.entries(email_data.author)) {
      email_data.author[time] = reviewer.map(mailMap);
    }

    // Update review data:
    for (const [time, author] of Object.entries(email_data.review)) {
      email_data.review[time] = mailMap(author);
    }

    // Write the new data:
    await fs.writeFile(email_file, JSON.stringify(email_data, null, 1));
  }
}


const main = async () => {
  const repositories_file = '../repositories.json5';
  const repositories = JSON5.parse(await fs.readFile(repositories_file, "utf8"));
  for (const repository of repositories) {
    await processRepository(repository);
  }
}

main();
