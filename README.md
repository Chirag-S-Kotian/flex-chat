# Flex-Chat

Flex-Chat is an online chat web application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It allows users to engage in real-time text-based conversations with other users, providing a seamless and dynamic chatting experience.

## Features

- **Real-Time Chatting:** Engage in real-time conversations with other users without the need to refresh the page.
- **User Authentication:** Secure user authentication system allowing users to register, log in, and maintain their profiles.
- **User Profiles:** Users can customize their profiles with avatars, bios, and other relevant information.
- **Chat Rooms:** Users can create and join different chat rooms based on topics or interests.
- **Message History:** Access chat history to view past conversations and messages.
- **Responsive Design:** The application is designed to be responsive, ensuring a seamless experience across devices.

## Technologies Used

- **MongoDB:** NoSQL database used for storing user information, chat messages, and other data.
- **Express.js:** Web application framework used for building the backend server.
- **React.js:** JavaScript library used for building the user interface.
- **vite:** Build tool used for the React.js frontend for faster development and better performance.
- **Node.js:** JavaScript runtime environment used for running the backend server.
- **Socket.IO:** Library for real-time, bidirectional communication between web clients and servers.

## Installation

1. Clone the repository: `git clone https://github.com/Chirag-S-kotian/flex-chat.git`
2. Navigate to the project directory: `cd flex-chat`
3. Install dependencies for both the server and client:
   ```
   cd social-media
   npm install
   cd ../backend
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the `server` directory.
   - Define environment variables such as `MONGODB_URI`, `JWT_SECRET`, and `PORT`.
5. Start the server:
   ```
   cd ../backend
   npm start
   ```
6. Start the client:
   ```
   cd ../social-media
   npm run dev
   ```

## Usage

1. Register for an account or log in if you already have one.
2. Explore existing chat rooms or create your own.
3. Join chat rooms and start conversations with other users.
4. Customize your profile settings as desired.
5. Enjoy seamless real-time chatting with other users!

## Contributing

Contributions are welcome! If you'd like to contribute to Flex-Chat, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/my-feature`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add my feature'`).
5. Push to the branch (`git push origin feature/my-feature`).
6. Create a new pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- Thanks to the creators and maintainers of the MERN stack for providing the tools and technologies necessary to build Flex-Chat.
- Special thanks to the open-source community for their valuable contributions and support.

 Happy coding! 🚀