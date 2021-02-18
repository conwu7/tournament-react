import {useState, useEffect} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    // Link,
    Redirect,
    useParams
} from "react-router-dom";
import NavBar from "./components/navbar";
import SignUp from "./components/pages/sign-up";
import Login from "./components/pages/login";
import {fetchApi} from "./helpers/common";

import appStyle from './stylesheets/app.module.scss';
import './stylesheets/reset.css';
import WaitForServer from "./components/loading";
import MyTournaments from "./components/pages/my-tournaments";
import Tournament from "./components/pages/tournament";
import CreateNew from "./components/pages/create-new";
import Search from "./components/pages/search";

function App() {
    const [user, setUser] = useState('');
    const [isUserCheckDone, setUserCheckDone] = useState(false);
    const [waiting, setWaitForServer] = useState(false);
    // Get user details
    const getUserDetails = async () => {
        try {
            setWaitForServer(true);
            const user = await fetchApi('users/currentUser', 'get');
            setUser(user.username);
        } catch (e) {
            if (e === 'no-user') setUser("");
        } finally {
            setTimeout(()=>{
                setWaitForServer(false)
                setUserCheckDone(true);
            },200);
        }
    }
    useEffect(() => {
        getUserDetails()
            .catch(e => console.log(e))
    }, []);
    return (
        <div className={`App app ${appStyle.app}`} id="app">
            <WaitForServer wait={waiting} />
            <Router>
              <NavBar user={user}/>
              <div className={appStyle.belowNavBarContainer} id="mainContent">
                  {
                      isUserCheckDone &&
                      <Switch>
                          <Route path="/signup">
                              {user && <Redirect to="/" />}
                              <SignUp />
                          </Route>
                          <Route path="/login">
                              {user && <Redirect to="/" />}
                              <Login />
                          </Route>
                          <Route path="/search">
                                <Search />
                          </Route>
                          <Route path="/new">
                              <CreateNew user={user} />
                          </Route>
                          <Route path="/tournament/:id">
                              <TournamentIdHandler user={user}/>
                          </Route>
                          <Route path="/">
                              <MyTournaments user={user} />
                          </Route>
                      </Switch>
                  }
              </div>
            </Router>
        </div>
    );
}

function TournamentIdHandler (props) {
    const {id} = useParams();
    return <Tournament tournamentId={id} user={props.user}/>
}

export default App;
