import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("admin", "routes/admin.tsx"),
  route("ecologin", "routes/ecologin.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("manage-student", "routes/manage-student.tsx"),
  route("waste-collection", "routes/waste-collection.tsx"),
  route("waste-types", "routes/waste-types.tsx"),
] satisfies RouteConfig;
