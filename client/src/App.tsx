import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home/Home";
import SignUp from "./pages/SignUp/SignUp";
import SignIn from "./pages/SignIn/SignIn";
import Favourites from "./pages/Favourites/Favourites";
import CategoryPage from "./pages/Category/CategoryPage";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route
            path="/favourites"
            element={
              <ProtectedRoute>
                <Favourites />
              </ProtectedRoute>
            }
          />
          {[
            "general",
            "business",
            "health",
            "science",
            "sports",
            "technology",
          ].map((category) => (
            <Route
              key={category}
              path={`/${category}`}
              element={<CategoryPage category={category} />}
            />
          ))}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
