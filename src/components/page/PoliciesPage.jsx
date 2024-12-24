"use client";

import { Plus } from "lucide-react";
import React, { useState } from "react";
import siteMetadata from "../../../siteMetadata";

const Policies = () => {
  const [isCookiePolicyOpen, setCookiePolicyOpen] = useState(false);
  const [isTOSOpen, setTOSOpen] = useState(false);
  const [isPrivacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);

  const toggleCookiePolicy = () => setCookiePolicyOpen(!isCookiePolicyOpen);
  const toggleTOS = () => setTOSOpen(!isTOSOpen);
  const togglePrivacyPolicy = () => setPrivacyPolicyOpen(!isPrivacyPolicyOpen);

  return (
    <>
      <div className="p-6 pt-32 mx-auto text-black w-full  min-h-screen content-center h-full flex flex-col">
        <h1 className="text-2xl text-center sm:text-3xl font-bold mb-6">
          Policies
        </h1>
        <div className="mb-8 max-w-4xl mx-auto w-full">
          <h2
            className="text-xl sm:text-2xl font-semibold mb-3 cursor-pointer"
            onClick={toggleCookiePolicy}
          >
            <Plus
              className={`inline mr-2 text-confirm ${
                isCookiePolicyOpen ? "rotate-45 text-destructive" : ""
              }`}
            />{" "}
            Cookie Policy
          </h2>
          {isCookiePolicyOpen && (
            <div>
              <p className="mb-2">
                Our website uses cookies to improve your experience and provide
                personalized content. Cookies are small data files that are
                placed on your device when you visit our site. They help us to
                understand how you use our site, enabling us to enhance your
                experience and tailor our content to better suit your interests.
              </p>
              <p className="mb-2">
                By continuing to browse our website, you consent to our use of
                cookies in accordance with this policy. You have the option to
                manage or disable cookies through your browser settings.
                However, please note that disabling cookies may affect the
                functionality of our website.
              </p>
              <p className="mb-2">
                We use both session cookies, which expire once you close your
                web browser, and persistent cookies, which remain on your device
                until deleted or expired. These cookies help us to:
              </p>
              <ul className="mb-2 list-disc pl-5">
                <li>Remember your preferences and settings</li>
                <li>Understand how you interact with our content</li>
                <li>Improve the performance and security of our site</li>
              </ul>
              <p className="mb-2">
                We may also use third-party cookies to help us analyze usage and
                improve our services. These third parties may have access to
                your data, which will be used in accordance with their privacy
                policies.
              </p>
              <p className="mb-2">
                For more information on how to manage your cookie settings,
                please visit your browser&apos;s help section or review the
                settings on your device. If you have any questions about our
                cookie policy, feel free to contact us.
              </p>
            </div>
          )}
        </div>
        <div className="mb-8 max-w-4xl mx-auto w-full">
          <h2
            className="text-xl sm:text-2xl font-semibold mb-3 cursor-pointer"
            onClick={toggleTOS}
          >
            <Plus
              className={`inline mr-2 text-confirm ${
                isTOSOpen ? "rotate-45 text-destructive" : ""
              }`}
            />{" "}
            Terms of Service
          </h2>
          {isTOSOpen && (
            <div>
              <p className="mb-2">
                Welcome to {siteMetadata.title}! These Terms of Service
                (&quot;Terms&quot;) govern your access to and use of our website
                and services (collectively, &quot;Services&quot;). By accessing
                or using our Services, you agree to be bound by these Terms. If
                you do not agree to these Terms, please do not use our Services.
              </p>

              <h2 className="text-xl font-semibold mb-3">1. Use of Services</h2>
              <p className="mb-2">
                You agree to use our Services only for lawful purposes and in
                accordance with these Terms. You are responsible for any content
                you submit and for ensuring that such content complies with
                applicable laws and regulations.
              </p>

              <h2 className="text-xl font-semibold mb-3">
                2. Account Registration
              </h2>
              <p className="mb-2">
                To access certain features of our Services, you may need to
                create an account. You agree to provide accurate, current, and
                complete information during the registration process and to
                update your information to keep it accurate, current, and
                complete.
              </p>

              <h2 className="text-xl font-semibold mb-3">3. User Content</h2>
              <p className="mb-2">
                You retain ownership of any content you submit through our
                Services. By submitting content, you grant {siteMetadata.title}{" "}
                a worldwide, non-exclusive, royalty-free, and transferable
                license to use, reproduce, modify, and distribute such content
                for the purpose of operating and improving our Services.
              </p>
              <h2 className="text-xl font-semibold mb-3">
                4. Prohibited Conduct
              </h2>
              <p className="mb-2">
                You agree not to engage in any of the following prohibited
                activities:
              </p>
              <ul className="mb-2 list-disc pl-5">
                <li>
                  Using our Services for any unlawful purpose or in violation of
                  these Terms.
                </li>
                <li>
                  Interfering with or disrupting the operation of our Services
                  or servers.
                </li>
                <li>
                  Attempting to gain unauthorized access to our Services or
                  systems.
                </li>
                <li>
                  Impersonating another person or entity or falsifying
                  information.
                </li>
                <li>
                  Posting or transmitting any content that is illegal,
                  defamatory, obscene, or harmful.
                </li>
              </ul>
              <h2 className="text-xl font-semibold mb-3">
                5. Intellectual Property
              </h2>
              <p className="mb-2">
                All intellectual property rights in our Services and content are
                owned by {siteMetadata.title} or its licensors. You may not
                reproduce, modify, distribute, or create derivative works from
                any part of our Services without our express written permission.
              </p>
              <h2 className="text-xl font-semibold mb-3">
                6. Disclaimer of Warranties
              </h2>
              <p className="mb-2">
                Our Services are provided &quot;as is&quot; and &quot;as
                available&quot; without any warranties of any kind. We do not
                guarantee the accuracy, reliability, or availability of our
                Services and disclaim all warranties to the fullest extent
                permitted by law.
              </p>
              <h2 className="text-xl font-semibold mb-3">
                7. Limitation of Liability
              </h2>
              <p className="mb-2">
                To the maximum extent permitted by law, {siteMetadata.title}{" "}
                shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages arising out of or related to
                your use of our Services, even if we have been advised of the
                possibility of such damages.
              </p>
              <h2 className="text-xl font-semibold mb-3">8. Indemnification</h2>
              <p className="mb-2">
                You agree to indemnify and hold harmless {siteMetadata.title},
                its affiliates, and their respective officers, directors,
                employees, and agents from any claims, liabilities, damages,
                losses, or expenses, including reasonable attorneys&apos; fees,
                arising out of or related to your use of our Services or
                violation of these Terms.
              </p>
              <h2 className="text-xl font-semibold mb-3">
                9. Changes to Terms
              </h2>
              <p className="mb-2">
                We reserve the right to modify these Terms at any time. Any
                changes will be effective when we post the updated Terms on our
                website. Your continued use of our Services after such changes
                constitutes your acceptance of the revised Terms.
              </p>
              <h2 className="text-xl font-semibold mb-3">10. Termination</h2>
              <p className="mb-2">
                We may terminate or suspend your access to our Services at our
                sole discretion, with or without cause or notice. Upon
                termination, your right to use our Services will immediately
                cease.
              </p>
              <h2 className="text-xl font-semibold mb-3">11. Governing Law</h2>
              <p className="mb-2">
                These Terms shall be governed by and construed in accordance
                with the laws of the United States of America, without regard to
                its conflict of law principles.
              </p>
            </div>
          )}
        </div>

        <div className="mb-8 max-w-4xl mx-auto w-full">
          <h2
            className="text-xl sm:text-2xl font-semibold mb-3 cursor-pointer"
            onClick={togglePrivacyPolicy}
          >
            <Plus
              className={`inline mr-2 text-confirm ${
                isPrivacyPolicyOpen ? "rotate-45 text-destructive" : ""
              }`}
            />{" "}
            Privacy Policy
          </h2>
          {isPrivacyPolicyOpen && (
            <div>
              <p className="mb-2">
                At {siteMetadata.title}, we are committed to protecting your
                privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you visit our
                website. Please read this policy carefully to understand our
                practices regarding your personal data and how we will treat it.
              </p>
              <h2 className="text-xl font-semibold mb-3">
                1. Information We Collect
              </h2>
              <p className="mb-2">
                We may collect the following types of information:
              </p>
              <ul className="mb-2 list-disc pl-5">
                <li>
                  <strong>Personal Identification Information:</strong> Name,
                  email address, phone number, and other contact details you
                  provide to us.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information about how you use our
                  website, including your IP address, browser type, pages
                  visited, and the time and date of your visits.
                </li>
                <li>
                  <strong>Cookies and Tracking Technologies:</strong> Data
                  collected through cookies, web beacons, and similar
                  technologies to enhance user experience and analyze usage
                  patterns.
                </li>
              </ul>
              <h2 className="text-xl font-semibold mb-3">
                2. How We Use Your Information
              </h2>
              <p className="mb-2">
                We use the information we collect in the following ways:
              </p>
              <ul className="mb-2 list-disc pl-5">
                <li>
                  To provide, operate, and maintain our website and services.
                </li>
                <li>
                  To improve your experience by personalizing content and
                  recommendations.
                </li>
                <li>
                  To communicate with you, including responding to inquiries and
                  sending updates or promotional materials.
                </li>
                <li>
                  To analyze usage patterns and gather data to enhance our
                  website and services.
                </li>
                <li>
                  To comply with legal obligations and enforce our terms and
                  policies.
                </li>
              </ul>
              <h2 className="text-xl font-semibold mb-3">
                3. How We Share Your Information
              </h2>
              <p className="mb-2">We may share your information with:</p>
              <ul className="mb-2 list-disc pl-5">
                <li>
                  <strong>Service Providers:</strong> Third-party companies that
                  assist us in operating our website and providing services,
                  such as payment processors and email service providers.
                </li>
                <li>
                  <strong>Legal Authorities:</strong> If required by law, we may
                  disclose your information to comply with legal obligations or
                  to protect the rights, property, or safety of{" "}
                  {siteMetadata.title} or others.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In the event of a merger,
                  acquisition, or sale of assets, your information may be
                  transferred to the new entity.
                </li>
              </ul>
              <h2 className="text-xl font-semibold mb-3">
                4. Security of Your Information
              </h2>
              <p className="mb-2">
                We implement appropriate technical and organizational measures
                to protect your information from unauthorized access,
                alteration, disclosure, or destruction. However, no method of
                transmission over the internet or electronic storage is 100%
                secure, so we cannot guarantee absolute security.
              </p>
              <h2 className="text-xl font-semibold mb-3">
                5. Your Choices and Rights
              </h2>
              <p className="mb-2">
                You have the following rights regarding your personal
                information:
              </p>
              <ul className="mb-2 list-disc pl-5">
                <li>
                  <strong>Access:</strong> You can request access to the
                  personal information we hold about you.
                </li>
                <li>
                  <strong>Correction:</strong> You can request correction of any
                  inaccurate or incomplete information.
                </li>
                <li>
                  <strong>Deletion:</strong> You can request deletion of your
                  personal information under certain circumstances.
                </li>
                <li>
                  <strong>Opt-Out:</strong> You can opt-out of receiving
                  marketing communications from us by following the unsubscribe
                  instructions in the emails or contacting us directly.
                </li>
              </ul>
              <h2 className="text-xl font-semibold mb-3">
                6. Changes to This Privacy Policy
              </h2>
              <p className="mb-2">
                We may update this Privacy Policy from time to time to reflect
                changes in our practices or legal requirements. We will notify
                you of any significant changes by posting the updated policy on
                our website. Your continued use of our website after any changes
                constitutes your acceptance of the revised policy.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Policies;
