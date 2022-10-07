import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";import './App.css';
import { Outlet } from "react-router";
import Auth from "./pages/auth/auth";
import Registration from "./pages/registration/registration";
import IdeasPage from "./pages/ideasPage/ideasPage";
import vkIcon from "./images/vk.png";
import instagramIcon from "./images/instagram.png";
import telegramIcon from "./images/telegram.png";



export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/auth" element={<Auth />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/ideas" element={<IdeasPage />} />
        </Route>
      </Routes>
    </Router>
  );
}


const Layout = () => {

  return (
    <div className="d-flex w-100 flexColumn">
      <header className="d-flex backSilver" style={{alignItems: 'center', height: '70px', padding: '5px 30px 5px 60px'}}>
        <Link className="cursorPoint textDecoration" to="/">It~For~People</Link>
        <div className="d-flex contentBetween" style={{width: '400px', marginLeft: 'auto'}}>
          <Link className="cursorPoint textDecoration" to="/registration">Регистрация</Link>
          <Link className="cursorPoint textDecoration" to="/auth">Авторизация</Link>
          <Link className="cursorPoint textDecoration" to="/ideas">Идеи</Link>
        </div>
      </header>

      <div className="d-flex w-100" style={{height: '100%', margin: '220px auto'}}>
        <Outlet />
      </div>

      <footer className="d-flex backSilver" style={{marginTop: 'auto', alignItems: 'center'}}>
        <div className="d-flex" style={{marginLeft: '60px'}}>
          <Link className="textDecoration" to="/">It~For~People</Link>
        </div>

        <div className="d-flex contentBetween" style={{marginLeft: 'auto', marginTop: '10px', marginBottom: '10px', marginRight: '30px', width: '200px'}}>
          <img src={vkIcon} className="icons cursorPoint" />
          <img src={telegramIcon} className="icons cursorPoint" />
          <img src={instagramIcon} className="icons cursorPoint" />
        </div>
      </footer>
    </div>
  );
}