import Home from "./Home";
import Login from "./Login";

export default function App() {

  const loginState = localStorage.getItem('isLoggedIn') || false

  return (
    <div className="App">
      {
        loginState ? <Home /> : <Login />
      }
    </div>
  );
}
