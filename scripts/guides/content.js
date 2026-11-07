// Content for the guide, comparison and trust pages. build-guides.js turns each entry into <slug>.html.
// Catchr facts are reused from faq.html and setup.html (2.0 copy review, 2026-11-03).
// Competitor facts: checked 2026-11-05 on each company's own site; sources listed per page.
// Copy rules: no em dashes, no time promises, no "free forever", no invented numbers.

const STORE = 'https://chromewebstore.google.com/detail/kleffbpannecinoopgebbdhkfpkjhbia';

const ext = (href, text) => `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
const AISTUDIO = ext('https://aistudio.google.com/apikey', 'Google AI Studio');
const CONSOLE = ext('https://console.anthropic.com/settings/keys', 'Anthropic Console');
const PLATFORM = ext('https://platform.openai.com/api-keys', 'OpenAI Platform');

// Shared "use the key in Catchr" step for the paid providers.
const paidCatchrStep = (ai, company, host) => `Open the Catchr extension and choose <strong>${ai}</strong> as your AI (in setup, or in <strong>Settings</strong> if you already use Catchr). Catchr shows what it will send to ${company}. Click <strong>Use ${ai}</strong> to agree. Chrome then asks to let Catchr read and change your data on <strong>${host}</strong>. Click <strong>Allow</strong>. That only lets Catchr send your requests to ${company}, and no other site. Then paste your key. Catchr checks it right away and shows <strong>Valid</strong>.`;

const KEY_SHOT = { src: 'assets/guide-key-valid.webp', alt: 'Catchr setup screen with a pasted Gemini API key marked Valid.', caption: 'Catchr checks your Gemini key as soon as you paste it.' };

const REJECTED = ['“That key was rejected. Double-check it.”', 'The AI company turned the key down when Catchr checked it. Make sure you copied the whole key, and that it\'s for the AI you picked: a Gemini key won\'t work for Claude.'];
const INVALID_FIX = 'Open Catchr\'s <strong>Settings</strong>, click <strong>Change</strong> next to your key and paste the full key again. Check that nothing was cut off at either end. Lost it? Make a new key where you made the first one.';
const PAID_PROBLEMS = (ai, company) => [
  [`“Catchr needs your OK before sending your resume to ${ai}. Open Settings (⚙️) to review what is shared.”`, `Open Settings, read what gets sent, and click <strong>Use ${ai}</strong>. Or switch back to Gemini.`],
  ['“Catchr needs your permission to use this AI provider. Open Settings (⚙️) and click Allow access.”', `Catchr\'s access to ${company} was turned off in Chrome. Open Settings and click <strong>Allow access</strong>, then <strong>Allow</strong> when Chrome asks. Your saved key stays in place.`],
  ['“You’ve hit your provider’s rate limit or quota. Wait a moment, or check your plan and billing with your provider.”', `Wait a moment and try again. If it keeps happening, check that your ${company} account still has credit in its billing settings.`],
  REJECTED,
  ['“That API key looks invalid. Check it in your provider’s console, then update it in Settings (⚙️).”', INVALID_FIX],
];

