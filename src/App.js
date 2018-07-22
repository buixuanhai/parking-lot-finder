import React, { Component } from "react";
import Loadable from "react-loadable";
import Loading from "./components/Loading";
import AddStory from "./screens/AddStory";
import { Switch } from "react-router";
import { Route } from "react-router";
import { ConnectedRouter } from "react-router-redux";
import { connect } from "react-redux";
import { history } from "./index";

const Home = Loadable({
  loader: () => import("./Home"),
  loading: Loading
});
const StoryDetail = Loadable({
  loader: () => import("./screens/StoryDetail"),
  loading: Loading
});
const Login = Loadable({
  loader: () => import("./screens/Login"),
  loading: Loading
});
const FavoriteStories = Loadable({
  loader: () => import("./screens/FavoriteStories"),
  loading: Loading
});

class App extends Component {
  render() {
    if (this.props.isAuthLoaded) {
      return (
        <ConnectedRouter history={history}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/stories/add" component={AddStory} />
            <Route exact path="/stories/favorite" component={FavoriteStories} />
            <Route exact path="/stories/:id" component={StoryDetail} />
            <Route exact path="/login" component={Login} />
            <Route component={() => <div>Not found</div>} />
          </Switch>
        </ConnectedRouter>
      );
    } else {
      return null;
    }
  }
}

export default connect(state => ({
  isAuthLoaded: state.firebase.auth.isLoaded
}))(App);
