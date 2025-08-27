import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const logoImage =
  process.env.NODE_ENV === "production"
    ? "https://www.todothat.space/todothat-logo.svg"
    : "http://localhost:3000/todothat-logo.svg"; // For local development

interface EmailVerificationProps {
  url: string;
  user?: string;
  appName?: string;
  supportEmail?: string;
  logoUrl?: string;
}

export const EmailVerification = ({
  url,
  user = "there",
  appName = "Todothat",
  supportEmail = "noreply@todothat.space",
  logoUrl = logoImage,
}: EmailVerificationProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Verify your email address to secure your {appName} account
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={headerSection}>
            <Img src={logoUrl} width="140" alt={appName} style={logo} />
          </Section>

          {/* Content card */}
          <Section style={contentCard}>
            <Text style={bodyText}>
              Hi {user.name} 👋, welcome to{" "}
              <strong style={brandText}>{appName}</strong> — your productivity
              app built to help you organize, prioritize, and get things done.
            </Text>

            <Text style={bodyText}>
              To get started and ensure the security of your account, please
              verify your email address by clicking the button below:
            </Text>

            {/* CTA */}
            <Section style={buttonContainer}>
              <Button style={ctaButton} href={url}>
                Verify Email Address
              </Button>
            </Section>

            {/* Fallback link */}
            <Text style={alternativeText}>
              If the button doesn't work, copy and paste this link into your
              browser:
            </Text>

            <Section style={linkContainer}>
              <Text style={linkText}>
                <Link
                  href={url}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  {url}
                </Link>
              </Text>
            </Section>

            <Hr style={divider} />

            <Text style={footerText}>
              ⏰ This verification link expires in <strong>24 hours</strong> for
              security.
            </Text>

            <Text style={footerText}>
              If you didn't create a {appName} account, you can safely ignore
              this email.
            </Text>

            <Text style={supportText}>
              Questions? We're here to help at{" "}
              <Link href={`mailto:${supportEmail}`} style={supportLink}>
                {supportEmail}
              </Link>
            </Text>
          </Section>

          {/* Bottom branding */}
          <Section style={brandingFooter}>
            <Text style={brandingText}>
              Organize • Prioritize • Get things done
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailVerification;

/* -------------------------
   Styles
   ------------------------- */
const main = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  backgroundColor: "#f7fafc",
  padding: "24px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "640px",
  borderRadius: "8px",
  boxShadow: "0 6px 18px rgba(8,15,25,0.06)",
  overflow: "hidden",
};

const headerSection = {
  background: "#ffffff",
  padding: "32px 20px 0",
  textAlign: "center" as const,
};

const logo = {
  display: "inline-block",
  margin: "8px auto 20px",
};

const contentCard = {
  marginTop: "16px",
  backgroundColor: "#ffffff",
  padding: "36px 48px",
};

const bodyText = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px 0",
};

const brandText = {
  color: "#00b793",
  fontWeight: 600,
};

const buttonContainer = {
  margin: "20px 0 18px",
  textAlign: "center" as const,
};

const ctaButton = {
  backgroundColor: "#00b793",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: 700,
  padding: "12px 26px",
  borderRadius: "8px",
  textDecoration: "none",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 6px 18px rgba(0, 183, 147, 0.12)",
};

const alternativeText = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "12px 0 10px 0",
  textAlign: "center" as const,
};

const linkContainer = {
  backgroundColor: "#f3f4f6",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  margin: "0 0 24px 0",
  padding: "12px 14px",
  textAlign: "center" as const,
};

const linkText = {
  color: "#04543a",
  fontFamily: "monospace",
  fontSize: "13px",
  lineHeight: "1.4",
  margin: 0,
  wordBreak: "break-all" as const,
};

const divider = {
  border: "none",
  borderTop: "1px solid #e5e7eb",
  margin: "24px 0",
};

const footerText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0 0 8px 0",
  textAlign: "center" as const,
};

const supportText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "16px 0 0 0",
  textAlign: "center" as const,
};

const supportLink = {
  color: "#00b793",
  textDecoration: "none",
};

const brandingFooter = {
  borderTop: "1px solid #e5e7eb",
  marginTop: "28px",
  paddingTop: "20px",
  paddingBottom: "20px",
  textAlign: "center" as const,
};

const brandingText = {
  color: "#9ca3af",
  fontSize: "12px",
  fontWeight: 500,
  letterSpacing: "0.5px",
  margin: 0,
  textTransform: "uppercase" as const,
};
