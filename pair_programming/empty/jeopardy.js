import axios from 'axios'

const submitAnswer = async (name, answer) => {
  try {
    const response = await axios.post(
      "https://post-request-jeopardy.vercel.app/api/game?action=submit",
      {
        name,
        answer,
      }
    );

    console.log("Server response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error submitting answer:",
      error.response?.data || error.message
    );
  }
};

submitAnswer("Kaylee",
    ""
)