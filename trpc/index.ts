import { authRouter } from '@/trpc/auth-router';
import { router } from '@/trpc/trpc';

export const appRouter = router({
	auth: authRouter,
});

export type AppRouter = typeof appRouter;
