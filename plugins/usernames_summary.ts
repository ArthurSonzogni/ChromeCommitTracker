const cache = new Map();

const fetchData = async (repo) => {
  const response = await fetch(`/data/${repo}/usernames_summary.json`);
  if (response.status != 200) {
    return {}
  }
  return await response.json();
}

const usersInfo = async repo => {
  if (!cache.has(repo)) {
    cache.set(repo, await fetchData(repo));
  }
  return await cache.get(repo);
}

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('usersInfo', usersInfo)
})

