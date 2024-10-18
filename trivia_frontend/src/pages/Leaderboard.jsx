import { Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaderboardState, setLeaderboardState] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error state

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("http://localhost:8080/topscores");
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }
      const data = await response.json();
      //   console.log({ data });

      // Convert response object to array
      const leaderboardArray = Object.entries(data);
      setLeaderboardState(leaderboardArray);
      //   console.log(leaderboardArray);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setError(error.message); // Set error message
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div>
      <h1>Leaderboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <ul>
          {leaderboardState.map((item, index) => (
            <li key={index}>
              {item[0]}: {item[1]}
            </li>
          ))}
          {/* {leaderboardState} */}
        </ul>
      )}
      <Button onClick={() => navigate("/home")}>Home</Button>
    </div>
  );
};

export default Leaderboard;
