import { TRPCError } from '@trpc/server';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
	const router = useRouter();

	const signOut = async () => {
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/logout`,
				{
					method: 'POST',
					credentials: 'include',
					headers: {
						'Context-Type': 'application/json',
					},
				},
			);

			if (!res.ok) throw new TRPCError({ code: 'BAD_REQUEST' });

			toast.success('Signed out successfully.');

			router.push('/sign-in');
			router.refresh();
		} catch (error) {
			toast.error("Couldn't sign out, please try again");
		}
	};

	return { signOut };
};
