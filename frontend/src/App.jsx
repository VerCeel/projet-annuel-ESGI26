import { useEffect, useState } from "react";
import api from "./services/api";
import { Button } from "./components/ui/button";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/test").then((response) => {
      setMessage(response.data?.message ?? "");
    });
  }, []);

  return (
    <div className="">
      <h1>Test API</h1>
      <p>{message}</p>
      <Button>Click here</Button>
    </div>
  );
}

export default App;
