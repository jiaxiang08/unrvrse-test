import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// --- Type Definitions and Global Setup ---
declare global {
  interface Window {
    Telegram: any;
  }
}

const container = document.getElementById('root');
if (!container) throw new Error("Root element not found");
const root = createRoot(container);

// --- APPLICATION INITIALIZATION ---

// --- DATA FROM PYTHON SCRIPT (PORTED TO TS) ---
const APP_DATA = {
    resume: {
        name: "Jia Xiang",
        title: "Design Thinker",
        summary: "A multidisciplinary designer and researcher with expertise in applying design thinking. Driven by a passion for improving lives through thoughtful design and strategic problem-solving.",
        coreCompetencies: [
            "Design Thinking & Human-Centered Design",
            "Creative Direction & Branding",
            "Communicating Data & Research",
            "AI Integration in Design & Workflow",
        ],
    },
    traits: {
        energy: { "label": "Energy", "score": 75, "dominant": "Introverted", "description": "You likely prefer fewer, yet deep and meaningful, social interactions and feel drawn to calmer environments." },
        mind: { "label": "Mind", "score": 94, "dominant": "Intuitive", "description": "You're likely very imaginative and open-minded, focusing on hidden meanings and distant possibilities." },
        nature: { "label": "Nature", "score": 74, "dominant": "Feeling", "description": "You likely value emotional expression and sensitivity, prioritizing empathy, social harmony, and cooperation." },
        tactics: { "label": "Tactics", "score": 86, "dominant": "Prospecting", "description": "You're likely very adaptable, easygoing and flexible, prioritizing spontaneity over stability." },
        identity: { "label": "Identity", "score": 65, "dominant": "Turbulent", "description": "You're likely self-conscious, sensitive to stress, success-driven, perfectionistic, and eager to improve." }
    },
    schemas: {
        "Insufficient Self-Control": { "score": 24.5, "definition": "Pervasive difficulty or refusal to exercise sufficient self-control and frustration tolerance to achieve one's personal goals." },
        "Abandonment": { "score": 23, "definition": "The perceived instability or unreliability of those available for support and connection." },
        "Entitlement": { "score": 23, "definition": "The belief that one is superior to other people; entitled to special rights and privileges; or not bound by the rules of reciprocity." },
        "Pessimism": { "score": 22, "definition": "A pervasive, life-long focus on the negative aspects of life while minimizing or neglecting the positive or optimistic aspects." },
        "Mistrust/Abuse": { "score": 21, "definition": "The expectation that others will hurt, abuse, humiliate, cheat, lie, manipulate, or take advantage." },
        "Social Isolation": { "score": 19, "definition": "The feeling that one is isolated from the rest of the world, different from other people, and/or not part of any group or community." },
    },
    growth_plan: [
        { "liability": "Struggling with Pragmatism / Finding Structure", "strategies": ["Translate visionary ideas into concrete 'first steps' no matter how small.", "Partner with a pragmatist who can handle logistics.", "Use 'time-blocking' for essential tasks, but leave large blocks free for deep work."] },
        { "liability": "Reacting Personally to Criticism", "strategies": ["Create a 'feedback buffer': wait 24 hours before responding to significant criticism.", "Reframe feedback as a gift that helps you improve, not a judgment on your worth.", "Assume positive intent and ask clarifying questions."] },
        { "liability": "Difficulty Setting Boundaries / Advocating for Self", "strategies": ["Prepare scripts for common situations where you need to say 'no'.", "Define your 'non-negotiables' for your time and energy.", "Schedule 'you' time in your calendar and treat it as an unbreakable appointment."] },
        { "liability": "Hesitance to Take Action / Overcoming Indecision", "strategies": ["Embrace the 'reversible decision' framework: if a decision isn't permanent, you can make it faster.", "Limit your research time. Set a timer, then make a choice.", "Define the 'good enough' outcome instead of striving for the 'perfect' one."] }
    ],
    six_hats: {
        white: { "title": "The White Hat: Pure Information", "prompt": "Act as a data analyst wearing the White Hat for an INFP-T. Provide objective information, facts, and key data points related to the following topic. Do not include opinions or feelings. Structure your response with the heading '### Factual Analysis'." },
        red: { "title": "The Red Hat: Emotions & Intuition", "prompt": "Act as an intuitive guide wearing the Red Hat for an INFP-T. Provide emotional reactions, gut feelings, and intuitive responses to the following topic. Do not provide reasons or justifications. Structure your response with the heading '### Intuitive & Emotional Read'." },
        black: { "title": "The Black Hat: Caution & Critical Judgment", "prompt": "Act as a risk analyst wearing the Black Hat for an INFP-T. Your user can be sensitive to criticism, so frame the points constructively. Identify potential risks, problems, and reasons for caution regarding the following topic. Be critical but not dismissive. Structure your response with the heading '### Constructive Caution'." },
        yellow: { "title": "The Yellow Hat: Optimism & Benefits", "prompt": "Act as an optimistic strategist wearing the Yellow Hat for an INFP-T. Identify the benefits, advantages, and positive aspects of the following topic. Be encouraging and focus on the value and potential. Structure your response with the heading '### Benefits & Potential'." },
        green: { "title": "The Green Hat: Creativity & New Ideas", "prompt": "Act as a creative muse wearing the Green Hat for an INFP-T. Your user is naturally imaginative; your role is to push them even further. Generate creative, new, and alternative ideas related to the following topic. Be provocative and do not criticize any ideas. Structure your response with the heading '### Creative Possibilities'." },
        blue: { "title": "The Blue Hat: Process Control & Overview", "prompt": "Act as a strategic facilitator wearing the Blue Hat for an INFP-T. Your user can be Prospecting (flexible) and may need help with structure. Provide a process overview, suggest next steps, or summarize the thinking required for the following topic. Focus on managing the thinking process itself. Structure your response with the heading '### Strategic Overview'." }
    },
    career: {
        environments: { "title": "Ideal Work Environments", "points": ["Roles that value creativity, innovation, and original thought.", "Flexible work arrangements that allow for autonomy and non-linear processes.", "Mission-driven organizations (non-profits, education, arts, human-centered tech).", "Calm, focused settings that allow for deep work."] },
        collaboration: { "title": "Collaboration & Communication Strategy", "points": ["Leverage your empathy to mediate conflicts and build a supportive team atmosphere.", "Embrace your role as the 'visionary' and actively seek pragmatic partners for execution.", "Clearly communicate your need for focused, independent work time.", "Frame disagreements around shared values or user needs to avoid direct conflict."] }
    },
    booklet: {
        actions: [
            { "symbol": "+", "title": "Add", "description": "Combine unrelated things to create something new." },
            { "symbol": "−", "title": "Subtract", "description": "Remove unnecessary elements to simplify or open a new market." },
            { "symbol": "×", "title": "Multiply", "description": "Scale up an idea or specialize it for a niche market." },
            { "symbol": "÷", "title": "Divide", "description": "Break down a product into smaller, more accessible units." },
            { "symbol": "↻", "title": "Rotate", "description": "Reverse your thinking or look at a problem from an opposite direction." },
            { "symbol": "→", "title": "Use", "description": "Change the purpose of something, finding new ways to utilize items." },
            { "symbol": "⏳", "title": "Time", "description": "Consider the influence of time. Old concepts can be repackaged." }
        ],
        qualities: [
            { "symbol": "樂", "title": "Optimism", "description": "The fundamental belief that opportunities exist even in adversity." },
            { "symbol": "童", "title": "Innocence", "description": "Maintaining a curious, open, and non-judgmental mind." },
            { "symbol": "膽", "title": "Courage", "description": "The willingness to challenge established norms and take calculated risks." },
            { "symbol": "練", "title": "Practice", "description": "Creativity is a muscle that strengthens with consistent effort." },
            { "symbol": "壓", "title": "Pressure", "description": "The focused, intense struggle required for true breakthroughs." },
            { "symbol": "放", "title": "Relaxation", "description": "Allowing the subconscious mind to work by stepping away from a problem." },
            { "symbol": "日夜", "title": "Day-Night", "description": "A state of persistent, relentless thinking where a problem occupies your mind around the clock." }
        ]
    }
};

