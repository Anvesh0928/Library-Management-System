export const getAuth = () => {
  const stored = localStorage.getItem("library_auth");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

