import { config } from "zod";

// Zod probes `new Function` before it will compile a schema. Browsers report
// that probe as a CSP violation even though Zod catches the exception and
// continues. Chat loads this copy of Zod through the AI SDK, so the probe has
// to be disabled before that module is evaluated.
config({ jitless: true });