const getFullProfileContext = () => {
    const profileData = {
        resume_summary: APP_DATA.resume.summary,
        traits: APP_DATA.traits,
        top_schemas: Object.fromEntries(Object.entries(APP_DATA.schemas).sort(([, a], [, b]) => b.score - a.score).slice(0, 5)),
        growth_strategies: APP_DATA.growth_plan,
        career_preferences: APP_DATA.career
    };
    return `CLIENT'S FULL PROFILE DATA (INFP-T): ${JSON.stringify(profileData)}`;
};

const callGemini = async (prompt: string): Promise<string> => {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Backend API call failed:", data.error);
            return `Error: The server responded with an error. ${data.error || 'Unknown server error.'}`;
        }
        
        return data.text;
    } catch (error) {
        console.error("Failed to fetch from backend API:", error);
        return "Error: Could not connect to the application's backend. Please check the network connection and server status.";
    }
};

// --- HOOKS ---
const useTelegramMainButton = ({
    text,
    onClick,
    isProgressVisible = false,
    isVisible = true,
    isEnabled = true,
}: {
    text: string;
    onClick: () => void;
    isProgressVisible?: boolean;
    isVisible?: boolean;
    isEnabled?: boolean;
}) => {
    const handleClick = useCallback(onClick, [onClick]);

    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (!tg) return;

        if (isVisible) {
            tg.MainButton.setText(text);
            tg.MainButton.onClick(handleClick);
            tg.MainButton.show();

            return () => {
                tg.MainButton.offClick(handleClick);
            };
        } else {
            tg.MainButton.hide();
        }
    }, [text, handleClick, isVisible]);
    
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (!tg || !isVisible) return;
        
        if (isEnabled) {
            tg.MainButton.enable();
        } else {
            tg.MainButton.disable();
        }
    }, [isEnabled, isVisible]);

    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (!tg || !isVisible) return;

        if (isProgressVisible) {
            tg.MainButton.showProgress();
        } else {
            tg.MainButton.hideProgress();
        }
    }, [isProgressVisible, isVisible]);
};


