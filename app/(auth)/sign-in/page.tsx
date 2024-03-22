'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { Button, buttonVariants } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import LotusLogo from '@/public/Lotus-Filter-Logo.png';

import {
	AuthCredentialValidator,
	TAuthCredentialsValidator,
} from '@/lib/validators/account-credentials-validators';
import { trpc } from '@/trpc/client';

const Page = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const isSeller = searchParams.get('as') === 'seller';
	const origin = searchParams.get('origin');

	const continueAsSeller = () => {
		router.push('?as=seller');
	};

	const continueAsBuyer = () => {
		router.push('/sign-in', undefined);
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TAuthCredentialsValidator>({
		resolver: zodResolver(AuthCredentialValidator),
	});

	const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
		onSuccess: () => {
			toast.success('Signed in successfully');

			router.refresh();

			if (origin) {
				router.push(`/${origin}`);
			}

			if (isSeller) {
				router.push('/sell');
			}

			router.push('/');
		},

		onError: (err) => {
			if (err.data?.code === 'UNAUTHORIZED') {
				toast.error('Invalid email or password.');
			}
		},
	});

	const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
		signIn({ email, password });
	};

	return (
		<>
			<div className='container relative flex flex-col pt-20 items-center justify-center lg:px-0'>
				<div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
					<div className='flex flex-col items-center  text-center space-y-2'>
						{/* <Icons.logo className='h-20 w-20' /> */}
						<Image src={LotusLogo} alt='eCommerce logo' className='h-16 w-16' />
						<h1 className='text-2xl font-bold'>
							Sign in to your {isSeller ? 'seller' : ''} account
						</h1>

						<Link
							href='/sign-up'
							className={buttonVariants({
								variant: 'link',
								className: 'gap-1.5',
							})}
						>
							Don&apos;t have an account? Sign-up
							<ArrowRight className='h-4 w-4' />
						</Link>
					</div>

					<div className='grid gap-6'>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className='grid gap-2'>
								<div className='grid gap-1 py-2'>
									<Label htmlFor='email'>Email</Label>
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
									<Label htmlFor='password'>Password</Label>
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
								<Button>Sign in</Button>
							</div>
						</form>

						<div className='relative'>
							<div
								aria-hidden='true'
								className='absolute inset-0 flex items-center'
							>
								<span className='w-full border-t' />
							</div>
							<div className='relative flex justify-center text-xs uppercase'>
								<span className='bg-background px-2 text-muted-foreground'>
									or
								</span>
							</div>
						</div>

						{isSeller ? (
							<Button
								onClick={continueAsBuyer}
								variant='secondary'
								disabled={isLoading}
							>
								Continue as customer
							</Button>
						) : (
							<Button
								onClick={continueAsSeller}
								variant='secondary'
								disabled={isLoading}
							>
								Continue as seller
							</Button>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Page;
