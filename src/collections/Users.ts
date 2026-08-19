import type { CollectionConfig } from "payload";

/**
 * Admin accounts for the Payload dashboard. Payload adds the `email` and
 * password fields itself when `auth` is enabled — anything listed here is
 * extra profile data.
 */
export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  fields: [
    {
      name: "name",
      type: "text",
      label: "Full name",
    },
  ],
};
