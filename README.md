# Brzojav

Brzojav is a real-time web messaging application that allows users to exchange text messages and multimedia content. The frontend is implemented as a Single Page Application (SPA) using Vue.js and communicates with the Brzojav backend through a REST API and Socket.IO.

The application also supports direct peer-to-peer communication between users using WebRTC DataChannels. Socket.IO is used for real-time notifications and WebRTC signaling, while the backend is used for persistent data storage and as a fallback when a direct peer-to-peer connection cannot be established.

## Live Application

[Brzojav](https://brzojav.vercel.app/)

## Backend

The backend repository is available here:

[Brzojav Backend](https://github.com/AlenOrbanic/Brzojav-backend)

## Technologies

- **Vue.js 3** – frontend framework
- **Vue Router** – client-side routing
- **Socket.IO Client** – real-time communication and WebRTC signaling
- **WebRTC** – direct peer-to-peer communication
- **Sass** – stylesheet preprocessing
- **Vue CLI** – development and production tooling

## Features

- User registration and login
- Google authentication
- One-to-one conversations
- Group conversations
- Real-time messaging
- Direct peer-to-peer messaging using WebRTC
- Direct peer-to-peer file transfers
- Sending images, videos, and other files
- Message replies
- Message deletion
- Message reactions
- Pinned messages
- User profiles
- Profile customization
- User blocking
- Last-seen status
- Notifications
- Theme selection
- Link previews
- Automatic fallback to the backend when a peer-to-peer connection is unavailable

## Project Structure

```text
Brzojav/
├── public/                 # Public static files
├── src/
│   ├── api/
│   │   ├── index.js        # REST API client
│   │   └── seedClient.js   # Seed-node registration and lookup
│   │
│   ├── assets/             # Application assets
│   ├── components/         # Reusable Vue components
│   ├── p2p/
│   │   └── peerConnection.js # WebRTC peer connections
│   ├── router/
│   │   └── index.js        # Vue Router configuration
│   ├── views/
│   │   ├── HomeView.vue    # Main messaging interface
│   │   └── Login.vue       # Login and registration
│   ├── App.vue             # Root Vue component
│   └── main.js             # Application entry point
│
├── package.json
├── vue.config.js
└── README.md
```

The frontend separates API communication, WebRTC functionality, reusable components, routing, and application views into separate modules.

## Installation

### Prerequisites

Make sure the following are installed:

- [Node.js](https://nodejs.org/)
- npm
- A running instance of the Brzojav backend

### Clone the repository

```bash
git clone https://github.com/AlenOrbanic/Brzojav.git
cd Brzojav
```

### Install dependencies

```bash
npm install
```

## Configuration

The frontend uses the `VUE_APP_API_URL` environment variable to specify the backend URL.

Create a `.env` file in the project root:

```env
VUE_APP_API_URL=http://localhost:3001
```

If the variable is not provided, the application defaults to:

```text
http://localhost:3001
```

The API client uses this address for REST requests.

The frontend's seed-node client currently uses three seed nodes:

```text
http://localhost:3001
http://localhost:3002
http://localhost:3003
```

These nodes are used to register users, maintain their online status, and look up other users for peer-to-peer connections.

## Running the Application

### Development

Start the development server with:

```bash
npm run serve
```

The application will normally be available at:

```text
http://localhost:8080
```

### Production Build

To create a production build:

```bash
npm run build
```

The generated production files can then be deployed to a static web hosting service.

## Communication Architecture

Brzojav uses a hybrid communication model.

### REST API

The frontend uses the backend REST API for operations such as:

- authentication
- user profiles
- chat management
- retrieving message history
- storing messages
- file uploads
- reactions
- message deletion
- user management
- link previews

The API client automatically includes the JWT access token in authenticated requests.

### Socket.IO

Socket.IO provides real-time communication between the frontend and backend.

It is primarily used for:

- WebRTC signaling
- notifying users about new messages
- updating chat previews
- notifying clients about changes to messages and chats

The server does not use Socket.IO as the primary transport for the contents of peer-to-peer messages. Instead, it forwards the signaling information required to establish WebRTC connections.

### WebRTC

When two users are online and a direct connection can be established, Brzojav creates a WebRTC `RTCPeerConnection` between their browsers.

A WebRTC `RTCDataChannel` is then used to transfer:

- text messages
- files
- message-related data

SDP and ICE signaling is exchanged through Socket.IO. The backend only forwards the signaling packets and does not process the contents transferred through the DataChannel.

If a direct peer-to-peer connection is unavailable, the application can fall back to communication through the backend.

## Authentication

The application supports:

- username/email and password authentication
- Google authentication
- JWT-based sessions

Authentication tokens are stored by the frontend and automatically included in authenticated API requests.

## File Transfer

Files can be transferred directly between connected peers using WebRTC DataChannels.

The frontend divides binary files into chunks before sending them through the DataChannel. This allows larger files to be transferred without sending the entire file as a single message.

When a peer-to-peer connection cannot be used, files can instead be uploaded through the backend.

## Available Scripts

| Command | Description |
|---|---|
| `npm install` | Installs dependencies |
| `npm run serve` | Starts the development server |
| `npm run build` | Creates a production build |

## Deployment

The frontend can be deployed to a static hosting provider such as Vercel.

The production API URL must be configured using:

```env
VUE_APP_API_URL=https://your-backend-url
```

Make sure that the backend allows requests from the frontend's production domain.

## Related Repository

Backend:

[https://github.com/AlenOrbanic/Brzojav-backend](https://github.com/AlenOrbanic/Brzojav-backend)
