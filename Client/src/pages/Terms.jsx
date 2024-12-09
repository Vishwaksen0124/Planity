import React from "react";
import Navbar from "./Navbar";

const Terms = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />

            <div className="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-md mt-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms of Service</h1>

                <p className="text-gray-600 mb-4">
                    Welcome to our Project Management Platform. By using our platform, you agree to the following terms and conditions. Please read them carefully before proceeding.
                </p>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">1. Acceptance of Terms</h2>
                    <p className="text-gray-600">
                        By accessing or using our platform, you confirm that you accept these Terms of Service and agree to comply with them. If you do not agree, you must not use our platform.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">2. User Accounts</h2>
                    <p className="text-gray-600">
                        To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and ensuring that all details are accurate and up to date.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">3. Acceptable Use</h2>
                    <p className="text-gray-600">
                        You agree to use the platform only for lawful purposes and in a way that does not infringe on the rights of others. Misuse, including unauthorized access or sharing of sensitive data, is strictly prohibited.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">4. Intellectual Property</h2>
                    <p className="text-gray-600">
                        All content, features, and functionalities on this platform, including design, graphics, and software, are the property of our platform and are protected by intellectual property laws.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">5. Termination</h2>
                    <p className="text-gray-600">
                        We reserve the right to suspend or terminate your access to the platform if you breach these terms or engage in activities that harm the platform or its users.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">6. Limitation of Liability</h2>
                    <p className="text-gray-600">
                        We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform, including but not limited to data loss or service interruptions.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">7. Changes to Terms</h2>
                    <p className="text-gray-600">
                        We may update these Terms of Service from time to time. Continued use of the platform after changes are made constitutes acceptance of the new terms.
                    </p>
                </section>

                <p className="text-gray-600">
                    If you have any questions or concerns regarding these terms, please contact us at support@planity.com.
                </p>
            </div>
        </div>
    );
};

export default Terms;
