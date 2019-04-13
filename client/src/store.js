import Vue from 'vue';
import Vuex from 'vuex';

import { gql } from 'apollo-boost';
import { defaultClient as apolloClient } from './main';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: []
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    }
  },
  actions: {
    getPosts: ({ commit }) => {
      // Use ApolloClient to fire getPosts query
      apolloClient
        .query({
          query: gql`
            query {
              getPosts {
                _id
                title
                imageUrl
              }
            }
          `
        })
        .then(({ data }) => {
          // Get data from actions to state via mutations
          // Commit passes data from actions along to mutation functions
          commit('setPosts', data.getPosts);
          console.log(data.getPosts);
        })
        .catch(err => {
          console.err(err);
        });
    }
  },
  getters: {
    posts: state => state.posts
  }
});
