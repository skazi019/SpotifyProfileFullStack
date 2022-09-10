import Transition from "./Transition";
import Login from "./Login";

export default function App() {

  const loginState = localStorage.getItem('isLoggedIn') || false

  return (
    <div className="App">
      {
        loginState ? <Transition /> : <Login />
      }
    </div>
  );
}
