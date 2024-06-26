import * as filesystem from "fs";
import { execSync } from "child_process";
import JSON5 from "json5";
const fs = filesystem.promises;

const repositories_file = "../repositories.json5";

const RelativeDate = (days) => {
  let date = new Date();
  date.setTime(date.getTime() - days * (24 * 60 * 60 * 1000));
  return date;
};

const task_time = {
  "1w": { min: RelativeDate(7), max: RelativeDate(0) },
  "1m": { min: RelativeDate(30), max: RelativeDate(0) },
  "3m": { min: RelativeDate(90), max: RelativeDate(0) },
  "6m": { min: RelativeDate(180), max: RelativeDate(0) },
  "1y": { min: RelativeDate(365), max: RelativeDate(0) },
  "1y+1y": { min: RelativeDate(365 * 2), max: RelativeDate(365) },
  "1y+2y": { min: RelativeDate(365 * 3), max: RelativeDate(365 * 2) },
  "1y+3y": { min: RelativeDate(365 * 4), max: RelativeDate(365 * 3) },
  "1y+4y": { min: RelativeDate(365 * 5), max: RelativeDate(365 * 4) },
  forever: { min: RelativeDate(365 * 100), max: RelativeDate(0) },
};

async function Main() {
  const repositories = JSON5.parse(
    await fs.readFile(repositories_file, "utf8")
  );

  let task_repo = { all: [] };
  for (const repository of repositories) {
    task_repo[repository.dirname] = [repository];
    if (repository.cone == undefined) {
      task_repo["all"].push(repository);
    }
  }

  for (const repos in task_repo) {
    for (const date in task_time) {
      const file_name = `../graph/build/${repos}_${date}.csv`;
      const svg_file = `../public/community-map/${repos}_${date}.svg`;
      console.log(`Processing ${file_name}`);

      const output = {};
      for (const repository of task_repo[repos]) {
        await ProcessRepository(
          repository,
          task_time[date].min,
          task_time[date].max,
          output
        );
      }

      // Delete username with low number of reviewers.
      for (const user in output) {
        if (Object.keys(output[user]).length <= 2) {
          delete output[user];
        }
      }

      // Print as CSV.
      let file_content = "";
      for (const user in output) {
        for (const reviewer in output[user]) {
          file_content += `${user},${reviewer},${output[user][reviewer]}\n`;
        }
      }

      // Write to file.
      await fs.writeFile(file_name, file_content);

      // Generate the svg graph, by calling the c++ program.
      const command = `../graph/build/generate ${file_name} ${svg_file}`;
      console.log(`Running ${command}`);
      execSync(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`execSync error: ${error}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        if (stdout) {
          console.log(`stdout: ${stdout}`);
          return;
        }
      });
    }
  }
}

async function ProcessRepository(repository, date_min, date_max, output) {
  const usernames_file = `../public/data/${repository.dirname}/usernames.json`;
  const usernames_dir = `../public/data/${repository.dirname}/usernames`;
  const username = JSON.parse(await fs.readFile(usernames_file, "utf8"));

  for (const user of username) {
    output[user] ||= {};

    const json = await fs.readFile(`${usernames_dir}/${user}.json`, "utf8");
    const data = JSON.parse(json);
    for (const commit of data) {
      if (new Date(commit.date) < date_min) continue;
      if (new Date(commit.date) > date_max) continue;
      if (commit.kind != "author") continue;
      for (const reviewer of commit.peers) {
        output[user][reviewer] ||= 0;
        output[user][reviewer]++;
      }
    }
  }
}

// Call the Main function to run the action
Main();
