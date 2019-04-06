/**
 *  Resolvers will be an Object.
 *  It will contain all the functionality for fetching data 
 *  and for changing data with our database.
 */

module.exports = {
  Query: {
    getUser: () => null
  },
  Mutation: {
    signupUser: async (_, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error('User already exists');
      }
      const newUser = await new User({
        username,
        email,
        password
      }).save();
      return newUser;
    }
  }
}