// --- UI COMPONENTS ---
const LoadingSpinner = ({ small = false }: { small?: boolean }) => (
    <div className={small ? "loading-spinner" : "loading-indicator"}>
        <div className={small ? "loading-spinner" : "spinner-large loading-spinner"}></div>
        {!small && <span>Analyzing...</span>}
    </div>
);

const AIResponse = ({ content }: { content: string }) => {
    const [sendState, setSendState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSendToChat = async () => {
        const tg = window.Telegram?.WebApp;
        if (!tg || !content) return;
        
        const chatId = tg.initDataUnsafe?.user?.id;
        if (!chatId) {
            alert("Error: Could not identify Telegram user.");
            return;
        }

        setSendState('sending');
        tg.HapticFeedback.impactOccurred('light');

        try {
            const response = await fetch('/api/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatId, text: content }),
            });

            if (!response.ok) {
                throw new Error('Server responded with an error.');
            }
            
            setSendState('success');
            tg.HapticFeedback.notificationOccurred('success');
            setTimeout(() => setSendState('idle'), 2000); // Reset after 2s
        } catch (error) {
            console.error("Failed to send message to chat:", error);
            setSendState('error');
            tg.HapticFeedback.notificationOccurred('error');
            alert("There was an error sending the message. Please ensure the backend function is deployed correctly.");
            setTimeout(() => setSendState('idle'), 3000);
        }
    };

    const formattedContent = content.split('\n').map((line, i) => {
        if (line.startsWith('### ')) return <h3 key={i}>{line.substring(4)}</h3>;
        if (line.startsWith('* ')) return <li key={i}>{line.substring(2)}</li>;
        if (line.startsWith('• ')) return <li key={i}>{line.substring(2)}</li>;
        return <p key={i}>{line}</p>;
    });

    const listItems = formattedContent.filter(item => item.type === 'li');
    const otherItems = formattedContent.filter(item => item.type !== 'li');

    const getButtonText = () => {
        switch (sendState) {
            case 'sending': return 'Sending...';
            case 'success': return 'Sent!';
            case 'error': return 'Failed. Retry?';
            default: return 'Send Summary to Chat';
        }
    };

    return (
        <div className="ai-response">
            {otherItems}
            {listItems.length > 0 && <ul>{listItems}</ul>}
            <div className="response-actions">
                 <button 
                    onClick={handleSendToChat} 
                    className={`secondary-button ${sendState}`}
                    disabled={sendState === 'sending' || sendState === 'success'}>
                    {getButtonText()}
                </button>
            </div>
        </div>
    );
};

