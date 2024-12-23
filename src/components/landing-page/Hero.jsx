'use client'

import Link from "next/link"
import { LogIn } from "lucide-react"
import { useAuth } from "../../context/AuthProvider"
import ArrowIcon from "../../assets/arrow-right.svg"
import Image from "next/image"
import { LogoTicker } from "./LogoTicker"
import heroImage from "../../../public/preview.png"
import { useEffect } from "react"

// Page Data
const pageData = {
    tag: "Version 1.0 is here",
    title: "SaaSavant SaaS Boilerplate",
    description: "Spend your time building the features that set your app apart. SaaSavant will take care of everything else.",
    buttons: {
        noUser: {
            primary: { text: "Get Started", href: "/Signup" },
            secondary: { text: "Learn more", href: "/About" }
        },
        user: {
            primary: { text: "Dashboard", href: "/Dashboard" }
        }
    }
}

const Hero = () => {
    const { user } = useAuth();

    console.log(user);
    useEffect(() => {
        if (user) {
            console.log("User is signed in");
        } else {
            console.log("No user is signed in");
        }
    })
    // Determine which button set to use
    const buttonConfig = user ? pageData.buttons.user : pageData.buttons.noUser

    return (
        <section className="h-full min-h-screen flex flex-col justify-start items-center text-white p-8 px-2 -my-12">
            <div className="flex flex-col-reverse lg:flex-row items-center max-w-7xl justify-center my-auto mx-auto sm:px-5 md:px-10">
                <div className="flex flex-col items-start px-6 md:px-8">
                    <div className="text-black">
                        <div className="tag text-destructive text-sm sm:text-md md:text-lg lg:text-xl">
                            {pageData.tag}
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-black mt-6">
                            {pageData.title}
                        </h1>
                        <p className="text-xl text-black tracking-tight mt-6 max-w-6xl">
                            {pageData.description}
                        </p>
                    </div>
                    <div className="mt-4 flex gap-2">
                        {Object.entries(buttonConfig).map(([key, button]) => (
                            <Link legacyBehavior key={button.text} href={button.href}>
                                <a
                                    className={`btn ${key === "primary" ? "btn-primary bg-confirm shadow-md shadow-black text-black hover:shadow-lg hover:shadow-black duration-300" : "btn-text"} 
                                        text-sm sm:text-lg md:text-xl lg:text-2xl 
                                        font-semibold flex items-center gap-2 
                                       hover:opacity-60 duration-300`}
                                >
                                    {key === "primary" && button.text === "Dashboard" && <LogIn className="h-5 w-5" />}
                                    {key === "primary" && button.text === "Get Started Now" && <LogIn className="h-5 w-5" />}
                                    {button.text}
                                    {key === "secondary" && <ArrowIcon className="h-5 w-5" />}
                                </a>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="hidden lg:flex flex-col items-center mt-4 md:mt-0">
                    <Image
                        className="w-1/2 shadow-md shadow-black mx-auto lg:w-full max-w-4xl border-4"
                        src={heroImage}
                        width={1920}
                        height={1080}
                        alt="Preview"
                    />
                </div>
            </div>
            <div className="text-black mx-auto w-full max-w-6xl">
                <LogoTicker />
            </div>
        </section>
    )
}

export default Hero
