export const fetchQuestions = async (retryCount = 0, difficulty) => {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&type=multiple`
    );
    if (!response.ok) {
      if (retryCount < 3) {
        // console.log(`Retrying fetch: Attempt ${retryCount + 1}`);
        //   return fetchQuestions(retryCount + 1); // Retry fetching questions
        console.log("");
      } else {
        throw new Error("Failed to fetch questions after multiple attempts.");
      }
    }
    const data = await response.json();
    //   console.log({ data });
    return data.results;

    // setQuestions(data.results);
    // setAnswers(
    //   shuffleAnswers(
    //     data.results[0].correct_answer,
    //     data.results[0].incorrect_answers
    //   )
    // );
  } catch (err) {
    // setError(err.message || "Failed to fetch questions.")
    console.error(err);
  }
};
