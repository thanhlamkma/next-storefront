const pathMatched = (location: string, path: string, exact = false) => {
  const locationParts = location.split("/");
  const pathParts = path.split("/");

  if (
    pathParts.length > locationParts.length ||
    (exact && pathParts.length !== locationParts.length)
  ) {
    return false;
  }

  for (let index = 0; index < pathParts.length; index++) {
    const part = pathParts[index];
    if (part.match(/:([\w\W]+)/gi)) {
      continue;
    }

    if (part !== locationParts[index]) {
      return false;
    }
  }

  return true;
};

export default pathMatched;