const AITool = ({ title, description, formLabel, buttonText, promptBuilder }) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input || isLoading) return;
        window.Telegram?.WebApp?.HapticFeedback.impactOccurred('light');
        setIsLoading(true);
        setError('');
        setResponse('');
        const prompt = promptBuilder(input);
        const result = await callGemini(prompt);
        if (result.startsWith("Error:")) {
            setError(result);
        } else {
            setResponse(result);
        }
        setIsLoading(false);
    };
    
    const handleMainButtonClick = useCallback(() => {
        formRef.current?.requestSubmit();
    }, []);

    useTelegramMainButton({
        text: buttonText,
        onClick: handleMainButtonClick,
        isEnabled: !isLoading && !!input,
        isProgressVisible: isLoading,
    });

    return (
        <>
            <h2>{title}</h2>
            <p>{description}</p>
            <form ref={formRef} onSubmit={handleSubmit} className="content-card">
                <div className="form-group">
                    <label htmlFor="ai-input">{formLabel}</label>
                    <textarea
                        id="ai-input"
                        className="text-area"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter your thoughts here..."
                        disabled={isLoading}
                        aria-busy={isLoading}
                    />
                </div>
                <button type="submit" className="submit-button">
                    {isLoading && <LoadingSpinner small />}
                    {buttonText}
                </button>
            </form>
            {isLoading && <LoadingSpinner />}
            {error && <div className="ai-response"><p style={{color: '#ff8a80'}}>{error}</p></div>}
            {response && <AIResponse content={response} />}
        </>
    );
};

// --- VIEWS ---
const ProfileView = () => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            const prompt = `
                You are a master synthesizer and personality analyst.
                I am providing you with the complete profile of an INFP-T.
                ${getFullProfileContext()}
                **YOUR TASK:**
                Write a concise, insightful, and encouraging synthesized summary of the entire profile. You must:
                1. Start with a strong, overarching statement that captures the core essence of this individual.
                2. Weave together the key threads from their INFP traits and dominant life schemas.
                3. Identify the central tension or primary growth challenge revealed by the data.
                4. Conclude with a powerful, forward-looking statement of potential.
                Structure the response with a single '### Holistic Profile Synthesis' heading. The tone should be empowering and insightful.
            `;
            const result = await callGemini(prompt);
            setSummary(result);
            setIsLoading(false);
        };
        fetchSummary();
    }, []);

    return (
        <>
            <h2>Profile Synthesis</h2>
            <p>An AI-generated holistic overview of your personality, schemas, and growth areas.</p>
            {isLoading ? <LoadingSpinner /> : <AIResponse content={summary} />}
        </>
    );
};

const TraitsView = () => (
    <>
        <h2>Core Traits</h2>
        <p>Your personality trait scores based on the INFP-T profile.</p>
        <div className="grid-container">
            {Object.values(APP_DATA.traits).map(trait => (
                <div key={trait.label} className="content-card">
                    <h3>{trait.label} ({trait.dominant}) - {trait.score}%</h3>
                    <p>{trait.description}</p>
                </div>
            ))}
        </div>
    </>
);

const SchemasView = () => (
    <>
        <h2>Life Schemas</h2>
        <p>Your most dominant life schemas, representing deep-seated patterns of thought and behavior.</p>
        <div className="grid-container">
            {Object.entries(APP_DATA.schemas).map(([name, data]) => (
                 <div key={name} className="content-card">
                    <h3>{name} (Score: {data.score})</h3>
                    <p>{data.definition}</p>
                </div>
            ))}
        </div>
    </>
);

