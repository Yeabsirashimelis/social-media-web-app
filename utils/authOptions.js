import Profile from "@/components/Profile";
import connectDB from "@/config/database";
import User from "@/models/user";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
        httpOptions: {
          timeout: 10000, // Increase to 10 seconds
        },
      },
    }),
  ],
  callbacks: {
    // Invoked on successful sign-in
    async signIn({ profile }) {
      // 1. Connect to the database
      await connectDB();

      // 2. Check if the user exists
      let user = await User.findOne({ email: profile.email });

      // 3. If the user doesn't exist, create a new one
      if (!user) {
        // Truncate the name to a max length and use the first part of the name
        const firstName = profile.name.split(" ")[0].slice(0, 20);

        // Create the user in the database first to generate an _id
        user = await User.create({
          email: profile.email,
          name: profile.name,
          profilePicture: profile.picture,
        });

        // 4. Generate username by appending the user ID to the first name
        const username = `${firstName}${user._id}`;

        // 5. Update the user with the newly generated username
        user.username = username;
        await user.save();
      }

      // 6. Allow sign-in
      return true;
    },

    // Modify the session object
    async session({ session }) {
      // 1. Get the user from the database
      const user = await User.findOne({ email: session.user.email });

      // 2. Assign the user ID and profile completion status to the session
      session.user.id = user._id.toString();
      session.user.username = user.username;
      session.user.isProfileComplete =
        !!user.bio && !!user.interestedIn && !!user.phoneNumber;

      // 3. Return the session
      return session;
    },
  },
};
