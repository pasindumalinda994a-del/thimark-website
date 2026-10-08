import type { Access, FieldAccess, PayloadRequest } from "payload";

type Role = "admin" | "editor";

function roleOf(req: PayloadRequest): Role | undefined {
  const user = req.user as { role?: Role } | null | undefined;
  return user?.role;
}

export const anyone: Access = () => true;

export const authenticated: Access = ({ req }) => Boolean(req.user);

export const admins: Access = ({ req }) => roleOf(req) === "admin";

export const adminsField: FieldAccess = ({ req }) => roleOf(req) === "admin";

export const adminsOrSelf: Access = ({ req }) => {
  if (!req.user) return false;
  if (roleOf(req) === "admin") return true;
  return { id: { equals: req.user.id } };
};

export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true;
  return { _status: { equals: "published" } };
};
