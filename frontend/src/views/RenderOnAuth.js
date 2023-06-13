import KeycloakService from "@/services/KeycloakService";

const RenderOnAuth = ({ children }) =>
  UserService.isLoggedIn() ? children : null;

export default RenderOnAuth;
