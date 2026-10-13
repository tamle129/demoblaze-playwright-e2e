export function getCredentials() {
  const username = process.env.DEMOBLAZE_USERNAME;
  const password = process.env.DEMOBLAZE_PASSWORD;
  if (!username || !password) {
    throw new Error(
      'Set DEMOBLAZE_USERNAME and DEMOBLAZE_PASSWORD in .env. Use a registered DemoBlaze test account.'
    );
  }
  return { username, password };
}
