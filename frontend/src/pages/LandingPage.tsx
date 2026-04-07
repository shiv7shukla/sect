import { Shield, Lock, Eye, Zap, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { cn } from "../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { authStore } from "../store/useAuthStore";
import React from "react";
import { useShallow } from "zustand/shallow";

const LandingPage = () => {
const [openFaq, setOpenFaq] = useState<number | null>(null);
const navigate = useNavigate();
const { authUser, checkAuth } = authStore(useShallow((state)=>({
    authUser: state.authUser, 
    checkAuth: state.checkAuth,
})));

React.useEffect(() => {
    checkAuth();
}, [checkAuth]);

const features = [
{
    icon: Lock,
    title: "Military-Grade Encryption",
    description: "256-bit AES encryption ensures your messages remain completely private. Not even we can read them."
},
{
    icon: Eye,
    title: "Zero Knowledge Architecture",
    description: "We store nothing. Your messages exist only between you and your recipient."
},
{
    icon: Zap,
    title: "Real-Time Messaging",
    description: "Lightning-fast message delivery with instant read receipts and typing indicators."
},
];

const testimonials = [
{
    quote: "Finally, a messaging app that takes privacy seriously.",
    author: "Sarah K.",
    role: "Cybersecurity Analyst",
    avatar: "S"
},
{
    quote: "We switched our entire team to Sect. The peace of mind is invaluable.",
    author: "Marcus T.",
    role: "Startup Founder",
    avatar: "M"
},
{
    quote: "No phone number, no email, no trace. This is how messaging should be.",
    author: "Alex R.",
    role: "Privacy Advocate",
    avatar: "A"
}
];

const faqs = [
{
    question: "Can you read my messages?",
    answer: "Absolutely not. We use end-to-end encryption, meaning messages are encrypted on your device and can only be decrypted by the recipient. We have zero access to your message content."
},
{
    question: "Is Sect available on mobile?",
    answer: "Yes! Sect is available as a progressive web app that works on all devices. Native iOS and Android apps are coming soon."
},
{
    question: "How is Sect different from Signal or Telegram?",
    answer: "Unlike other apps, Sect requires no personal information whatsoever. No phone number, no email—just a UUID. This provides an additional layer of anonymity that other platforms don't offer."
}
];

return (
<div className="min-h-screen bg-background overflow-x-hidden">
    {/* Navigation */}
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
            </div>
            <span className="font-mono font-bold text-lg text-gradient">sect</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
            {!authUser  && (<Button variant="ghost" size="sm" onClick={() => {navigate("/chats")}}>Log In</Button>)}
            <Button variant="default" size="sm" onClick={() => navigate("/chats")}>
            Get Started
            </Button>
        </div>
        </div>
    </div>
    </nav>

    {/* Hero Section */}
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
    {/* Background effects */}
    <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] animate-pulse-slow" />
    </div>
    
    {/* Grid pattern */}
    <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
        backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
        }}
    />

    <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
        <Lock className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-medium text-primary">End-to-end encrypted by default</span>
        </div>

        {/* Logo */}
        <div className="mb-8 flex justify-center animate-fade-in" style={{animationDelay: '0.1s'}}>
        <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-card border-glow flex items-center justify-center animate-float">
            <Shield className="w-12 h-12 text-primary" />
            </div>
            <div className="absolute -inset-3 bg-primary/20 rounded-[2rem] blur-xl -z-10 animate-glow-pulse" />
        </div>
        </div>

        {/* Title */}
        <h1 className="font-mono text-5xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight animate-fade-in" style={{animationDelay: '0.2s'}}>
        <span className="text-gradient">sect</span>
        </h1>

        <p className="text-xl sm:text-2xl text-foreground/90 mb-4 animate-fade-in" style={{animationDelay: '0.3s'}}>
        Messaging for the paranoid.
        </p>

        <p className="text-muted-foreground text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.4s'}}>
        No phone number. No email. No trace. Connect with people using only their unique identifier. 
        Your conversations remain yours—encrypted, anonymous, and ephemeral.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{animationDelay: '0.5s'}}>
        <Button onClick={() => navigate("/chats")}>
            <Lock className="w-5 h-5 mr-2" />
            Start Secure Chat
            <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto animate-fade-in" style={{animationDelay: '0.6s'}}>
        <div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-primary">50K+</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Active Users</p>
        </div>
        <div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-primary">10M+</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Messages Sent</p>
        </div>
        <div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-primary">0</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Data Breaches</p>
        </div>
        </div>
    </div>
    </section>

    {/* Features Section */}
    <section id="features" className="py-20 px-4 bg-gradient-card border-y border-border/50">
    <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
        <p className="text-primary font-mono text-sm mb-3">FEATURES</p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Privacy without compromise
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
            Built from the ground up with security as the foundation, not an afterthought.
        </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
            <div 
            key={index}
            className="group bg-card/50 border border-border/50 rounded-2xl p-6 hover:border-primary/30 hover:bg-card transition-all duration-300"
            >
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:glow-primary transition-all duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
        ))}
        </div>
    </div>
    </section>

    {/* How It Works */}
    <section className="py-20 px-4">
    <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
        <p className="text-primary font-mono text-sm mb-3">HOW IT WORKS</p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Three steps to total privacy
        </h2>
        </div>

        <div className="space-y-8">
        {[
            { step: "01", title: "Get Your UUID", description: "Sign up instantly—no personal information required. You'll receive a unique identifier that serves as your anonymous identity." },
            { step: "02", title: "Share Securely", description: "Share your messages with trusted contacts through any secure channel." },
            { step: "03", title: "Chat Freely", description: "Start encrypted conversations with complete anonymity. Messages are encrypted on your device and never stored on our servers." }
        ].map((item, index) => (
            <div key={index} className="flex gap-6 items-start group">
            <div className="shrink-0 w-16 h-16 rounded-2xl bg-gradient-card border-glow flex items-center justify-center font-mono text-xl font-bold text-primary group-hover:glow-primary transition-all duration-300">
                {item.step}
            </div>
            <div className="pt-2">
                <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
            </div>
        ))}
        </div>
    </div>
    </section>

    {/* Testimonials */}
    <section className="py-20 px-4">
    <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
        <p className="text-primary font-mono text-sm mb-3">TESTIMONIALS</p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Trusted by privacy advocates
        </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
            <div 
            key={index}
            className="bg-card/50 border border-border/50 rounded-2xl p-6"
            >
            <p className="text-foreground/90 mb-6 leading-relaxed">"{testimonial.quote}"</p>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="font-mono font-semibold text-primary">{testimonial.avatar}</span>
                </div>
                <div>
                <p className="font-medium text-sm">{testimonial.author}</p>
                <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
            </div>
            </div>
        ))}
        </div>
    </div>
    </section>

    {/* FAQ Section */}
    <section id="faq" className="py-20 px-4 bg-gradient-card border-y border-border/50">
    <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
        <p className="text-primary font-mono text-sm mb-3">FAQ</p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Common questions
        </h2>
        </div>

        <div className="space-y-3">
        {faqs.map((faq, index) => (
            <div 
            key={index}
            className="bg-card/50 border border-border/50 rounded-xl overflow-hidden"
            >
            <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-card/50 transition-colors"
            >
                <span className="font-medium">{faq.question}</span>
                <ChevronDown className={cn(
                "w-5 h-5 text-muted-foreground transition-transform duration-200",
                openFaq === index && "rotate-180"
                )} />
            </button>
            <div className={cn(
                "grid transition-all duration-200",
                openFaq === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            )}>
                <div className="overflow-hidden">
                <p className="px-4 pb-4 text-muted-foreground text-sm leading-relaxed">
                    {faq.answer}
                </p>
                </div>
            </div>
            </div>
        ))}
        </div>
    </div>
    </section>

    {/* Final CTA */}
    <section className="py-24 px-4 relative overflow-hidden">
    <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
    </div>
    
    <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-card border-glow flex items-center justify-center mx-auto mb-8 animate-float">
        <Shield className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
        Ready to go dark?
        </h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
        Join thousands of users who've made the switch to truly private communication. 
        No registration, no tracking, no compromise.
        </p>
        <Button onClick={() => navigate("/chats")}>
        <Lock className="w-5 h-5 mr-2" />
        Enter the Sect
        <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
    </div>
    </section>

    {/* Footer */}
    <footer className="py-12 px-4 border-t border-border/50">
    <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
            </div>
            <span className="font-mono font-bold text-gradient">sect</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="*" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="*" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link to="*" className="hover:text-foreground transition-colors">Security</Link>
            <Link to="*" className="hover:text-foreground transition-colors">Contact</Link>
        </div>
        <p className="text-xs text-muted-foreground">
            © 2026 Sect. All rights reserved.
        </p>
        </div>
    </div>
    </footer>
</div>
);
};

export default LandingPage;