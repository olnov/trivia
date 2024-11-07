export const getUser = async (id, token) => {
  if (!id || !token) {
    throw new Error("Missing user ID or token");
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/users/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
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

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/users`,
    requestOptions
  );
  if (response.status === 201) {
    return "User successfully registered";
  } else {
    throw new Error(`Error registering new user: ${response.status}`);
  }
};
