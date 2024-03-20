'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Icons } from '@/app/components/Icons';
import { Button, buttonVariants } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { cn } from '@/lib/utils';
import {
	AuthCredentialValidator,
	TAuthCredentialsValidator,
} from '@/lib/validators/account-credentials-validators';

import eCommerceLogo from '../../public/E-Shop.jpg';

const Page = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TAuthCredentialsValidator>({
		resolver: zodResolver(AuthCredentialValidator),
	});

	const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
		// send data to the server
	};

	return (
		<>
			<div className='container relative flex flex-col pt-20 items-center justify-center lg:px-0'>
				<div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
					<div className='flex flex-col items-center  text-center space-y-2'>
						{/* <Icons.logo className='h-20 w-20' /> */}
						<Image
							src={eCommerceLogo}
							alt='eCommerce logo'
							className='h-16 w-16'
						/>
						<h1 className='text-2xl font-bold'>Create an account</h1>

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
									<Label htmlFor='email'>Email</Label>
									<Input
										{...register('email')}
										className={cn({
											'focus-visible:ring-red-500': errors.email,
										})}
										placeholder='you@example.com'
									/>
								</div>
								<div className='grid gap-1 py-2'>
									<Label htmlFor='password'>Password</Label>
									<Input
										{...register('password')}
										className={cn({
											'focus-visible:ring-red-500': errors.password,
										})}
										placeholder='Password'
									/>
								</div>
								<Button>Sign up</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default Page;
