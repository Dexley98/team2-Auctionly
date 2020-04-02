import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import AddItemForm from "./AddItemForm";
import ReportLog from "./Report";
import WinnerLog from "./WinnerLog";

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/addItem">Add an Item</Link>
            </li>
            <li>
              <Link to="/winnerLog">Winner Log</Link>
            </li>
            <li>
              <Link to="/reportLog">Report Log</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/addItem" component={AddItemForm} />
          <Route path="/winnerLog" component={WinnerLog} />
          <Route path="/reportLog" component={ReportLog} />
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return <h1>Other Items TBD </h1>;
}