const CreativeBookletView = () => (
    <>
        <h2>Creative Booklet</h2>
        <p>Tools and mindsets to foster innovation and creativity.</p>
        <div className="content-card">
            <h3>Creative Actions</h3>
            <p>Methods to manipulate ideas and create new ones.</p>
            {APP_DATA.booklet.actions.map(item => (
                <p key={item.title}><strong>{item.symbol} {item.title}:</strong> {item.description}</p>
            ))}
        </div>
        <div className="content-card">
            <h3>Essential Qualities</h3>
            <p>The core traits for a creative mindset.</p>
             {APP_DATA.booklet.qualities.map(item => (
                <p key={item.title}><strong>{item.symbol} {item.title}:</strong> {item.description}</p>
            ))}
        </div>
    </>
);

const GrowthPlanView = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState('');

    const handleSelectPlan = async (plan) => {
        window.Telegram?.WebApp?.HapticFeedback.impactOccurred('medium');
        setSelectedPlan(plan);
        setIsLoading(true);
        setResponse('');
        const prompt = `
            You are an expert life coach. Your client, an INFP-T, needs hyper-personalized strategies for a specific growth area.
            Their profile context is: ${getFullProfileContext()}.
            **CLIENT'S CURRENT REQUEST:**
            - **Growth Area:** "${plan.liability}"

            **YOUR TASK:**
            Generate a concise, insightful, and actionable strategy. You must:
            1. Directly reference 1-2 CORE traits or SCHEMAS from their profile that are most relevant to this challenge.
            2. Provide concrete tactics to mitigate this specific liability, tailored to their personality.
            3. Structure the response using a single '### Personalized Strategies' heading. Be encouraging and deeply personalized.
        `;
        const result = await callGemini(prompt);
        setResponse(result);
        setIsLoading(false);
    };

    return (
        <>
            <h2>Growth Plan</h2>
            <p>Select a personalized growth area to get tailored AI-driven strategies.</p>
            <div className="grid-container">
                {APP_DATA.growth_plan.map((plan, index) => (
                    <div key={index} className="content-card clickable-card" onClick={() => handleSelectPlan(plan)} role="button" tabIndex={0}>
                        <h3>{plan.liability}</h3>
                        <p>Click to generate personalized strategies.</p>
                    </div>
                ))}
            </div>
            {isLoading && <LoadingSpinner />}
            {response && selectedPlan && 
                <div className="ai-response-container">
                    <h2>Strategies for: {selectedPlan.liability}</h2>
                    <AIResponse content={response} />
                </div>
            }
        </>
    );
};

const CareerStrategyView = () => {
    const [jobTitle, setJobTitle] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!jobTitle || !jobDesc || isLoading) return;
        window.Telegram?.WebApp?.HapticFeedback.impactOccurred('heavy');
        setIsLoading(true);
        setError('');
        setResponse('');
        const prompt = `
            Act as an expert career coach writing a cover letter draft for an INFP-T named ${APP_DATA.resume.name}.
            Their profile is: ${getFullProfileContext()}.
            The job is for a "${jobTitle}" with these duties: "${jobDesc}".
            
            Generate a complete, personalized cover letter draft. It must use an authentic, professional voice, connect their unique INFP-T strengths (like creativity, empathy, and big-picture thinking) to the job requirements, and include placeholders like [Company Name] and "[Here, mention a specific project...]" to guide them. The output should be formatted in standard cover letter style.
        `;
        const result = await callGemini(prompt);
        if (result.startsWith("Error:")) {
            setError(result);
        } else {
            setResponse(result);
        }
        setIsLoading(false);
    };

    const handleMainButtonClick = useCallback(() => {
        formRef.current?.requestSubmit();
    }, []);

    useTelegramMainButton({
        text: "Generate Draft",
        onClick: handleMainButtonClick,
        isEnabled: !isLoading && !!jobTitle && !!jobDesc,
        isProgressVisible: isLoading,
    });

    return (
        <>
            <h2>Career Strategy</h2>
            <p>Leverage your unique strengths in your professional life.</p>
            <div className="grid-container">
                <div className="content-card">
                    <h3>{APP_DATA.career.environments.title}</h3>
                    <ul>{APP_DATA.career.environments.points.map((p, i) => <li key={i}>{p}</li>)}</ul>
                </div>
                <div className="content-card">
                    <h3>{APP_DATA.career.collaboration.title}</h3>
                    <ul>{APP_DATA.career.collaboration.points.map((p, i) => <li key={i}>{p}</li>)}</ul>
                </div>
            </div>

            <div className="content-card">
                <h3>Cover Letter Assistant</h3>
                <p>Generate a personalized cover letter draft based on your profile and a job description.</p>
                <form ref={formRef} onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="job-title">Job Title</label>
                        <input id="job-title" className="text-input" value={jobTitle} onChange={e => setJobTitle(e.target.value)} disabled={isLoading} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="job-desc">Job Description / Key Responsibilities</label>
                        <textarea id="job-desc" className="text-area" value={jobDesc} onChange={e => setJobDesc(e.target.value)} disabled={isLoading} />
                    </div>
                    <button type="submit" className="submit-button">
                        {isLoading && <LoadingSpinner small />}
                        Generate Draft
                    </button>
                </form>
            </div>
            {isLoading && <LoadingSpinner />}
            {error && <div className="ai-response"><p style={{color: '#ff8a80'}}>{error}</p></div>}
            {response && <AIResponse content={response} />}
        </>
    );
};

