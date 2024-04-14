import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
} from '@react-email/components'

interface VerificationEmailPage {
    username: string;
    otp: string
}

export default function VerificationEmail({username, otp} : VerificationEmailPage) {
    
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>Verification Code</title>
                <Font fontFamily="Roboto"
                fallbackFontFamily="Verdana"
                webFont={{
                    url: 'https:fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92r1MxKKTU1Kg.woff2',
                    format: 'woff2',
                }}
                fontWeight={400}
                fontStyle="normal"
                />
            </Head>
            <Preview>Here&apos;s your Verification code: {otp}</Preview>
            <Section>
                <Row>
                    <Heading as="h2">Hello {username}</Heading>
                </Row>
                <Row>
                    <Text>
                        Thank you for registering. Please use the following Verification
                        code to complete your registration.
                    </Text>
                </Row>
                <Row>
                    <Text>{otp}</Text>
                </Row>
                <Row>
                    <Text>If you did not request this code, please ignore this email.</Text>
                </Row>
            </Section>
        </Html>
    )
}