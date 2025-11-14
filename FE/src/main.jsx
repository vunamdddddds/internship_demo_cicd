import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "~/App.jsx";
const googleClientId =
  "326777715327-qb3bsvljrndjh6vhu8f069qov1lsdspi.apps.googleusercontent.com"; // tạm thời hard code - thay bằng google client id của bạn 
createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={googleClientId}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
);                                          