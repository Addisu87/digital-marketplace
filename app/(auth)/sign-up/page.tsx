'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ZodError } from 'zod';
import { toast } from 'sonner';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
	AuthCredentialValidator,
	TAuthCredentialsValidator,
} from '@/lib/validators/account-credentials-validators';
import { trpc } from '@/trpc/client';
import LotusLogo from '@/public/Lotus-Filter-Logo.png';

const Page = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TAuthCredentialsValidator>({
		resolver: zodResolver(AuthCredentialValidator),
	});

	const router = useRouter();

	const { mutate: signUp, isLoading } = trpc.auth.signUp.useMutation({
		onError: (err) => {
			if (err.data?.code === 'CONFLICT') {
				toast.error('This email is already in use. Sign in instead?');
				return;
			}

			if (err instanceof ZodError) {
				toast.error(err.issues[0].message);
				return;
			}

			toast.error('Something went wrong. please try again.');
		},

		onSuccess: ({ sentToEmail }) => {
			toast.success(`Verification email sent to ${sentToEmail}.`);
			router.push('/verify-email?to=' + sentToEmail);
		},
	});

	const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
		// send data to the server
		signUp({ email, password });
	};

	return (
		<>
			<div className='container relative flex flex-col pt-20 items-center justify-center lg:px-0'>
				<div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
					<div className='flex flex-col items-center text-center space-y-2'>
						<Image src={LotusLogo} alt='eCommerce logo' className='h-16 w-16' />

						<h1 className='text-2xl font-bold tracking-tight'>
							Create an account
						</h1>

						<Link
							href='/sign-in'
							className={buttonVariants({
								variant: 'link',
								className: 'gap-1.5',
							})}
						>
							Already have an account? Sign-in
							<ArrowRight className='h-4 w-4' />
						</Link>
					</div>

					<div className='grid gap-6'>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className='grid gap-2'>
								<div className='grid gap-1 py-2'>
									<Label htmlFor='email' className='mb-1'>
										Email
									</Label>
									<Input
										{...register('email')}
										type='email'
										className={cn({
											'focus-visible:ring-red-500': errors.email,
										})}
										placeholder='you@example.com'
									/>
									{errors?.email && (
										<p className='text-sm text-red-500'>
											{errors.email.message}
										</p>
									)}
								</div>
								<div className='grid gap-1 py-2'>
									<Label htmlFor='password' className='mb-1'>
										Password
									</Label>
									<Input
										{...register('password')}
										type='password'
										className={cn({
											'focus-visible:ring-red-500': errors.password,
										})}
										placeholder='Password'
									/>
									{errors?.password && (
										<p className='text-sm text-red-500'>
											{errors.password.message}
										</p>
									)}
								</div>
								<Button disabled={isLoading}>
									{isLoading && (
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									)}
									Sign up
								</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default Page;
