export const getUser = async (id, token)=> {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
    });

    if (response.status === 200) {
    const data = await response.json();
    return data;
    }else{
        throw new Error(`Error: ${response.status}`);
    }
} 

export const login = async (email, password)=> {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-type':'application/json'
        },
        body: JSON.stringify({email, password}),
    };

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, requestOptions);
    if (response.status === 200) {
        const data = await response.json();
        return data;
    } else {
        throw new Error(`Authentication failed: ${response.status}`);
    }
}

export const signUp = async (fullName, email, password) => {
    const requestOptions = {
        method: 'POST',
        headers:{
            'Content-type':'application/json'
        },
        body: JSON.stringify({fullName, email, password}),
    };

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users`, requestOptions);
    if (response.status === 201) {
        return "User successfully registered";
    } else {
        throw new Error(`Error registering new user: ${response.status}`);
    }
}


export const updateUserProfile = async (id, token, fullName, password)=> {
    const requestOptions = {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({fullName, password}), 
    };

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${id}`, requestOptions);
    if (response.status === 200) {
        return "User successfully updated";
    } else {
        throw new Error(`Error updating user: ${response.status}`);
    }
}


export const isAuthenticated = () => {
    const token = localStorage.getItem("token"); // Assume JWT token is stored in localStorage
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode token payload
        const currentTime = Date.now() / 1000; // Get current time in seconds
        return payload.exp > currentTime; // Check if token is expired
      } catch (error) {
        console.error("Error: ", error);
        return false;
      }
    }
    return false;
  };

// Search

export const searchPlayers = async (partialName) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({partialName}),
    };

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/search`, requestOptions);
    if (response.status === 200) {
        const data = await response.json();
        return data;
    } else {
        throw new Error(`Search failed: ${response.status}`);
    }
}