import type { CollectionConfig } from "payload";

/**
 * Uploaded assets. Files are served from Vercel Blob in deployed
 * environments; without BLOB_READ_WRITE_TOKEN the storage plugin disables
 * itself and Payload falls back to writing into `public/media` locally.
 */
export const Media: CollectionConfig = {
  slug: "media",
  access: {
    // Uploads are public assets — the site renders them for anonymous visitors.
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description:
          "Describes the image for screen readers and when the file fails to load.",
      },
    },
  ],
  upload: {
    staticDir: "public/media",
  },
};
