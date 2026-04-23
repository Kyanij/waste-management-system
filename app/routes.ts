import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("components/UserPortal/UserPortal.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("manage-student", "routes/manage-student.tsx"),
  route("waste-collection", "routes/waste-collection.tsx"),
  route("waste-types", "routes/waste-types.tsx"),
  route("login", "routes/ecologin.tsx"),
  route("admin", "routes/admin.tsx"),
] satisfies RouteConfig;