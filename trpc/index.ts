import { authRouter } from '@/trpc/auth-router';
import { publicProcedure, router } from '@/trpc/trpc';

export const appRouter = router({
	auth: authRouter,
});

export type AppRouter = typeof appRouter;
