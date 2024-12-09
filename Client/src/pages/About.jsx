import React from "react";
import Navbar from "./Navbar";

const About = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />

            <div className="p-8">
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-800">About Us</h1>
                    <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
                        Welcome to <strong>Planity</strong>, where collaboration meets innovation.
                        Our platform is designed to empower teams of all sizes to achieve their goals efficiently by organizing
                        tasks, managing resources, and improving communication. Whether you're handling small projects or
                        managing large-scale operations, our tool adapts to your needs, ensuring every task is on track
                        and every milestone is celebrated.
                    </p>
                </header>

                <section className="max-w-4xl mx-auto mb-12">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
                        Our Mission
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-center">
                        Our mission is to make project management effortless, seamless, and accessible for everyone.
                        We believe in empowering teams to focus on what truly matters—collaboration, creativity, and
                        delivering exceptional results. By providing tools that are intuitive yet powerful, we aim to
                        bridge the gap between vision and execution.
                    </p>
                </section>

                <section className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6">Meet Our Team</h2>
                    <p className="text-gray-600 mb-8">
                        Our team comprises dedicated professionals who are passionate about creating solutions that drive
                        success. Together, we bring a diverse set of skills and experiences to build a platform tailored to
                        the needs of modern teams.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <TeamMember
                            name="Akshitha"
                            role="Frontend Developer"
                            description="Akshitha specializes in crafting user-friendly interfaces and ensuring seamless user experiences. She thrives on creating interactive designs that make our platform both functional and delightful."
                        />
                        <TeamMember
                            name="Vishwaksen"
                            role="Backend Developer"
                            description="Vishwaksen is the backbone of our platform, building robust APIs and maintaining data security. His expertise in server-side development ensures everything runs smoothly behind the scenes."
                        />
                        <TeamMember
                            name="Prajwal Kumar"
                            role="Project Manager"
                            description="Prajwal oversees project timelines, milestones, and team coordination. His leadership ensures that we stay on track and meet our goals with precision and dedication."
                        />
                        <TeamMember
                            name="Santosh"
                            role="UI/UX Designer"
                            description="Santosh brings creativity to the team by designing intuitive layouts and beautiful visuals. Her focus on user-centric design ensures a top-notch experience for our users."
                        />
                        <TeamMember
                            name="Giridhar"
                            role="Quality Assurance"
                            description="Giridhar's attention to detail helps us deliver a bug-free and reliable product. His rigorous testing process ensures the platform meets the highest standards of quality."
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

const TeamMember = ({ name, role, description }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800">{name}</h3>
            <p className="text-gray-600 font-medium">{role}</p>
            <p className="text-gray-500 mt-2">{description}</p>
        </div>
    );
};

export default About;
