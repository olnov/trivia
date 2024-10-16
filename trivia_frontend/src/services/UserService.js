const BACKEND = "http://localhost:8080";

export const getUsers = async ()=> {
    const response = await fetch(`${BACKEND}/users`, {
        method: 'GET'
    });

    if (response.status === 200) {
    const data = await response.json();
    return data;
    }else{
        throw new Error(`Error: ${response.status}`);
    }
} 