const SixHatsView = () => {
    const [activeHat, setActiveHat] = useState(null);
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic || !activeHat || isLoading) return;
        window.Telegram?.WebApp?.HapticFeedback.impactOccurred('heavy');
        setIsLoading(true);
        setError('');
        setResponse('');
        const promptTemplate = APP_DATA.six_hats[activeHat].prompt;
        const fullPrompt = `${promptTemplate} Topic: "${topic}"`;
        const result = await callGemini(fullPrompt);
        if (result.startsWith("Error:")) {
            setError(result);
        } else {
            setResponse(result);
        }
        setIsLoading(false);
    };
    
    const handleMainButtonClick = useCallback(() => {
        formRef.current?.requestSubmit();
    }, []);

    useTelegramMainButton({
        text: "Generate Insights",
        onClick: handleMainButtonClick,
        isVisible: !!activeHat,
        isEnabled: !isLoading && !!topic,
        isProgressVisible: isLoading,
    });

    return (
        <>
            <h2>Six Thinking Hats</h2>
            <p>Use this structured brainstorming technique to explore a topic from multiple perspectives.</p>
            <div className="content-card">
                <h3>1. Select a Hat</h3>
                <div className="hat-selector">
                    {Object.entries(APP_DATA.six_hats).map(([key, hat]) => (
                        <button key={key} onClick={() => setActiveHat(key)} className={`hat-button ${activeHat === key ? 'active' : ''}`}>
                            {hat.title}
                        </button>
                    ))}
                </div>
                {activeHat && (
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <h3>2. Define Your Topic</h3>
                        <div className="form-group">
                             <label htmlFor="hat-topic">Topic for {APP_DATA.six_hats[activeHat].title}</label>
                            <input
                                id="hat-topic"
                                className="text-input"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., 'Starting a new creative project'"
                                disabled={isLoading}
                                aria-busy={isLoading}
                            />
                        </div>
                        <button type="submit" className="submit-button">
                            {isLoading && <LoadingSpinner small />}
                            Generate Insights
                        </button>
                    </form>
                )}
            </div>
            {isLoading && <LoadingSpinner />}
            {error && <div className="ai-response"><p style={{color: '#ff8a80'}}>{error}</p></div>}
            {response && <AIResponse content={response} />}
        </>
    );
};

