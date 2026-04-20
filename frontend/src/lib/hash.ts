export async function sha256(value: string): Promise<string> {
  const normalized = value.toLowerCase().trim();
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(normalized)
  );
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
