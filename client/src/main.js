import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';

import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';

import FormAlert from './components/shared/FromAlert';

// Register Global Component
Vue.component('form-alert', FormAlert);

Vue.use(VueApollo);

// Setup ApolloClient
export const defaultClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  // Include auth token with requests made to backend
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
    // If no token with key of 'token' in localStorage, add it
    if (!localStorage.token) {
      localStorage.setItem('token', '');
    }

    // operation adds the token to an authorization header, which is sent to backend
    operation.setContext({
      headers: {
        authorization: localStorage.getItem('token')
      }
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log('TCL: networkError', networkError);
    }

    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.dir(err);
        if (err.name === 'AuthenticationError') {
          // Set auth error in state (to show in snackbar)
          store.commit('setAuthError', err);
          // signout user (to clear token)
          store.dispatch('signoutUser');
        }
      }
    }
  }
});

const apolloProvider = new VueApollo({ defaultClient });

Vue.config.productionTip = false;

new Vue({
  apolloProvider,
  router,
  store,
  render: h => h(App),
  created() {
    // Execute getCurrentUser query
    this.$store.dispatch('getCurrentUser');
  }
}).$mount('#app');
