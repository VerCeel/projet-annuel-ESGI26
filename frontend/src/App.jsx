import { useEffect, useState } from "react";
import api from "./services/api";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/test").then((response) => {
      setMessage(response.data?.message ?? "");
    });
  }, []);

  return (
    <div>
      <h1>Test API</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
