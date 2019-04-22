import Vue from 'vue';
import Vuex from 'vuex';
import router from './router';

import { defaultClient as apolloClient } from './main';

import { GET_POSTS, SIGNIN_USER, GET_CURRENT_USER } from './queries';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    clearUser: state => (state.user = null),
    clearError: state => (state.error = null)
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit('setLoading', true);
      apolloClient
        .query({
          query: GET_CURRENT_USER
        })
        .then(({ data }) => {
          commit('setLoading', false);
          // Add user data to state
          commit('setUser', data.getCurrentUser);
          console.log('TCL: data', data.getCurrentUser);
        })
        .catch(err => {
          commit('setLoading', false);
          console.error(err);
        });
    },
    getPosts: ({ commit }) => {
      commit('setLoading', true);
      // Use ApolloClient to fire getPosts query
      apolloClient
        .query({
          query: GET_POSTS
        })
        .then(({ data }) => {
          // Get data from actions to state via mutations
          // Commit passes data from actions along to mutation functions
          commit('setPosts', data.getPosts);
          commit('setLoading', false);
        })
        .catch(err => {
          commit('setLoading', false);
          console.error(err);
        });
    },
    signinUser: ({ commit }, payload) => {
      commit('clearError');
      commit('setLoading', true);
      // Clear token to prevent errors (if malformed)
      localStorage.setItem('token', '');
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit('setLoading', false);
          localStorage.setItem('token', data.signinUser.token);
          // To make sure created method is run in main.js (we run getCurrentUser), reload the page
          router.go();
        })
        .catch(err => {
          commit('setLoading', true);
          commit('setError', err);
          console.error(err);
        });
    },
    signoutUser: async ({ commit }) => {
      // Clear user in state
      commit('setUser');
      // Remove token in localStorage
      localStorage.setItem('token', '');
      // End session
      await apolloClient.resetStore();
      // Redirect home - kick users out of private pages (i.e. profile)
      router.push('/');
    }
  },
  getters: {
    posts: state => state.posts,
    user: state => state.user,
    loading: state => state.loading,
    error: state => state.error
  }
});
