import { createTRPCReact } from "@trpc/react-query";
// No monorepo, vamos importar do backend ou shared se os types estiverem lá
// Por enquanto, apontamos para o novo caminho relativo
import type { AppRouter } from "../../../../backend/src/routers";

export const trpc = createTRPCReact<AppRouter>();
