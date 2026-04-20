import { withPasswordProtect } from "@tommyvez/passfort/next";

// Hash of password "guillotina" (PBKDF2-SHA256, 100k iterations).
// Safe to commit — hash is one-way, cannot be reversed to plaintext.
const PASSFORT_HASH =
  "pbkdf2:100000:wMgVeXoAkAhDVPvbMsgufA:0AAzrTyxLNKOB4sjTIE4rO0A_3j0gJIOOO25pXuBZ2s";
// Secret for signing session cookies. Rotating this invalidates all sessions.
const PASSFORT_SECRET = "25MlBOZxClzbzKaxMF4C7K6d1XVeQ2GZo9jRi1fYa0A";

export default withPasswordProtect({
  protectAll: true,
  env: {
    PASSFORT_HASH,
    PASSFORT_SECRET,
  },
  form: {
    title: "10AMCLUB",
    description: "Private. Contact @holdmybirra for access.",
    placeholder: "Password",
    buttonText: "Enter",
    theme: "dark",
  },
});

export const config = {
  matcher: [
    // Run on everything except Next internals and public static assets
    "/((?!_next/static|_next/image|favicon.ico|logo.jpg|apple-touch-icon.png|icon-192x192.png|icon-512x512.png|manifest.json).*)",
  ],
};
