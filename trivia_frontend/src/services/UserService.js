export const getUsers = async () => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users`, {
    method: "GET",
  });

  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    throw new Error(`Error: ${response.status}`);
  }
};

export const login = async (email, password) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/login`,
    requestOptions
  );
  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    throw new Error(`Authentication failed: ${response.status}`);
  }
};

export const signUp = async (fullName, email, password) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ fullName, email, password }),
  };

  const response = await fetch(`${BACKEND}/users`, requestOptions);
  if (response.status === 201) {
    return "User successfully registered";
  } else {
    throw new Error(`Error registering new user: ${response.status}`);
  }
};
