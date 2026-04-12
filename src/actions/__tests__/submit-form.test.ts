import { afterEach, describe, expect, it, vi } from "vitest";
import { validateEndpoint } from "@/lib/validate-endpoint";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("validateEndpoint", () => {
  describe("protocol validation", () => {
    it("accepts https URLs", () => {
      expect(validateEndpoint("https://hooks.example.com/webhook")).toBe(true);
    });

    it("rejects http URLs", () => {
      expect(validateEndpoint("http://hooks.example.com/webhook")).toBe(false);
    });

    it("rejects file:// URLs", () => {
      expect(validateEndpoint("file:///etc/passwd")).toBe(false);
    });

    it("rejects data: URLs", () => {
      expect(validateEndpoint("data:text/html,<h1>hi</h1>")).toBe(false);
    });

    it("rejects ftp: URLs", () => {
      expect(validateEndpoint("ftp://files.example.com")).toBe(false);
    });

    it("rejects empty string", () => {
      expect(validateEndpoint("")).toBe(false);
    });

    it("rejects malformed URLs", () => {
      expect(validateEndpoint("not-a-url")).toBe(false);
    });
  });

  describe("private IP / hostname blocking", () => {
    it("blocks localhost", () => {
      expect(validateEndpoint("https://localhost/hook")).toBe(false);
    });

    it("blocks 127.0.0.1", () => {
      expect(validateEndpoint("https://127.0.0.1/hook")).toBe(false);
    });

    it("blocks ::1", () => {
      expect(validateEndpoint("https://[::1]/hook")).toBe(false);
    });

    it("blocks 0.0.0.0", () => {
      expect(validateEndpoint("https://0.0.0.0/hook")).toBe(false);
    });

    it("blocks 10.x.x.x ranges", () => {
      expect(validateEndpoint("https://10.0.0.1/hook")).toBe(false);
      expect(validateEndpoint("https://10.255.255.255/hook")).toBe(false);
    });

    it("blocks 192.168.x.x ranges", () => {
      expect(validateEndpoint("https://192.168.1.1/hook")).toBe(false);
      expect(validateEndpoint("https://192.168.0.100/hook")).toBe(false);
    });

    it("blocks 172.16-31.x.x ranges", () => {
      expect(validateEndpoint("https://172.16.0.1/hook")).toBe(false);
      expect(validateEndpoint("https://172.31.255.255/hook")).toBe(false);
    });

    it("blocks 169.254.x.x link-local", () => {
      expect(validateEndpoint("https://169.254.1.1/hook")).toBe(false);
    });

    it("blocks AWS metadata endpoint", () => {
      expect(validateEndpoint("https://169.254.169.254/latest/meta-data/")).toBe(false);
    });

    it("blocks GCP metadata endpoint", () => {
      expect(validateEndpoint("https://metadata.google.internal/")).toBe(false);
    });
  });

  describe("port validation", () => {
    it("accepts default port (no explicit port)", () => {
      expect(validateEndpoint("https://hooks.example.com/webhook")).toBe(true);
    });

    it("accepts explicit port 443", () => {
      expect(validateEndpoint("https://hooks.example.com:443/webhook")).toBe(true);
    });

    it("rejects port 8080", () => {
      expect(validateEndpoint("https://hooks.example.com:8080/webhook")).toBe(false);
    });

    it("rejects port 80", () => {
      expect(validateEndpoint("https://hooks.example.com:80/webhook")).toBe(false);
    });

    it("rejects port 9200 (Elasticsearch)", () => {
      expect(validateEndpoint("https://hooks.example.com:9200/webhook")).toBe(false);
    });
  });

  describe("host allowlist (ALLOWED_ENDPOINT_HOSTS)", () => {
    it("allows any public host when allowlist is unset", () => {
      vi.stubEnv("ALLOWED_ENDPOINT_HOSTS", "");
      expect(validateEndpoint("https://any-host.example.com/hook")).toBe(true);
    });

    it("allows host present in allowlist", () => {
      vi.stubEnv("ALLOWED_ENDPOINT_HOSTS", "hooks.example.com,other.example.com");
      expect(validateEndpoint("https://hooks.example.com/webhook")).toBe(true);
    });

    it("blocks host not in allowlist", () => {
      vi.stubEnv("ALLOWED_ENDPOINT_HOSTS", "hooks.example.com");
      expect(validateEndpoint("https://evil.com/webhook")).toBe(false);
    });

    it("handles allowlist with spaces around entries", () => {
      vi.stubEnv("ALLOWED_ENDPOINT_HOSTS", " hooks.example.com , other.example.com ");
      expect(validateEndpoint("https://hooks.example.com/webhook")).toBe(true);
      expect(validateEndpoint("https://other.example.com/webhook")).toBe(true);
    });

    it("is case-insensitive for hostname matching", () => {
      vi.stubEnv("ALLOWED_ENDPOINT_HOSTS", "Hooks.Example.COM");
      expect(validateEndpoint("https://hooks.example.com/webhook")).toBe(true);
    });
  });
});
