const data = [
  {"old":"jotrem@microsoft.com","new":"JCTremoulet@gmail.com"},
  {"old":"abdulras@fb.com","new":"compnerd@compnerd.org"},
  {"old":"abdulras@google.com","new":"compnerd@compnerd.org"},
  {"old":"hans@chromium.org","new":"hans@hanshq.net"},
  {"old":"minyihh@uci.edu","new":"min@myhsu.dev"},
  {"old":"qiucf@cn.ibm.com","new":"qiucofan@cn.ibm.com"},
  {"old":"reid@kleckner.net","new":"rnk@google.com"},
  {"old":"nicolasweber@gmx.de","new":"thakis@chromium.org"},
  {"old":"clemensh@chromium.org","new":"clemensb@chromium.org"},
  {"old":"jgruber@google.com","new":"jgruber@chromium.org"},
  {"old":"jonathan@codesourcery.com","new":"jonathan_roelofs@apple.com"},
  {"old":"jroelofs@jroelofs.com","new":"jonathan_roelofs@apple.com"},
  {"old":"jthackray@users.noreply.github.com","new":"jonathan.thackray@arm.com"},
  {"old":"m.i.b@apple.com","new":"ismail@bennani.ma"},
  {"old":"medismail.bennani@gmail.com","new":"ismail@bennani.ma"},
  {"old":"timothygu99@gmail.co","new":"timothygu@chromium.org"},
  {"old":"oToToT@users.noreply.github.com","new":"ty1208chiang@gmail.com"},
];

const map = new Map();
for (const entry of data) {
  // Take the username out of the email:
  const old_username = entry.old.split("@")[0];
  const new_username = entry.new.split("@")[0];
  map.set(old_username.toLowerCase(), new_username.toLowerCase());
}

export function mailMap(username) {
  username = username.toLowerCase();

  // Check if the username contains invalid characters:
  if (username.match(/[^a-z0-9!#$%&'*+\-=?^_`{|}~.]/)) {
    username = "deleted";
  }

  // Remove the (<number>+)<username> prefix from the username:
  const match = username.match(/^(?:\d+\+)?(.*)$/);
  if (match) {
    username = match[1];
  }

  if (map.has(username)) {
    return map.get(username);
  }
  return username;
}