const App = () => {
    const [activeView, setActiveView] = useState('profile');
    const [userName, setUserName] = useState(APP_DATA.resume.name); // Default name

    useEffect(() => {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        document.body.classList.add('telegram-app');
        
        const user = tg.initDataUnsafe?.user;
        if (user) {
          setUserName(user.first_name || user.username || APP_DATA.resume.name);
        }

        const applyTheme = () => {
          if (tg.colorScheme === 'dark') {
            document.body.classList.add('dark-theme');
          } else {
            document.body.classList.remove('dark-theme');
          }
        };

        applyTheme();
        tg.onEvent('themeChanged', applyTheme);

        return () => {
          tg.offEvent('themeChanged', applyTheme);
        };
      } else {
        // Fallback for non-Telegram environment (local development)
        document.body.classList.add('dark-theme');
      }
    }, []);
    
    const handleNavClick = (view: string) => {
        window.Telegram?.WebApp?.HapticFeedback.impactOccurred('light');
        setActiveView(view);
    }

    const renderView = () => {
        switch (activeView) {
            case 'profile': return <ProfileView />;
            case 'traits': return <TraitsView />;
            case 'schemas': return <SchemasView />;
            case 'creative': return <CreativeBookletView />;
            case 'growth': return <GrowthPlanView />;
            case 'career': return <CareerStrategyView />;
            case 'analyzer': return <AITool 
                title="Pattern Analyzer"
                description="Describe a recent situation, a recurring thought, or a journal entry. The AI will analyze it to identify activated traits and schemas."
                formLabel="Your text to analyze"
                buttonText="Analyze Pattern"
                promptBuilder={(input) => `
                    You are a cognitive analyst AI specializing in personality patterns. Your user has an INFP-T personality profile: ${getFullProfileContext()}.
                    The user provided this text: "${input}"

                    **YOUR TASK:**
                    Analyze this text to identify the most activated personality traits and schemas. Also, identify cognitive distortions and provide an insight.
                    Structure your response with three headings: '### Core Dynamic', '### Potential Distortions', and '### Actionable Insight'.
                `}
            />;
            case 'reframer': return <AITool 
                title="Cognitive Reframer"
                description="Enter a recurring, automatic negative thought you'd like to challenge and reframe."
                formLabel="Negative thought to reframe"
                buttonText="Challenge & Reframe"
                promptBuilder={(input) => `
                    You are an expert CBT coach. Your client, an INFP-T, is working on reframing a negative thought.
                    Their profile context is: ${getFullProfileContext()}.
                    **CLIENT'S NEGATIVE THOUGHT:** "${input}"

                    **YOUR TASK:**
                    Analyze the thought in the context of their full profile.
                    1. Identify the most likely cognitive distortions at play.
                    2. Connect the thought to one of their specific life schemas.
                    3. Provide guiding, Socratic questions to help them reframe the thought themselves.
                    
                    Structure the response with three headings: '### Identifying Distortions', '### Connection to Your Patterns', and '### Guiding Questions for Reframing'.
                `}
            />;
            case 'sixhats': return <SixHatsView />;
            default: return <ProfileView />;
        }
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1>{userName}'s Toolkit</h1>
                    <p>{APP_DATA.resume.title}</p>
                </div>
                <nav>
                    <button onClick={() => handleNavClick('profile')} className={`nav-button ${activeView === 'profile' ? 'active' : ''}`}>Profile Synthesis</button>
                    <button onClick={() => handleNavClick('traits')} className={`nav-button ${activeView === 'traits' ? 'active' : ''}`}>Core Traits</button>
                    <button onClick={() => handleNavClick('schemas')} className={`nav-button ${activeView === 'schemas' ? 'active' : ''}`}>Life Schemas</button>
                    <button onClick={() => handleNavClick('creative')} className={`nav-button ${activeView === 'creative' ? 'active' : ''}`}>Creative Booklet</button>
                    <button onClick={() => handleNavClick('growth')} className={`nav-button ${activeView === 'growth' ? 'active' : ''}`}>Growth Plan</button>
                    <button onClick={() => handleNavClick('career')} className={`nav-button ${activeView === 'career' ? 'active' : ''}`}>Career Strategy</button>

                    <div className="nav-group">
                        <h3 className="nav-group-title">AI Tools</h3>
                        <button onClick={() => handleNavClick('analyzer')} className={`nav-button ${activeView === 'analyzer' ? 'active' : ''}`}>Pattern Analyzer</button>
                        <button onClick={() => handleNavClick('reframer')} className={`nav-button ${activeView === 'reframer' ? 'active' : ''}`}>Cognitive Reframer</button>
                        <button onClick={() => handleNavClick('sixhats')} className={`nav-button ${activeView === 'sixhats' ? 'active' : ''}`}>Six Thinking Hats</button>
                    </div>
                </nav>
            </aside>
            <main className="main-content">
                {renderView()}
            </main>
        </div>
    );
};

// Render the App
root.render(<App />);
