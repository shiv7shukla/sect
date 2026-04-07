import { useState } from "react";
import LandingPage from "@/components/LandingPage";

const Index = () => {
const [hasEntered, setHasEntered] = useState(false);

if (hasEntered)
    return <ChatInterface />

return <LandingPage onEnterChat={() => setHasEntered(true)} />;
};

export default Index;