module.exports = [
  // ───────────────────────────── KEY GUIDES ─────────────────────────────
  {
    slug: 'gemini-api-key', type: 'guide', eyebrow: 'Guide',
    title: 'How to Get a Free Gemini API Key | Catchr',
    h1: 'How to get a free Gemini API key',
    sub: 'A Gemini key lets tools like Catchr use Google\'s AI. Here\'s how to make one, and what the free tier includes.',
    description: 'Step by step: make a Gemini API key in Google AI Studio, what the free tier includes, when you need billing, and how to fix common key errors.',
    short: 'Sign in to Google AI Studio with your Google account, click <strong>Get API key</strong>, then <strong>Create API key</strong>, and copy it. Gemini has a free tier with daily limits, though Google doesn\'t offer it on every account or in every region.',
    shot: KEY_SHOT,
    sections: [
      { h: 'How do I make a Gemini API key?', answer: 'In Google AI Studio, in four steps.', steps: [
        `Go to ${AISTUDIO} and sign in with your Google account.`,
        'Click <strong>Get API key</strong> in the left sidebar.',
        'Click <strong>Create API key</strong> and select or create a Google Cloud project when prompted. If you don\'t have a project yet, click <strong>Create new project</strong>.',
        'Copy the key that appears. Keep it private, like a password.',
      ] },
      { h: 'How do I use the key in Catchr?', answer: 'Choose Gemini, then paste the key.', detail: 'In Catchr, choose <strong>Gemini</strong> under <strong>Choose your AI</strong> and click <strong>Continue</strong>. Paste the key into <strong>Gemini API key</strong>. Catchr checks it right away and shows <strong>Valid</strong>. Already set up? Open <strong>Settings</strong>, click <strong>Change</strong> next to your key and paste the new one.' },
      { h: 'Is the Gemini API free?', answer: 'Gemini has a free tier with daily limits, where Google offers it.', detail: `If you hit a limit, wait for it to reset. Google won't charge you unless you turn on billing for your key yourself. Google doesn't offer the free tier on every account. Current limits and prices are on ${ext('https://ai.google.dev/gemini-api/docs/pricing', 'Google\'s Gemini pricing page')}.` },
      { h: 'What does Google do with free-tier requests?', answer: 'On the free tier, Google may use what you send to improve its AI, and its reviewers may read it.', detail: 'Turning on billing for your key\'s project in Google AI Studio stops Google using it to improve its AI, though Google may still keep requests for a limited time to check for misuse. Google\'s free-tier terms also say not to submit personal, confidential, or sensitive information. Catchr does its best to remove your name and contact details from your resume before sending it, but it can miss some.' },
      { h: 'My older Gemini key stopped working. What do I do?', answer: 'Make a new key in Google AI Studio and paste it into Catchr.', detail: `Google is moving the Gemini API to a newer kind of key and has said it will stop accepting older keys. New keys made in Google AI Studio use the newer kind. Details are on ${ext('https://ai.google.dev/gemini-api/docs/api-key', 'Google\'s API key page')}.` },
      { h: 'Does it work in the EU or UK?', answer: 'Yes, with billing turned on.', detail: 'In the EU, Iceland, Liechtenstein, Norway, Switzerland, or the UK, Google allows only paid Gemini access. Turn on billing for your key\'s project in Google AI Studio before you use the key.' },
    ],
    problems: [
      ['“Google isn\'t offering Gemini\'s free tier on this account. Set up billing in Google AI Studio, or switch to Claude or ChatGPT in Settings.”', 'Google doesn\'t give every account a free tier, and waiting won\'t change it. Turn on billing for your key\'s project in Google AI Studio, or switch to Claude or ChatGPT in Catchr\'s Settings.'],
      ['“Your Gemini quota is used up for now. Wait a few minutes and try again, or check your limits in Google AI Studio.”', 'Your key has hit one of its limits. Free-tier keys have daily limits, and paid keys have rate limits too. Wait a few minutes and try again, or check your limits in Google AI Studio.'],
      ['“Your Gemini key needs to be restricted to the Gemini API. Open it in Google AI Studio, click "Restrict to Gemini API" (or create a new key), then try again.”', 'Create a new key in Google AI Studio and paste it into Catchr\'s <strong>Settings</strong>. Google now makes new keys in its newer format and is retiring older keys, so a new key is the lasting fix.'],
      REJECTED,
      ['“Your Gemini API key looks invalid. Update it in Settings (⚙️).”', INVALID_FIX],
    ],
    related: ['claude-api-key', 'openai-api-key', 'how-catchr-handles-your-data'],
  },
  {
    slug: 'claude-api-key', type: 'guide', eyebrow: 'Guide',
    title: 'How to Get a Claude API Key (Anthropic) | Catchr',
    h1: 'How to get a Claude API key',
    sub: 'Claude\'s API is separate from a Claude subscription. Here\'s how to make a key in the Anthropic Console.',
    description: 'Step by step: make a Claude API key in the Anthropic Console, add credit, and use it in Catchr. Why a Claude Pro subscription doesn\'t include a key.',
    short: 'Create an account in the Anthropic Console, add some credit under <strong>Billing</strong>, then open <strong>API Keys</strong> and click <strong>Create Key</strong>. Copy it right away: Anthropic only shows it once. A Claude Pro or Max subscription doesn\'t include an API key.',
    sections: [
      { h: 'How do I make a Claude API key?', answer: 'In the Anthropic Console, in four steps.', steps: [
        `Go to the ${CONSOLE} and sign in or create an account.`,
        'Open <strong>Settings → Billing</strong> and add credit. The API is pay as you go, so start small, like $5. On a Claude Max, Ultra or Team plan? Your plan may include monthly API credits: claim them first (see below).',
        'Open <strong>API Keys</strong>, click <strong>Create Key</strong>, and name it, for example "Catchr". You can ignore any other settings.',
        'Copy the key right away. Anthropic only shows it once.',
      ] },
      { h: 'How do I use the key in Catchr?', answer: 'Choose Claude, agree to what gets sent, then paste the key.', detail: paidCatchrStep('Claude', 'Anthropic', 'api.anthropic.com') },
      { h: 'Does my Claude subscription include an API key?', answer: 'No. You need a separate Anthropic Console account and key, even if you already pay for Claude.', detail: `The chat app and the API are billed separately. Claude Max, Ultra and Team plans do include monthly API credits: link a Console organization in your Claude billing settings to claim them, then make your key in that organization. Claude Pro doesn\'t include API credits. Details are in ${ext('https://support.claude.com/en/articles/17154008-monthly-api-credits-for-max-ultra-and-team-plans', 'Anthropic\'s help article')}.` },
      { h: 'What does the Claude API cost?', answer: 'You pay Anthropic for what you use, at its own prices. Catchr charges nothing.', detail: `Each use draws from the credit on your account, so check you have some before you start. Current prices are on ${ext('https://platform.claude.com/docs/en/about-claude/pricing', 'Anthropic\'s pricing page')}.` },
      { h: 'Where does my key go?', answer: 'Your key is saved in your browser and sent only to Anthropic, never to us.' },
    ],
    problems: [
      ...PAID_PROBLEMS('Claude', 'Anthropic'),
    ],
    related: ['gemini-api-key', 'openai-api-key', 'how-catchr-handles-your-data'],
  },
  {
    slug: 'openai-api-key', type: 'guide', eyebrow: 'Guide',
    title: 'How to Get an OpenAI API Key for ChatGPT | Catchr',
    h1: 'How to get an OpenAI API key',
    sub: 'Tools that use ChatGPT need an OpenAI API key, which is separate from ChatGPT Plus. Here\'s how to make one.',
    description: 'Step by step: make an OpenAI API key on the OpenAI Platform, add credit, and use it in Catchr. Why ChatGPT Plus doesn\'t include an API key.',
    short: 'Sign in to the OpenAI Platform, check you have credit under <strong>Billing</strong>, then open <strong>API keys</strong> and click <strong>Create new secret key</strong>. Copy it right away: OpenAI only shows it once. ChatGPT Plus or Pro doesn\'t include an API key.',
    sections: [
      { h: 'How do I make an OpenAI API key?', answer: 'On the OpenAI Platform, in four steps.', steps: [
        `Go to the ${PLATFORM} and sign in or create an account.`,
        'Open <strong>Settings → Billing</strong> and check that you have credit. If not, add some. The API is pay as you go, so start small, like $5. On ChatGPT Pro or an eligible Business plan? Claim your included API credits first (see below).',
        'Open <strong>API keys</strong>, click <strong>Create new secret key</strong>, and name it, for example "Catchr". You can ignore any other settings.',
        'Copy the key right away. OpenAI only shows it once.',
      ] },
      { h: 'How do I use the key in Catchr?', answer: 'Choose ChatGPT, agree to what gets sent, then paste the key.', detail: paidCatchrStep('ChatGPT', 'OpenAI', 'api.openai.com') },
      { h: 'Does my ChatGPT subscription include an API key?', answer: 'No. You need a separate OpenAI Platform account and key, even if you already pay for ChatGPT.', detail: `The ChatGPT app and the API are billed separately. ChatGPT Pro and eligible Business plans include monthly API credits you can claim in your billing settings. ChatGPT Plus doesn\'t. Details are in ${ext('https://help.openai.com/en/articles/20001626-api-credits-benefit-for-eligible-chatgpt-subscriptions', 'OpenAI\'s help article')}.` },
      { h: 'What does the OpenAI API cost?', answer: 'You pay OpenAI for what you use, at its own prices. Catchr charges nothing.', detail: `Each use draws from the credit on your account. Current prices are on ${ext('https://developers.openai.com/api/docs/pricing', 'OpenAI\'s pricing page')}.` },
      { h: 'Where does my key go?', answer: 'Your key is saved in your browser and sent only to OpenAI, never to us.' },
    ],
    problems: [
      ...PAID_PROBLEMS('ChatGPT', 'OpenAI'),
    ],
    related: ['gemini-api-key', 'claude-api-key', 'how-catchr-handles-your-data'],
  },

  // ───────────────────────────── HOW-TO GUIDES ─────────────────────────────
  {
    slug: 'tailor-resume-to-job-description', type: 'guide', eyebrow: 'Guide',
    title: 'How to Tailor Your Resume to a Job Description | Catchr',
    h1: 'How to tailor your resume to a job description',
    sub: 'Tailoring means showing the experience a job asks for, in the words it uses. It doesn\'t mean making things up.',
    description: 'A practical way to tailor your resume to a job description: find what the job asks for, match it to what you\'ve done, reword honestly, and keep your original.',
    short: 'Read the job description and list the skills and duties it repeats. Find where your resume already shows each one, then reword those bullets so they use the job\'s terms and lead with results. Work on a copy, and never add experience you don\'t have.',
    shot: { src: 'assets/guide-tailor-ready.webp', alt: 'Catchr popup showing Your tailored resume is ready, with a list of things the job asks for that the resume doesn\'t mention yet.', caption: 'Catchr\'s Tailor Resume works on a copy in Google Docs and lists what your resume doesn\'t mention yet.' },
    sections: [
      { h: 'What does tailoring a resume mean?', answer: 'Making your real experience easy to match to this job.', detail: 'Recruiters and screening software look for the skills and duties in the posting. If you did the work but described it differently, they may miss it. Tailoring closes that gap with better wording and order, not new claims.' },
      { h: 'How do I tailor my resume, step by step?', answer: 'Five steps, on a copy of your resume.', steps: [
        'Make a copy of your resume for this job, so your original stays untouched.',
        'Read the posting and list the skills, tools and duties it mentions more than once, or puts first.',
        'For each one, find the bullet that shows you doing it. Note anything the job asks for that your resume doesn\'t show.',
        'Reword those bullets to use the job\'s terms where they\'re accurate, and lead with the result: what changed because of your work.',
        'Move the most relevant bullets to the top of each role, and trim ones that don\'t help this application.',
      ] },
      { h: 'Should I add skills the job asks for that I don\'t have?', answer: 'No. Only add something if it\'s true.', detail: 'If the job asks for something you\'ve done but left off, add it. If you haven\'t done it, leave it out and be ready to talk about how you\'d learn it. Anything on your resume can come up in an interview.' },
      { h: 'How much should I change for each job?', answer: 'Usually a handful of bullets, plus the order.', detail: 'Most of your resume stays the same between similar roles. The biggest gains come from the top few bullets of your most recent job and the skills that appear in the posting.' },
      { h: 'Can a tool do this for me?', answer: 'It can do the first draft. Check every change before you send it.', detail: 'Catchr\'s <strong>Tailor Resume</strong> rewrites your bullets for the job in a copy of your resume in Google Docs, highlights changes in yellow, adds comments for changes a highlight can\'t show (like a reordered bullet), and lists what the job asks for that your resume doesn\'t mention yet. Your original stays untouched. AI can make mistakes, so read each highlighted change.' },
    ],
    related: ['am-i-qualified-for-this-job', 'gemini-api-key', 'how-catchr-handles-your-data'],
  },
  {
    slug: 'am-i-qualified-for-this-job', type: 'guide', eyebrow: 'Guide',
    title: 'Am I Qualified for This Job? How to Check Before You Apply | Catchr',
    h1: 'How to know if you\'re qualified for a job',
    sub: 'You rarely need to match every line of a job posting. Here\'s how to tell which gaps matter.',
    description: 'How to check whether you\'re qualified for a job before you apply: separate must-haves from nice-to-haves, compare with your resume, and decide.',
    short: 'Split the posting into must-haves and nice-to-haves. If you can show most of the must-haves with real examples, apply. A missing nice-to-have rarely rules you out, but a missing must-have, like a required license, usually does.',
    shot: { src: 'assets/guide-fit-result.webp', alt: 'Catchr fit score of 82 percent, Good Fit, with Skills, Experience and Soft Skills scores, a one-line summary and a Gap note.', caption: 'Catchr\'s Check Fit compares your resume with the job and shows what matches and what\'s missing.' },
    sections: [
      { h: 'Do I need to meet every requirement?', answer: 'Usually not.', detail: 'Postings often describe an ideal candidate. What matters is whether you can do the core of the job. Requirements written as "preferred", "bonus" or "nice to have" are not deal-breakers.' },
      { h: 'How do I check my fit, step by step?', answer: 'Four steps.', steps: [
        'List the must-haves: the duties described as the main job, and anything marked "required", like a license, degree or years of a specific experience.',
        'List the nice-to-haves: tools, industries and extras marked "preferred" or "a plus".',
        'For each must-have, find a real example in your resume. Mark the ones you can\'t show.',
        'Decide: if you can show most must-haves, apply. If you\'re missing one that\'s truly required, look for a closer role.',
      ] },
      { h: 'What if I\'m missing something?', answer: 'Name the gap, then show the closest thing you have done.', detail: 'If you\'ve done a related version, put it on your resume in the job\'s terms, honestly. In the interview, say how you\'d close the gap. If the gap is a hard requirement like a license, that\'s usually a no.' },
      { h: 'Can a fit score tell me?', answer: 'It\'s a guide, not a verdict.', detail: 'Catchr\'s <strong>Check Fit</strong> compares your resume with the job description and gives a score from 0 to 100, split into skills, experience and soft skills, with what matches and what\'s missing. The same job can score a few points differently from one check to the next, and AI can make mistakes. Read the matches and gaps, not just the number.' },
    ],
    related: ['tailor-resume-to-job-description', 'gemini-api-key', 'how-catchr-handles-your-data'],
  },

  // ───────────────────────────── TRUST PAGE ─────────────────────────────
  {
    slug: 'how-catchr-handles-your-data', type: 'trust', eyebrow: 'Your data',
    title: 'How Catchr Handles Your Data | Catchr',
    h1: 'How Catchr handles your data',
    sub: 'Where your resume, your jobs and your AI key go, in plain words.',
    description: 'What Catchr can see, where your resume and AI key go, and what it saves. No Catchr data server: your data goes from your browser to your Google account and your chosen AI.',
    short: 'Your jobs, tailored resumes and prep docs are saved in your own Google account. Your resume and the job description go from your browser to the AI you chose, using your own key, with the name and contact details Catchr detects removed first. They never pass through a Catchr data server.',
    sections: [
      { h: 'What can Catchr see in my Google account?', answer: 'Only the files it creates for you and the files you pick.', detail: 'In practice that\'s your job tracker sheet, the resume you choose, and the tailored resumes and prep docs Catchr makes. It can\'t see the rest of your Drive, your email, or anything else.' },
      { h: 'Who sees my resume?', answer: 'We never do. Catchr sends it only to the AI you chose.', detail: 'Catchr reads your resume in your browser and removes the name and contact details it detects before sending it. The removal works by matching text, so it can miss details, and the rest of your work history may still identify you. If something must stay private, leave it out of the resume you use with Catchr.' },
      { h: 'What does each AI company do with it?', answer: 'Each handles what you send under its own terms.', detail: 'On Gemini\'s free tier, Google may use what you send to improve its AI, and its reviewers may read it. Turning on billing for your key\'s project stops Google using it to improve its AI, though Google may still keep requests for a limited time to check for misuse. The first time you choose Claude or ChatGPT, Catchr shows exactly what it will send and asks for your OK first.' },
      { h: 'Where is my AI key stored?', answer: 'In your browser, sent only to the AI company it belongs to.', detail: 'Catchr never receives your key. You manage the key, and any AI charges, with the company that issued it.' },
      { h: 'How do I remove Catchr and my data?', answer: 'Uninstall the extension. That removes everything Catchr stored in your browser, including your key.', detail: 'To remove Catchr\'s access to your Google account, open your Google account\'s third-party connections and remove Catchr. Sheets and documents it made stay in your Drive until you delete them. The <a href="/privacy">privacy policy</a> has the full detail.' },
    ],
    related: ['gemini-api-key', 'claude-api-key', 'openai-api-key'],
  },

  // ───────────────────────────── COMPARISONS ─────────────────────────────
  // rows: [label, catchr, them]; a leading "✓ " or "– " sets the icon.
  {
    slug: 'teal-alternative', type: 'compare', eyebrow: 'Compare', them: 'Teal',
    title: 'Teal Alternative: Free AI Job Tracker for Google Sheets | Catchr',
    h1: 'A free Teal alternative',
    sub: 'Teal is a full job search app. Catchr is a free Chrome extension that keeps everything in your own Google Sheet and Drive.',
    description: 'Catchr vs Teal: price, free plan, where your data lives, fit scores, resume tailoring and interview prep. An honest comparison, checked November 2026.',
    short: 'Pick Teal if you want a polished resume builder and an all-in-one job search app with an account. Pick Catchr if you want your tracker in your own Google Sheet, with fit checks, tailoring and interview prep free on your own AI key.',
    rows: [
      ['Price', 'Free. AI runs on your own key (Gemini free tier, or pay Anthropic or OpenAI for use)', 'Free plan. Teal+ is $13 every 7 days, $29 every 30 days, or $79 every 90 days'],
      ['Where your data lives', 'Your own Google Sheet and Drive. No Catchr account', 'Your Teal account'],
      ['Save jobs from job pages', '✓ One click, from a Chrome extension', '✓ Chrome extension, 40+ job boards'],
      ['Fit or match score', '✓ 0 to 100, with matches and gaps', '✓ Keyword matching. Free plan shows the top 5 keywords per job'],
      ['Resume tailoring', '✓ Rewrites a copy in Google Docs, changes highlighted', '✓ AI resume tools. Free plan has limited AI credits'],
      ['Resume builder', '– Free Google Docs template instead', '✓ Builder with templates'],
      ['Interview prep', '✓ A written prep doc for each job, saved to your Drive', '✓ AI interview practice with feedback and recordings. 2 sessions free, unlimited on Teal+'],
    ],
    themBetter: ['A full resume builder with templates and design controls.', 'AI interview practice: answer out loud and get feedback.', 'Cover letters and resume summaries from the same place.'],
    usBetter: ['Free AI tools with no credit limits set by us: you use your own key, and Gemini has a free tier.', 'Your tracker is a normal Google Sheet you own, not an account you\'d have to export from.', 'A written prep doc for every job (questions, your talking points, questions to ask), saved to your Drive.'],
    who: 'If you mainly need a resume builder, Teal is strong. If you want a free tracker in your own Sheet with fit checks, tailoring and prep for each job, try Catchr.',
    sources: [['Teal AI Interview Practice', 'https://www.tealhq.com/tools/ai-interview-practice'], ['Teal help: Teal vs. Teal+ (plan limits)', 'https://help.tealhq.com/en/articles/9530153-teal-vs-teal'], ['Teal vs Huntr (Teal\'s own comparison, for pricing and plans)', 'https://www.tealhq.com/post/teal-vs-huntr'], ['Teal vs Simplify (Teal\'s own comparison)', 'https://www.tealhq.com/post/teal-vs-simplify']],
    sourceNote: 'Teal\'s pricing page couldn\'t be read automatically, so prices come from Teal\'s own comparison posts. Check tealhq.com for current prices.',
    related: ['simplify-alternative', 'huntr-alternative', 'jobscan-alternative'],
  },
  {
    slug: 'simplify-alternative', type: 'compare', eyebrow: 'Compare', them: 'Simplify',
    title: 'Simplify Copilot Alternative: Free Fit Checks and Tailoring | Catchr',
    h1: 'A Simplify Copilot alternative',
    sub: 'Simplify is built around autofilling applications. Catchr is built around deciding which jobs are worth applying to, and preparing for them.',
    description: 'Catchr vs Simplify Copilot: autofill, fit scores, resume tailoring, interview prep, price and where your data lives. An honest comparison, checked November 2026.',
    short: 'Pick Simplify if you apply to many jobs and want forms filled in for you. Pick Catchr if you want to check your fit first, tailor your resume and prep for the interview for free, with everything saved in your own Google account.',
    rows: [
      ['Price', 'Free. AI runs on your own key (Gemini free tier, or pay Anthropic or OpenAI for use)', 'Copilot is free. Simplify+ is $39.99 a month'],
      ['Where your data lives', 'Your own Google Sheet and Drive. No Catchr account', 'Your Simplify tracker and account'],
      ['Autofill applications', '– No', '✓ Free, on most job application sites'],
      ['Save jobs and track applications', '✓ One click into your Google Sheet', '✓ Adds applications to your Simplify tracker when Copilot detects you submitting one'],
      ['Fit or match score', '✓ 0 to 100, with matches and gaps', '✓ Resume score out of 100 with keyword feedback, plus AI job matching'],
      ['Resume tailoring', '✓ Free on your key, copy in Google Docs', '✓ With Simplify+'],
      ['Interview prep', '✓ Prep doc saved to your Drive', 'Not mentioned in the sources we checked'],
    ],
    themBetter: ['Autofill, which saves real time when you apply to many jobs.', 'Job discovery and curated job lists in the same product.', 'Autofill, tracker, job matches and a basic resume builder, all free.'],
    usBetter: ['Resume tailoring and fit checks without a subscription.', 'An interview prep doc for each job.', 'Your data stays in your own Google Sheet and Drive.'],
    who: 'They do different jobs, and some people use both: Simplify to fill in forms, Catchr to choose and prepare for the roles worth it.',
    sources: [['Simplify Copilot', 'https://simplify.jobs/copilot'], ['Simplify help: use the job tracker', 'https://help.simplify.jobs/articles/2140179-use-the-job-tracker'], ['Simplify help: resume score and keyword matching', 'https://help.simplify.jobs/articles/2175778-understand-resume-score-and-keyword-matching'], ['What\'s included in Simplify+ (features and pricing), Simplify help centre', 'https://help.simplify.jobs/articles/5623502-whats-included-in-simplify-features-and-pricing']],
    related: ['teal-alternative', 'huntr-alternative', 'jobscan-alternative'],
  },
  {
    slug: 'huntr-alternative', type: 'compare', eyebrow: 'Compare', them: 'Huntr',
    title: 'Huntr Alternative: Free Job Tracker in Google Sheets | Catchr',
    h1: 'A free Huntr alternative',
    sub: 'Huntr is a job tracker and resume app with a paid Pro plan. Catchr tracks jobs in your own Google Sheet and runs its AI on your own key.',
    description: 'Catchr vs Huntr: price, job limits, where your data lives, fit scores, resume tailoring and interview prep. An honest comparison, checked November 2026.',
    short: 'Pick Huntr if you want a polished tracking board, contacts and autofill in one app. Pick Catchr if you want to track jobs in your own Google Sheet with no job limit, and tailor and prep for each one free on your own AI key.',
    rows: [
      ['Price', 'Free. AI runs on your own key (Gemini free tier, or pay Anthropic or OpenAI for use)', 'Free plan. Pro is $40 a month, $90 every 3 months, or $160 every 6 months'],
      ['Where your data lives', 'Your own Google Sheet and Drive. No Catchr account', 'Your Huntr account'],
      ['Jobs you can track', '✓ As many as your Sheet holds', '✓ Up to 100 on the free plan, unlimited on Pro'],
      ['Fit or match score', '✓ 0 to 100, with matches and gaps', '✓ Basic resume scoring free, advanced on Pro'],
      ['Resume tailoring', '✓ Free on your key, copy in Google Docs', '✓ 2 tailored resumes on the free plan'],
      ['Interview prep', '✓ Prep doc saved to your Drive', '✓ Interview tracker and question generator'],
      ['Autofill applications', '– No', '✓ Unlimited, free'],
    ],
    themBetter: ['A visual tracking board, map view and contact management.', 'Free, unlimited application autofill.', 'A resume builder with free PDF export.'],
    usBetter: ['No job limit and no paid tier: your tracker is a Google Sheet you own.', 'Tailoring for every job, not two, on your own AI key.', 'A full prep doc per job, saved to your Drive.'],
    who: 'If you want an app to manage a big search with contacts and autofill, Huntr is solid. If you want a free tracker in your own Sheet with AI help on every job, try Catchr.',
    sources: [['Huntr pricing', 'https://huntr.co/pricing']],
    related: ['teal-alternative', 'simplify-alternative', 'jobscan-alternative'],
  },
  {
    slug: 'jobscan-alternative', type: 'compare', eyebrow: 'Compare', them: 'Jobscan',
    title: 'Jobscan Alternative: Free Resume Match Checks | Catchr',
    h1: 'A free Jobscan alternative',
    sub: 'Jobscan specializes in scanning your resume against applicant tracking systems. Catchr checks your fit, tailors and preps, free on your own AI key.',
    description: 'Catchr vs Jobscan: match scores, scan limits, resume tailoring, interview prep, price and where your data lives. An honest comparison, checked November 2026.',
    short: 'Pick Jobscan if you want detailed applicant-tracking-system keyword scans. Pick Catchr if you want a fit check, a tailored copy of your resume and an interview prep doc for each job, free on your own AI key, with no monthly scan limit set by us.',
    rows: [
      ['Price', 'Free. AI runs on your own key (Gemini free tier, or pay Anthropic or OpenAI for use)', 'Free plan. Premium is $49.95 a month or $89.95 every 3 months'],
      ['Where your data lives', 'Your own Google Sheet and Drive. No Catchr account', 'Your Jobscan account'],
      ['Match score', '✓ 0 to 100: skills, experience, soft skills, plus gaps', '✓ Match rate based on hard skills, education, job title, soft skills and keywords'],
      ['Checks per month', '✓ No limit from us. Your AI key\'s own limits apply', '✓ 5 scans a month free, unlimited on Premium'],
      ['Resume tailoring', '✓ Rewrites a copy in Google Docs, changes highlighted', '✓ AI Optimize'],
      ['Interview prep', '✓ Prep doc saved to your Drive', '✓ AI interview practice'],
      ['Auto apply', '– No', '✓ Auto Apply, with your review before each is sent'],
    ],
    themBetter: ['Deep keyword scans built around named applicant tracking systems.', 'AI interview practice with feedback.', 'LinkedIn profile optimization.'],
    usBetter: ['Fit checks without a monthly scan limit from us.', 'Your tracker, tailored resumes and prep docs live in your own Google account.', 'Free, with Gemini\'s free tier, or pay only for what you use on Claude or ChatGPT.'],
    who: 'If you want to tune a resume against applicant tracking systems in detail, Jobscan is the specialist. For a free check, tailor and prep on every job you catch, try Catchr.',
    sources: [['Jobscan', 'https://www.jobscan.co'], ['Jobscan vs Teal (Jobscan\'s own comparison, for plans and pricing)', 'https://www.jobscan.co/blog/jobscan-vs-teal/']],
    sourceNote: 'Jobscan\'s pricing page only loads after sign-in, so prices come from Jobscan\'s own published comparisons. Check jobscan.co for current prices.',
    related: ['teal-alternative', 'simplify-alternative', 'huntr-alternative'],
  },
];
module.exports.STORE = STORE;
