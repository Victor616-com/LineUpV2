import { index, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/layout.jsx", [
    index("routes/Onboarding.jsx"),
    route("home", "routes/home.jsx"),
    route("signin", "routes/SignIn.jsx"),
    route("signup", "routes/SignUp.jsx"),
    route("profile/:id", "routes/ProfileView.jsx"),
    route("profile/:id/edit", "routes/EditProfileView.jsx"),
    route("collabs", "routes/CollabsPage.jsx"),
    route("services", "routes/ServicesPage.jsx"),
    route("chats", "routes/ChatsPage.jsx"),
    route("chats/:threadId", "routes/ChatView.jsx"),
    route("create", "routes/CreatePage.jsx"),
  ]),
];
