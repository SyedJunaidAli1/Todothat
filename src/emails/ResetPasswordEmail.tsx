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
    ? "https://halycron.space/logo_dark.png"
    : "http://localhost:3000/logo_dark.png"; // For local development

interface ResetPasswordEmailProps {
  url: string;
  user?: string;
  appName?: string;
  supportEmail?: string;
  logoUrl?: string;
}

export const ResetPasswordEmail = ({
  url,
  user = "there",
  appName = "Todothat",
  supportEmail = "noreply@todothat.space",
  logoUrl = logoImage,
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your {appName} password — get back on track</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={headerSection}>
            {/* <Img src={logoUrl} width="140" alt={appName} style={logo} /> */}
          </Section>

          {/* Content card */}
          <Section style={contentCard}>
            <Text style={bodyText}>
              Hi {user} 👋, we received a request to reset your{" "}
              <strong style={brandText}>{appName}</strong> password.
            </Text>

            <Text style={bodyText}>
              If you made this request, click the button below to choose a new
              password and get back to your tasks:
            </Text>

            {/* CTA */}
            <Section style={buttonContainer}>
              <Button style={ctaButton} href={url}>
                Reset Password
              </Button>
            </Section>

            {/* Fallback link */}
            <Text style={alternativeText}>
              If the button doesn&apos;t work, copy and paste this link into
              your browser:
            </Text>

            <Section style={linkContainer}>
              <Text style={linkText}>
                <Link href={url} style={{ color: "inherit", textDecoration: "none" }}>
                  {url}
                </Link>
              </Text>
            </Section>

            <Hr style={divider} />

            <Text style={footerText}>
              ⏰ For security, this reset link expires in <strong>Few minutes</strong>.
            </Text>

            <Text style={footerText}>
              If you didn&apos;t request a password reset, you can safely ignore
              this email — your password will remain unchanged.
            </Text>

            <Text style={supportText}>
              Need help? Contact us at{" "}
              <Link href={`mailto:${supportEmail}`} style={supportLink}>
                {supportEmail}
              </Link>
            </Text>
          </Section>

          {/* Bottom branding */}
          <Section style={brandingFooter}>
            <Text style={brandingText}>Organize • Prioritize • Get things done</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ResetPasswordEmail;

/* -------------------------
   Styles (mirrored from verification)
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
