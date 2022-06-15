const {AuthenticationError} = require('apollo-server-express');
const {User} = require('../../models');
const {signToken} = require('../../utils/auth');

const resolvers = {
    Query: {
        users: async () => await User.find({}),

        user: async (_, {userId}) => {
            return await User.findOne({_id: userId});
        },

        me: async (_, args) => {
            // if (context?.user) {
            //     TODO: incorporate context.user into this query
            //     return await User.findOne({ _id: context.user._id });
            // }
            return await User.findOne({ _id: "62978f70d9dc014c69a7f017"});
            // throw new AuthenticationError('You need to be logged in!');
        }
    },

    Mutation: {
        login: async (_, {email, password}) => {
            const user = await User.findOne( { email } );

            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }

            const isCorrectPw = await user.isCorrectPassword(password);

            if (!isCorrectPw) {
                throw new AuthenticationError('Incorrect Credentials');
            }

            const token = signToken(user);
            return {token, user};
        },

        createUser: async (_, {username, email, password}) => {
            const user = await User.create( { username, email, password } );
            const token = signToken(user);
            return { token, user };
        },

        delete_book: async (_, { bookId }, context) => {
            const user = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
              );
              if (!user) {
                throw new Error('Error accessing/updating user record');
              }
              return user;
        },

        save_book: async (_, {bookInput}, context ) => {

            try {
                const user = await User.findOneAndUpdate(
                    // TODO: use context instead of hardcoding _id field below
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: bookInput } },
                    { new: true, runValidators: true }
                );
                return user;
              } catch (err) {
                throw new Error(err);
              }
        }
    }
};

module.exports = resolvers;