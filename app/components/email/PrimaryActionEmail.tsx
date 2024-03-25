import * as React from 'react';

import {
	Body,
	Button,
	Container,
	Head,
	Hr,
	Html,
	Img,
	Preview,
	Section,
	Text,
	render,
} from '@react-email/components';

interface EmailTemplateProps {
	actionLabel: string;
	buttonText: string;
	href: string;
}

export const EmailTemplate = ({
	actionLabel,
	buttonText,
	href,
}: EmailTemplateProps) => {
	return (
		<Html>
			<Head />
			<Preview>The marketplace for high-quality digital goods.</Preview>
			<Body className='bg-white font-sans'>
				<Container className='mx-auto py-20 px-0'>
					<Img
						src={`${process.env.NEXT_PUBLIC_SERVER_URL}/hippo-newsletter-sign-up.png`}
						width='150'
						height='150'
						alt='DigitalMarketPlace'
						className='mx-auto'
					/>
					<Text className='text-base leading-6'>Hi there,</Text>
					<Text className='text-base leading-6'>
						Welcome to DigitalMarketPlace, the marketplace for high quality
						digital goods. Use the button below to {actionLabel}.
					</Text>
					<Section className='text-center'>
						<Button
							className='px-4 py-3 bg-blue-600 rounded text-white text-base text-center block'
							href={href}
						>
							{buttonText}
						</Button>
					</Section>
					<Text className='text-base leading-6'>
						Best,
						<br />
						The DigitalMarketPlace team
					</Text>
					<Hr className='border-gray-300 my-5' />
					<Text className='text-xs text-gray-500'>
						If you did not request this email, you can safely ignore it.
					</Text>
				</Container>
			</Body>
		</Html>
	);
};

export const PrimaryActionEmailHtml = (props: EmailTemplateProps) =>
	render(<EmailTemplate {...props} />, {
		pretty: true,
	});
