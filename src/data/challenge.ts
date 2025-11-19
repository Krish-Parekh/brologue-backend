import type { Week } from "../types/challenge";

export const challengeWeeks: Week[] = [
    {
        id: 1,
        title: 'Foundation Week',
        theme: 'Setting Intentions',
        description: 'Lay the groundwork for your transformation journey by clarifying your vision and setting powerful intentions.',
        unlocked: true,
        focusAreas: [
            {
                id: 'vision',
                title: 'Vision Clarity',
                description: 'Define your ultimate vision and what success means to you',
                dailyChallenges: [
                    {
                        day: 1,
                        title: 'Write Your Vision Statement',
                        description: 'Spend 20 minutes writing a detailed vision of where you want to be in 12 weeks',
                        actionItems: [
                            'Find a quiet space',
                            'Write without editing',
                            'Be specific and vivid',
                            'Include all life areas'
                        ]
                    },
                    {
                        day: 2,
                        title: 'Identify Core Values',
                        description: 'List your top 5 values that will guide your decisions',
                        actionItems: [
                            'Reflect on what matters most',
                            'Write down 10 values',
                            'Narrow to top 5',
                            'Define what each means to you'
                        ]
                    },
                    {
                        day: 3,
                        title: 'Set SMART Goals',
                        description: 'Create 3-5 specific, measurable goals for the next 12 weeks',
                        actionItems: [
                            'Make goals specific',
                            'Ensure they are measurable',
                            'Set realistic timelines',
                            'Write them down'
                        ]
                    },
                    {
                        day: 4,
                        title: 'Create Your Why Statement',
                        description: 'Write a powerful "why" statement that will keep you motivated',
                        actionItems: [
                            'Ask "why" 5 times',
                            'Connect to emotions',
                            'Make it personal',
                            'Keep it visible'
                        ]
                    },
                    {
                        day: 5,
                        title: 'Design Your Environment',
                        description: 'Set up your physical and digital spaces to support your goals',
                        actionItems: [
                            'Declutter your workspace',
                            'Remove distractions',
                            'Add visual reminders',
                            'Create a dedicated space'
                        ]
                    },
                    {
                        day: 6,
                        title: 'Establish Baseline Metrics',
                        description: 'Measure where you are now to track progress',
                        actionItems: [
                            'Identify key metrics',
                            'Take initial measurements',
                            'Record baseline data',
                            'Set up tracking system'
                        ]
                    },
                    {
                        day: 7,
                        title: 'Commit to the Journey',
                        description: 'Make a formal commitment to yourself and the process',
                        actionItems: [
                            'Write a commitment letter',
                            'Share with accountability partner',
                            'Set up daily check-ins',
                            'Celebrate starting'
                        ]
                    }
                ]
            }
        ],
        mantras: [
            {
                id: 'weekly-1',
                text: 'Every journey begins with a single step. Today, I take mine.',
                type: 'weekly'
            },
            {
                id: 'daily-1-1',
                text: 'I am clear about my vision and committed to making it real.',
                type: 'daily',
                day: 1
            },
            {
                id: 'daily-1-2',
                text: 'My values guide every decision I make today.',
                type: 'daily',
                day: 2
            },
            {
                id: 'daily-1-3',
                text: 'I set goals that stretch me and excite me.',
                type: 'daily',
                day: 3
            },
            {
                id: 'daily-1-4',
                text: 'My why is my anchor, keeping me grounded and focused.',
                type: 'daily',
                day: 4
            },
            {
                id: 'daily-1-5',
                text: 'I create environments that support my highest self.',
                type: 'daily',
                day: 5
            },
            {
                id: 'daily-1-6',
                text: 'I measure what matters and track my progress with intention.',
                type: 'daily',
                day: 6
            },
            {
                id: 'daily-1-7',
                text: 'I commit fully to this journey and trust the process.',
                type: 'daily',
                day: 7
            }
        ],
        prompts: [
            {
                id: 'prompt-1-1',
                text: 'What does success look like to me in 12 weeks? How will I feel?',
                type: 'daily',
                day: 1
            },
            {
                id: 'prompt-1-2',
                text: 'Which values am I living today? Which ones need more attention?',
                type: 'daily',
                day: 2
            },
            {
                id: 'prompt-1-3',
                text: 'What progress did I make toward my goals today?',
                type: 'daily',
                day: 3
            },
            {
                id: 'prompt-1-4',
                text: 'When I think about my why, what emotions arise?',
                type: 'daily',
                day: 4
            },
            {
                id: 'prompt-1-5',
                text: 'How did my environment support or hinder me today?',
                type: 'daily',
                day: 5
            },
            {
                id: 'prompt-1-6',
                text: 'What did I learn from tracking my metrics today?',
                type: 'daily',
                day: 6
            },
            {
                id: 'prompt-1-7',
                text: 'How do I feel about my commitment? What will keep me going?',
                type: 'daily',
                day: 7
            },
            {
                id: 'weekly-prompt-1',
                text: 'Reflect on Week 1: What intentions did I set? How committed am I to this journey? What will I carry forward?',
                type: 'weekly'
            }
        ]
    },
    {
        id: 2,
        title: 'Self-Awareness Week',
        theme: 'Understanding Yourself',
        description: 'Develop deep understanding of yourself, your patterns, and your current state.',
        unlocked: false,
        focusAreas: [
            {
                id: 'self-awareness',
                title: 'Self-Awareness',
                description: 'Develop deep understanding of yourself, your patterns, and your current state',
                dailyChallenges: [
                    {
                        day: 1,
                        title: 'Assess Current State',
                        description: 'Honestly evaluate where you are in all life areas',
                        actionItems: [
                            'List all life areas',
                            'Rate satisfaction 1-10',
                            'Identify strengths',
                            'Note areas for growth'
                        ]
                    },
                    {
                        day: 2,
                        title: 'Identify Patterns',
                        description: 'Recognize patterns that serve you and those that don\'t',
                        actionItems: [
                            'Review your daily routines',
                            'Notice behavioral patterns',
                            'Identify helpful patterns',
                            'Note patterns to change'
                        ]
                    },
                    {
                        day: 3,
                        title: 'Understand Your Triggers',
                        description: 'Identify what triggers negative reactions or behaviors',
                        actionItems: [
                            'List emotional triggers',
                            'Note physical responses',
                            'Identify patterns',
                            'Plan coping strategies'
                        ]
                    },
                    {
                        day: 4,
                        title: 'Recognize Your Strengths',
                        description: 'Acknowledge and document your natural strengths',
                        actionItems: [
                            'List your strengths',
                            'Ask others for input',
                            'Note how you use them',
                            'Plan to leverage them more'
                        ]
                    },
                    {
                        day: 5,
                        title: 'Acknowledge Your Weaknesses',
                        description: 'Honestly identify areas where you need growth',
                        actionItems: [
                            'List areas for improvement',
                            'Be honest but kind',
                            'See them as opportunities',
                            'Plan development steps'
                        ]
                    },
                    {
                        day: 6,
                        title: 'Reflect on Past Successes',
                        description: 'Learn from times when you achieved your goals',
                        actionItems: [
                            'List past successes',
                            'Identify success factors',
                            'Note what worked',
                            'Apply learnings forward'
                        ]
                    },
                    {
                        day: 7,
                        title: 'Create Self-Awareness Practice',
                        description: 'Establish a daily practice for ongoing self-awareness',
                        actionItems: [
                            'Choose reflection method',
                            'Set daily time',
                            'Commit to consistency',
                            'Track insights'
                        ]
                    }
                ]
            }
        ],
        mantras: [
            {
                id: 'weekly-2',
                text: 'I understand myself deeply. Self-awareness is the foundation of growth.',
                type: 'weekly'
            },
            {
                id: 'daily-2-1',
                text: 'I honestly assess where I am and where I want to be.',
                type: 'daily',
                day: 1
            },
            {
                id: 'daily-2-2',
                text: 'I recognize patterns that serve me and those that don\'t.',
                type: 'daily',
                day: 2
            },
            {
                id: 'daily-2-3',
                text: 'I understand my triggers and respond with awareness.',
                type: 'daily',
                day: 3
            },
            {
                id: 'daily-2-4',
                text: 'I acknowledge my strengths and leverage them fully.',
                type: 'daily',
                day: 4
            },
            {
                id: 'daily-2-5',
                text: 'I see my weaknesses as opportunities for growth.',
                type: 'daily',
                day: 5
            },
            {
                id: 'daily-2-6',
                text: 'I learn from my past successes and apply those lessons.',
                type: 'daily',
                day: 6
            },
            {
                id: 'daily-2-7',
                text: 'I commit to ongoing self-awareness as a daily practice.',
                type: 'daily',
                day: 7
            }
        ],
        prompts: [
            {
                id: 'prompt-2-1',
                text: 'Where am I now in all life areas? What do I notice?',
                type: 'daily',
                day: 1
            },
            {
                id: 'prompt-2-2',
                text: 'What patterns did I identify? Which serve me?',
                type: 'daily',
                day: 2
            },
            {
                id: 'prompt-2-3',
                text: 'What triggers did I discover? How will I respond?',
                type: 'daily',
                day: 3
            },
            {
                id: 'prompt-2-4',
                text: 'What strengths did I recognize? How can I use them more?',
                type: 'daily',
                day: 4
            },
            {
                id: 'prompt-2-5',
                text: 'What weaknesses did I acknowledge? How will I grow?',
                type: 'daily',
                day: 5
            },
            {
                id: 'prompt-2-6',
                text: 'What did I learn from my past successes?',
                type: 'daily',
                day: 6
            },
            {
                id: 'prompt-2-7',
                text: 'How will I maintain self-awareness going forward?',
                type: 'daily',
                day: 7
            },
            {
                id: 'weekly-prompt-2',
                text: 'Reflect on Week 2: How did self-awareness deepen? What did I learn about myself?',
                type: 'weekly'
            }
        ]
    },
    {
        id: 3,
        title: 'Accountability Week',
        theme: 'Building Systems',
        description: 'Build systems and relationships that keep you committed and on track.',
        unlocked: false,
        focusAreas: [
            {
                id: 'accountability',
                title: 'Accountability Systems',
                description: 'Build systems and relationships that keep you committed and on track',
                dailyChallenges: [
                    {
                        day: 1,
                        title: 'Find Accountability Partner',
                        description: 'Identify someone who will support and hold you accountable',
                        actionItems: [
                            'List potential partners',
                            'Choose someone committed',
                            'Discuss expectations',
                            'Set up check-in schedule'
                        ]
                    },
                    {
                        day: 2,
                        title: 'Set Up Tracking System',
                        description: 'Create a system to track your progress and habits',
                        actionItems: [
                            'Choose tracking method',
                            'Set up your system',
                            'Make it easy to use',
                            'Commit to daily tracking'
                        ]
                    },
                    {
                        day: 3,
                        title: 'Create Public Commitment',
                        description: 'Share your goals publicly to increase accountability',
                        actionItems: [
                            'Choose platform or group',
                            'Share your goals',
                            'Explain your why',
                            'Invite support'
                        ]
                    },
                    {
                        day: 4,
                        title: 'Establish Check-In Routine',
                        description: 'Set up regular check-ins with yourself and others',
                        actionItems: [
                            'Schedule weekly reviews',
                            'Set daily reflection time',
                            'Plan partner check-ins',
                            'Create check-in questions'
                        ]
                    },
                    {
                        day: 5,
                        title: 'Design Reward System',
                        description: 'Create meaningful rewards for milestones achieved',
                        actionItems: [
                            'Identify milestones',
                            'Choose meaningful rewards',
                            'Set reward criteria',
                            'Plan celebration moments'
                        ]
                    },
                    {
                        day: 6,
                        title: 'Build Support Network',
                        description: 'Connect with people who support your goals',
                        actionItems: [
                            'Identify supporters',
                            'Share your journey',
                            'Ask for specific support',
                            'Offer to support others'
                        ]
                    },
                    {
                        day: 7,
                        title: 'Commit to Systems',
                        description: 'Formally commit to using your accountability systems',
                        actionItems: [
                            'Review all systems',
                            'Make final commitments',
                            'Set reminders',
                            'Start using them today'
                        ]
                    }
                ]
            }
        ],
        mantras: [
            {
                id: 'weekly-3',
                text: 'I build systems that keep me accountable. Consistency is my superpower.',
                type: 'weekly'
            },
            {
                id: 'daily-3-1',
                text: 'I find partners who support and challenge me.',
                type: 'daily',
                day: 1
            },
            {
                id: 'daily-3-2',
                text: 'I track my progress and celebrate my growth.',
                type: 'daily',
                day: 2
            },
            {
                id: 'daily-3-3',
                text: 'I share my goals publicly and invite support.',
                type: 'daily',
                day: 3
            },
            {
                id: 'daily-3-4',
                text: 'I check in regularly with myself and others.',
                type: 'daily',
                day: 4
            },
            {
                id: 'daily-3-5',
                text: 'I reward myself for milestones achieved.',
                type: 'daily',
                day: 5
            },
            {
                id: 'daily-3-6',
                text: 'I build a network that supports my goals.',
                type: 'daily',
                day: 6
            },
            {
                id: 'daily-3-7',
                text: 'I commit fully to my accountability systems.',
                type: 'daily',
                day: 7
            }
        ],
        prompts: [
            {
                id: 'prompt-3-1',
                text: 'Who did I choose as my accountability partner? Why?',
                type: 'daily',
                day: 1
            },
            {
                id: 'prompt-3-2',
                text: 'How did I set up my tracking system? Will it work?',
                type: 'daily',
                day: 2
            },
            {
                id: 'prompt-3-3',
                text: 'How did sharing my goals publicly impact me?',
                type: 'daily',
                day: 3
            },
            {
                id: 'prompt-3-4',
                text: 'What check-in routine did I establish?',
                type: 'daily',
                day: 4
            },
            {
                id: 'prompt-3-5',
                text: 'What rewards did I design? Are they meaningful?',
                type: 'daily',
                day: 5
            },
            {
                id: 'prompt-3-6',
                text: 'Who supports my goals? How can I strengthen these connections?',
                type: 'daily',
                day: 6
            },
            {
                id: 'prompt-3-7',
                text: 'How committed am I to using these accountability systems?',
                type: 'daily',
                day: 7
            },
            {
                id: 'weekly-prompt-3',
                text: 'Reflect on Week 3: What accountability systems did I build? How will they help me?',
                type: 'weekly'
            }
        ]
    },
    {
        id: 4,
        title: 'Courage Week',
        theme: 'Facing Fears',
        description: 'Build courage by facing your fears and taking bold action toward your goals despite uncertainty.',
        unlocked: false,
        focusAreas: [
            {
                id: 'courage',
                title: 'Fear Mastery',
                description: 'Develop the courage to act despite fear and uncertainty',
                dailyChallenges: [
                    {
                        day: 1,
                        title: 'Identify Your Fears',
                        description: 'Name the fears that are holding you back',
                        actionItems: [
                            'List your biggest fears',
                            'Write them down explicitly',
                            'Identify which are real vs imagined',
                            'Acknowledge their power over you'
                        ]
                    },
                    {
                        day: 2,
                        title: 'Face a Small Fear',
                        description: 'Take action on something that scares you slightly',
                        actionItems: [
                            'Choose a manageable fear',
                            'Plan your approach',
                            'Take the action',
                            'Reflect on the outcome'
                        ]
                    },
                    {
                        day: 3,
                        title: 'Reframe Fear as Excitement',
                        description: 'Practice seeing fear as energy for growth',
                        actionItems: [
                            'Notice physical sensations',
                            'Relabel fear as excitement',
                            'Use the energy productively',
                            'Take action anyway'
                        ]
                    },
                    {
                        day: 4,
                        title: 'Take a Bold Action',
                        description: 'Do something today that requires courage',
                        actionItems: [
                            'Identify a bold action',
                            'Prepare yourself mentally',
                            'Take the leap',
                            'Celebrate your courage'
                        ]
                    },
                    {
                        day: 5,
                        title: 'Practice Vulnerability',
                        description: 'Share something vulnerable with someone you trust',
                        actionItems: [
                            'Choose what to share',
                            'Select a safe person',
                            'Express yourself honestly',
                            'Notice the connection'
                        ]
                    },
                    {
                        day: 6,
                        title: 'Challenge Comfort Zone',
                        description: 'Do multiple things outside your comfort zone today',
                        actionItems: [
                            'List comfort zone activities',
                            'Choose 3 stretch activities',
                            'Complete each one',
                            'Track your growth'
                        ]
                    },
                    {
                        day: 7,
                        title: 'Celebrate Your Courage',
                        description: 'Acknowledge all the courageous acts you took this week',
                        actionItems: [
                            'List every brave action',
                            'Acknowledge your growth',
                            'Celebrate your courage',
                            'Set intention for more'
                        ]
                    }
                ]
            }
        ],
        mantras: [
            {
                id: 'weekly-4',
                text: 'I am courageous. I feel the fear and take action anyway.',
                type: 'weekly'
            },
            {
                id: 'daily-4-1',
                text: 'I name my fears and take away their power.',
                type: 'daily',
                day: 1
            },
            {
                id: 'daily-4-2',
                text: 'I face small fears to build my courage muscle.',
                type: 'daily',
                day: 2
            },
            {
                id: 'daily-4-3',
                text: 'Fear is just excitement in disguise. I channel it forward.',
                type: 'daily',
                day: 3
            },
            {
                id: 'daily-4-4',
                text: 'I take bold action despite uncertainty.',
                type: 'daily',
                day: 4
            },
            {
                id: 'daily-4-5',
                text: 'I am brave enough to be vulnerable and authentic.',
                type: 'daily',
                day: 5
            },
            {
                id: 'daily-4-6',
                text: 'I expand my comfort zone with every courageous act.',
                type: 'daily',
                day: 6
            },
            {
                id: 'daily-4-7',
                text: 'I celebrate my courage and the growth it brings.',
                type: 'daily',
                day: 7
            }
        ],
        prompts: [
            {
                id: 'prompt-4-1',
                text: 'What fears did I identify? How are they holding me back?',
                type: 'daily',
                day: 1
            },
            {
                id: 'prompt-4-2',
                text: 'What small fear did I face? How did it feel?',
                type: 'daily',
                day: 2
            },
            {
                id: 'prompt-4-3',
                text: 'How did I reframe fear as excitement today?',
                type: 'daily',
                day: 3
            },
            {
                id: 'prompt-4-4',
                text: 'What bold action did I take? What did I learn?',
                type: 'daily',
                day: 4
            },
            {
                id: 'prompt-4-5',
                text: 'How did practicing vulnerability impact me?',
                type: 'daily',
                day: 5
            },
            {
                id: 'prompt-4-6',
                text: 'What comfort zone challenges did I complete?',
                type: 'daily',
                day: 6
            },
            {
                id: 'prompt-4-7',
                text: 'How have I grown more courageous this week?',
                type: 'daily',
                day: 7
            },
            {
                id: 'weekly-prompt-4',
                text: 'Reflect on Week 4: What fears did I face? How did courage change me? What will I do next?',
                type: 'weekly'
            }
        ]
    },
    {
        id: 5,
        title: 'Growth Week',
        theme: 'Learning Mindset',
        description: 'Cultivate a growth mindset and embrace continuous learning as a path to mastery and transformation.',
        unlocked: false,
        focusAreas: [
            {
                id: 'growth',
                title: 'Continuous Learning',
                description: 'Develop a mindset of growth and embrace learning opportunities',
                dailyChallenges: [
                    {
                        day: 1,
                        title: 'Embrace Beginner Mindset',
                        description: 'Approach something familiar as if you are a beginner',
                        actionItems: [
                            'Choose a familiar activity',
                            'Ask "what if" questions',
                            'Notice new details',
                            'Learn something new about it'
                        ]
                    },
                    {
                        day: 2,
                        title: 'Learn Something New',
                        description: 'Dedicate time to learning a new skill or concept',
                        actionItems: [
                            'Choose what to learn',
                            'Set aside focused time',
                            'Use multiple learning methods',
                            'Practice what you learned'
                        ]
                    },
                    {
                        day: 3,
                        title: 'Seek Feedback',
                        description: 'Ask for constructive feedback on something you are working on',
                        actionItems: [
                            'Choose what to get feedback on',
                            'Select trusted advisors',
                            'Ask specific questions',
                            'Listen without defending'
                        ]
                    },
                    {
                        day: 4,
                        title: 'Learn from Mistakes',
                        description: 'Reflect on a recent mistake and extract lessons',
                        actionItems: [
                            'Identify a recent mistake',
                            'Analyze what happened',
                            'Identify the lesson',
                            'Apply it going forward'
                        ]
                    },
                    {
                        day: 5,
                        title: 'Teach Someone Else',
                        description: 'Share knowledge with someone who can benefit',
                        actionItems: [
                            'Choose what to teach',
                            'Find someone to teach',
                            'Explain clearly',
                            'Answer their questions'
                        ]
                    },
                    {
                        day: 6,
                        title: 'Challenge Your Assumptions',
                        description: 'Question beliefs you hold and seek new perspectives',
                        actionItems: [
                            'Identify a strong assumption',
                            'Research alternative views',
                            'Consider different angles',
                            'Update your understanding'
                        ]
                    },
                    {
                        day: 7,
                        title: 'Create Learning Plan',
                        description: 'Design a plan for continued growth in an area',
                        actionItems: [
                            'Choose growth area',
                            'Set learning goals',
                            'Identify resources',
                            'Schedule learning time'
                        ]
                    }
                ]
            }
        ],
        mantras: [
            {
                id: 'weekly-5',
                text: 'I am a lifelong learner. Every experience teaches me something valuable.',
                type: 'weekly'
            },
            {
                id: 'daily-5-1',
                text: 'I approach life with curiosity and wonder.',
                type: 'daily',
                day: 1
            },
            {
                id: 'daily-5-2',
                text: 'I dedicate time to learning and growing every day.',
                type: 'daily',
                day: 2
            },
            {
                id: 'daily-5-3',
                text: 'I welcome feedback as a gift that helps me grow.',
                type: 'daily',
                day: 3
            },
            {
                id: 'daily-5-4',
                text: 'Mistakes are my teachers. I learn from every one.',
                type: 'daily',
                day: 4
            },
            {
                id: 'daily-5-5',
                text: 'Teaching others deepens my own understanding.',
                type: 'daily',
                day: 5
            },
            {
                id: 'daily-5-6',
                text: 'I challenge my assumptions and stay open to new ideas.',
                type: 'daily',
                day: 6
            },
            {
                id: 'daily-5-7',
                text: 'I commit to continuous growth and learning.',
                type: 'daily',
                day: 7
            }
        ],
        prompts: [
            {
                id: 'prompt-5-1',
                text: 'What did I discover by approaching something with beginner mind?',
                type: 'daily',
                day: 1
            },
            {
                id: 'prompt-5-2',
                text: 'What did I learn today? How will I apply it?',
                type: 'daily',
                day: 2
            },
            {
                id: 'prompt-5-3',
                text: 'What feedback did I receive? How will I use it?',
                type: 'daily',
                day: 3
            },
            {
                id: 'prompt-5-4',
                text: 'What mistake taught me something valuable today?',
                type: 'daily',
                day: 4
            },
            {
                id: 'prompt-5-5',
                text: 'What did I teach? How did it deepen my understanding?',
                type: 'daily',
                day: 5
            },
            {
                id: 'prompt-5-6',
                text: 'What assumption did I challenge? What did I discover?',
                type: 'daily',
                day: 6
            },
            {
                id: 'prompt-5-7',
                text: 'What learning plan did I create? How will I execute it?',
                type: 'daily',
                day: 7
            },
            {
                id: 'weekly-prompt-5',
                text: 'Reflect on Week 5: How did I grow? What did I learn? How will I continue learning?',
                type: 'weekly'
            }
        ]
    },
    {
        id: 6,
        title: 'Connection Week',
        theme: 'Building Relationships',
        description: 'Strengthen your relationships and build meaningful connections that support your growth and well-being.',
        unlocked: false,
        focusAreas: [
            {
                id: 'connection',
                title: 'Meaningful Relationships',
                description: 'Cultivate deeper connections with others',
                dailyChallenges: [
                    {
                        day: 1,
                        title: 'Practice Active Listening',
                        description: 'Give someone your full attention in conversation',
                        actionItems: [
                            'Put away distractions',
                            'Maintain eye contact',
                            'Listen without planning response',
                            'Ask clarifying questions'
                        ]
                    },
                    {
                        day: 2,
                        title: 'Express Gratitude',
                        description: 'Tell someone why you appreciate them',
                        actionItems: [
                            'Choose someone to appreciate',
                            'Be specific about why',
                            'Express it directly',
                            'Notice their response'
                        ]
                    },
                    {
                        day: 3,
                        title: 'Deepen a Relationship',
                        description: 'Have a meaningful conversation with someone important',
                        actionItems: [
                            'Choose someone to connect with',
                            'Ask deeper questions',
                            'Share authentically',
                            'Listen with presence'
                        ]
                    },
                    {
                        day: 4,
                        title: 'Offer Support',
                        description: 'Help someone without being asked',
                        actionItems: [
                            'Notice someone who needs help',
                            'Offer specific assistance',
                            'Follow through',
                            'Do it without expectation'
                        ]
                    },
                    {
                        day: 5,
                        title: 'Set Boundaries',
                        description: 'Communicate your needs and limits clearly',
                        actionItems: [
                            'Identify a boundary needed',
                            'Communicate it clearly',
                            'Be firm but kind',
                            'Respect others boundaries'
                        ]
                    },
                    {
                        day: 6,
                        title: 'Build New Connection',
                        description: 'Reach out to someone new or reconnect with someone',
                        actionItems: [
                            'Identify someone to connect with',
                            'Reach out authentically',
                            'Show genuine interest',
                            'Follow up meaningfully'
                        ]
                    },
                    {
                        day: 7,
                        title: 'Celebrate Relationships',
                        description: 'Acknowledge the people who support your journey',
                        actionItems: [
                            'List supportive people',
                            'Express appreciation',
                            'Reflect on their impact',
                            'Commit to nurturing relationships'
                        ]
                    }
                ]
            }
        ],
        mantras: [
            {
                id: 'weekly-6',
                text: 'I nurture meaningful connections. Relationships are the foundation of a rich life.',
                type: 'weekly'
            },
            {
                id: 'daily-6-1',
                text: 'I listen with my full presence and attention.',
                type: 'daily',
                day: 1
            },
            {
                id: 'daily-6-2',
                text: 'I express gratitude freely and authentically.',
                type: 'daily',
                day: 2
            },
            {
                id: 'daily-6-3',
                text: 'I deepen relationships through authentic sharing.',
                type: 'daily',
                day: 3
            },
            {
                id: 'daily-6-4',
                text: 'I offer support and help others willingly.',
                type: 'daily',
                day: 4
            },
            {
                id: 'daily-6-5',
                text: 'I set healthy boundaries with love and respect.',
                type: 'daily',
                day: 5
            },
            {
                id: 'daily-6-6',
                text: 'I build new connections with openness and curiosity.',
                type: 'daily',
                day: 6
            },
            {
                id: 'daily-6-7',
                text: 'I celebrate and honor the relationships in my life.',
                type: 'daily',
                day: 7
            }
        ],
        prompts: [
            {
                id: 'prompt-6-1',
                text: 'How did active listening change my conversations today?',
                type: 'daily',
                day: 1
            },
            {
                id: 'prompt-6-2',
                text: 'Who did I express gratitude to? How did it feel?',
                type: 'daily',
                day: 2
            },
            {
                id: 'prompt-6-3',
                text: 'How did I deepen a relationship today?',
                type: 'daily',
                day: 3
            },
            {
                id: 'prompt-6-4',
                text: 'How did I support someone today? What was the impact?',
                type: 'daily',
                day: 4
            },
            {
                id: 'prompt-6-5',
                text: 'What boundaries did I set? How did it feel?',
                type: 'daily',
                day: 5
            },
            {
                id: 'prompt-6-6',
                text: 'What new connection did I build or rekindle?',
                type: 'daily',
                day: 6
            },
            {
                id: 'prompt-6-7',
                text: 'Who supports my journey? How can I show appreciation?',
                type: 'daily',
                day: 7
            },
            {
                id: 'weekly-prompt-6',
                text: 'Reflect on Week 6: How did I strengthen relationships? What connections matter most?',
                type: 'weekly'
            }
        ]
    },
    {
        id: 7,
        title: 'Balance Week',
        theme: 'Work-Life Harmony',
        description: 'Create balance and harmony between different areas of your life, ensuring sustainable progress and well-being.',
        unlocked: false,
        focusAreas: [
            {
                id: 'balance',
                title: 'Life Integration',
                description: 'Create harmony across all life areas',
                dailyChallenges: [
                    {
                        day: 1,
                        title: 'Assess Life Areas',
                        description: 'Evaluate balance across different areas of your life',
                        actionItems: [
                            'List all life areas',
                            'Rate satisfaction in each',
                            'Identify imbalances',
                            'Note what needs attention'
                        ]
                    },
                    {
                        day: 2,
                        title: 'Set Boundaries',
                        description: 'Establish clear boundaries to protect your time and energy',
                        actionItems: [
                            'Identify boundary violations',
                            'Define your limits',
                            'Communicate boundaries',
                            'Enforce them consistently'
                        ]
                    },
                    {
                        day: 3,
                        title: 'Practice Presence',
                        description: 'Be fully present in whatever you are doing',
                        actionItems: [
                            'Single-task instead of multitask',
                            'Focus on current activity',
                            'Notice when mind wanders',
                            'Return to present moment'
                        ]
                    },
                    {
                        day: 4,
                        title: 'Schedule Rest',
                        description: 'Intentionally schedule time for rest and recovery',
                        actionItems: [
                            'Block rest time in calendar',
                            'Honor it like any appointment',
                            'Engage in restorative activities',
                            'Notice the benefits'
                        ]
                    },
                    {
                        day: 5,
                        title: 'Integrate Priorities',
                        description: 'Ensure your daily actions reflect your priorities',
                        actionItems: [
                            'Review your priorities',
                            'Audit your time usage',
                            'Align activities with priorities',
                            'Make necessary adjustments'
                        ]
                    },
                    {
                        day: 6,
                        title: 'Practice Saying No',
                        description: 'Say no to things that don\'t align with your goals',
                        actionItems: [
                            'Identify requests to decline',
                            'Practice saying no gracefully',
                            'Explain your priorities',
                            'Notice the freedom'
                        ]
                    },
                    {
                        day: 7,
                        title: 'Create Balance Plan',
                        description: 'Design a plan for maintaining balance going forward',
                        actionItems: [
                            'Identify balance strategies',
                            'Set balance goals',
                            'Create routines',
                            'Commit to maintenance'
                        ]
                    }
                ]
            }
        ],
        mantras: [
            {
                id: 'weekly-7',
                text: 'I create balance and harmony in all areas of my life.',
                type: 'weekly'
            },
            {
                id: 'daily-7-1',
                text: 'I assess and honor all areas of my life.',
                type: 'daily',
                day: 1
            },
            {
                id: 'daily-7-2',
                text: 'I set boundaries that protect my energy and time.',
                type: 'daily',
                day: 2
            },
            {
                id: 'daily-7-3',
                text: 'I am fully present in each moment and activity.',
                type: 'daily',
                day: 3
            },
            {
                id: 'daily-7-4',
                text: 'I honor rest as essential to my success.',
                type: 'daily',
                day: 4
            },
            {
                id: 'daily-7-5',
                text: 'My actions align with my true priorities.',
                type: 'daily',
                day: 5
            },
            {
                id: 'daily-7-6',
                text: 'I say no with confidence to protect my yes.',
                type: 'daily',
                day: 6
            },
            {
                id: 'daily-7-7',
                text: 'I commit to maintaining balance as a way of life.',
                type: 'daily',
                day: 7
            }
        ],
        prompts: [
            {
                id: 'prompt-7-1',
                text: 'How balanced are my life areas? What needs attention?',
                type: 'daily',
                day: 1
            },
            {
                id: 'prompt-7-2',
                text: 'What boundaries did I set? How did it help?',
                type: 'daily',
                day: 2
            },
            {
                id: 'prompt-7-3',
                text: 'How present was I today? What did I notice?',
                type: 'daily',
                day: 3
            },
            {
                id: 'prompt-7-4',
                text: 'How did scheduled rest impact my day?',
                type: 'daily',
                day: 4
            },
            {
                id: 'prompt-7-5',
                text: 'How did I align my actions with priorities today?',
                type: 'daily',
                day: 5
            },
            {
                id: 'prompt-7-6',
                text: 'What did I say no to? How did it feel?',
                type: 'daily',
                day: 6
            },
            {
                id: 'prompt-7-7',
                text: 'What balance plan did I create? How will I maintain it?',
                type: 'daily',
                day: 7
            },
            {
                id: 'weekly-prompt-7',
                text: 'Reflect on Week 7: How did I create more balance? What will I maintain?',
                type: 'weekly'
            }
        ]
    },
    {
        id: 8,
        title: 'Gratitude Week',
        theme: 'Appreciating Life',
        description: 'Cultivate gratitude and appreciation for the abundance in your life, shifting focus to what is working.',
        unlocked: false,
        focusAreas: [
            {
                id: 'gratitude',
                title: 'Gratitude Practice',
                description: 'Develop a consistent gratitude practice',
                dailyChallenges: [
                    {
                        day: 1,
                        title: 'Start Gratitude Journal',
                        description: 'Begin a daily practice of writing what you are grateful for',
                        actionItems: [
                            'Get a journal or app',
                            'Write 3 things you are grateful for',
                            'Be specific',
                            'Commit to daily practice'
                        ]
                    },
                    {
                        day: 2,
                        title: 'Express Gratitude to Others',
                        description: 'Tell three people why you appreciate them',
                        actionItems: [
                            'Choose three people',
                            'Be specific about why',
                            'Express it directly',
                            'Notice their response'
                        ]
                    },
                    {
                        day: 3,
                        title: 'Find Gratitude in Challenges',
                        description: 'Identify what you can be grateful for in a current challenge',
                        actionItems: [
                            'Identify a current challenge',
                            'List potential benefits',
                            'Find the silver lining',
                            'Appreciate the growth opportunity'
                        ]
                    },
                    {
                        day: 4,
                        title: 'Gratitude Walk',
                        description: 'Take a walk and notice things to be grateful for',
                        actionItems: [
                            'Go for a walk',
                            'Notice your surroundings',
                            'Appreciate small details',
                            'Feel the gratitude'
                        ]
                    },
                    {
                        day: 5,
                        title: 'Gratitude for Yourself',
                        description: 'Express gratitude for your own qualities and efforts',
                        actionItems: [
                            'List your positive qualities',
                            'Acknowledge your efforts',
                            'Appreciate your growth',
                            'Celebrate yourself'
                        ]
                    },
                    {
                        day: 6,
                        title: 'Gratitude Meditation',
                        description: 'Practice a gratitude-focused meditation',
                        actionItems: [
                            'Find quiet space',
                            'Focus on gratitude',
                            'Feel the appreciation',
                            'Extend it to others'
                        ]
                    },
                    {
                        day: 7,
                        title: 'Create Gratitude Ritual',
                        description: 'Design a daily gratitude practice to continue',
                        actionItems: [
                            'Choose your practice',
                            'Set a specific time',
                            'Make it enjoyable',
                            'Commit to consistency'
                        ]
                    }
                ]
            }
        ],
        mantras: [
            {
                id: 'weekly-8',
                text: 'I am grateful for all that I have and all that I am becoming.',
                type: 'weekly'
            },
            {
                id: 'daily-8-1',
                text: 'I start each day with gratitude and appreciation.',
                type: 'daily',
                day: 1
            },
            {
                id: 'daily-8-2',
                text: 'I express gratitude freely and it multiplies my joy.',
                type: 'daily',
                day: 2
            },
            {
                id: 'daily-8-3',
                text: 'I find gratitude even in challenges and difficulties.',
                type: 'daily',
                day: 3
            },
            {
                id: 'daily-8-4',
                text: 'I notice and appreciate the beauty around me.',
                type: 'daily',
                day: 4
            },
            {
                id: 'daily-8-5',
                text: 'I am grateful for who I am and how I show up.',
                type: 'daily',
                day: 5
            },
            {
                id: 'daily-8-6',
                text: 'Gratitude fills my heart and transforms my perspective.',
                type: 'daily',
                day: 6
            },
            {
                id: 'daily-8-7',
                text: 'Gratitude is my daily practice and my way of life.',
                type: 'daily',
                day: 7
            }
        ],
        prompts: [
            {
                id: 'prompt-8-1',
                text: 'What am I grateful for today? How does it feel?',
                type: 'daily',
                day: 1
            },
            {
                id: 'prompt-8-2',
                text: 'Who did I express gratitude to? What was their response?',
                type: 'daily',
                day: 2
            },
            {
                id: 'prompt-8-3',
                text: 'What can I be grateful for in my current challenges?',
                type: 'daily',
                day: 3
            },
            {
                id: 'prompt-8-4',
                text: 'What did I notice and appreciate during my walk?',
                type: 'daily',
                day: 4
            },
            {
                id: 'prompt-8-5',
                text: 'What am I grateful for about myself?',
                type: 'daily',
                day: 5
            },
            {
                id: 'prompt-8-6',
                text: 'How did gratitude meditation impact my state?',
                type: 'daily',
                day: 6
            },
            {
                id: 'prompt-8-7',
                text: 'What gratitude ritual will I continue? How will it help?',
                type: 'daily',
                day: 7
            },
            {
                id: 'weekly-prompt-8',
                text: 'Reflect on Week 8: How did gratitude shift my perspective? What will I continue?',
                type: 'weekly'
            }
        ]
    },
    {
        id: 9,
        title: 'Momentum Week',
        theme: 'Building Habits',
        description: 'Build powerful habits that support your goals and create sustainable momentum toward your vision.',
        unlocked: false,
        focusAreas: [
            {
                id: 'habits',
                title: 'Habit Formation',
                description: 'Develop and strengthen positive habits',
                dailyChallenges: [
                    {
                        day: 1,
                        title: 'Identify Keystone Habits',
                        description: 'Find the habits that will have the biggest impact',
                        actionItems: [
                            'List your goals',
                            'Identify supporting habits',
                            'Choose 1-2 keystone habits',
                            'Prioritize them'
                        ]
                    },
                    {
                        day: 2,
                        title: 'Start Small',
                        description: 'Begin with a tiny version of your habit',
                        actionItems: [
                            'Choose your habit',
                            'Make it extremely small',
                            'Do it immediately',
                            'Celebrate completion'
                        ]
                    },
                    {
                        day: 3,
                        title: 'Stack Habits',
                        description: 'Link your new habit to an existing one',
                        actionItems: [
                            'Identify existing habit',
                            'Choose new habit',
                            'Link them together',
                            'Practice the stack'
                        ]
                    },
                    {
                        day: 4,
                        title: 'Design Your Environment',
                        description: 'Set up your environment to support your habits',
                        actionItems: [
                            'Remove obstacles',
                            'Add cues',
                            'Make it easy',
                            'Set up reminders'
                        ]
                    },
                    {
                        day: 5,
                        title: 'Track Your Habits',
                        description: 'Monitor your habit performance',
                        actionItems: [
                            'Choose tracking method',
                            'Record daily',
                            'Review progress',
                            'Adjust as needed'
                        ]
                    },
                    {
                        day: 6,
                        title: 'Handle Missed Days',
                        description: 'Practice getting back on track after missing',
                        actionItems: [
                            'Acknowledge the miss',
                            'Don\'t beat yourself up',
                            'Get back immediately',
                            'Learn from it'
                        ]
                    },
                    {
                        day: 7,
                        title: 'Celebrate Streaks',
                        description: 'Acknowledge your consistency and progress',
                        actionItems: [
                            'Count your streak',
                            'Celebrate the milestone',
                            'Reflect on benefits',
                            'Commit to continuing'
                        ]
                    }
                ]
            }
        ],
        mantras: [
            {
                id: 'weekly-9',
                text: 'I build powerful habits that support my goals. Small actions create big results.',
                type: 'weekly'
            },
            {
                id: 'daily-9-1',
                text: 'I focus on keystone habits that create cascading positive change.',
                type: 'daily',
                day: 1
            },
            {
                id: 'daily-9-2',
                text: 'I start small and build momentum through consistency.',
                type: 'daily',
                day: 2
            },
            {
                id: 'daily-9-3',
                text: 'I stack habits to make them stick effortlessly.',
                type: 'daily',
                day: 3
            },
            {
                id: 'daily-9-4',
                text: 'I design my environment to make good habits inevitable.',
                type: 'daily',
                day: 4
            },
            {
                id: 'daily-9-5',
                text: 'I track my habits and celebrate my progress.',
                type: 'daily',
                day: 5
            },
            {
                id: 'daily-9-6',
                text: 'I get back on track immediately after any miss.',
                type: 'daily',
                day: 6
            },
            {
                id: 'daily-9-7',
                text: 'I celebrate my consistency and the momentum it creates.',
                type: 'daily',
                day: 7
            }
        ],
        prompts: [
            {
                id: 'prompt-9-1',
                text: 'What keystone habits did I identify? Why are they important?',
                type: 'daily',
                day: 1
            },
            {
                id: 'prompt-9-2',
                text: 'What small habit did I start? How did it feel?',
                type: 'daily',
                day: 2
            },
            {
                id: 'prompt-9-3',
                text: 'How did I stack habits today? Did it help?',
                type: 'daily',
                day: 3
            },
            {
                id: 'prompt-9-4',
                text: 'How did I design my environment to support habits?',
                type: 'daily',
                day: 4
            },
            {
                id: 'prompt-9-5',
                text: 'How did tracking help me today?',
                type: 'daily',
                day: 5
            },
            {
                id: 'prompt-9-6',
                text: 'How did I handle any missed habits? What did I learn?',
                type: 'daily',
                day: 6
            },
            {
                id: 'prompt-9-7',
                text: 'What habits am I building? How is my momentum?',
                type: 'daily',
                day: 7
            },
            {
                id: 'weekly-prompt-9',
                text: 'Reflect on Week 9: What habits did I build? How will I maintain them?',
                type: 'weekly'
            }
        ]
    },
    {
        id: 10,
        title: 'Breakthrough Week',
        theme: 'Overcoming Obstacles',
        description: 'Break through limiting beliefs and obstacles that have been holding you back from achieving your full potential.',
        unlocked: false,
        focusAreas: [
            {
                id: 'breakthrough',
                title: 'Obstacle Mastery',
                description: 'Identify and overcome barriers to your success',
                dailyChallenges: [
                    {
                        day: 1,
                        title: 'Identify Limiting Beliefs',
                        description: 'Name the beliefs that are holding you back',
                        actionItems: [
                            'List your limiting beliefs',
                            'Write them down',
                            'Question their truth',
                            'Identify their origin'
                        ]
                    },
                    {
                        day: 2,
                        title: 'Challenge Your Stories',
                        description: 'Question the stories you tell yourself',
                        actionItems: [
                            'Notice your self-talk',
                            'Identify negative stories',
                            'Challenge their validity',
                            'Rewrite empowering versions'
                        ]
                    },
                    {
                        day: 3,
                        title: 'Face Your Biggest Obstacle',
                        description: 'Take direct action on your biggest barrier',
                        actionItems: [
                            'Identify the obstacle',
                            'Break it into steps',
                            'Take the first step',
                            'Keep moving forward'
                        ]
                    },
                    {
                        day: 4,
                        title: 'Seek Support',
                        description: 'Ask for help with something you\'ve been struggling with',
                        actionItems: [
                            'Identify what you need help with',
                            'Choose who to ask',
                            'Ask clearly and specifically',
                            'Accept the support'
                        ]
                    },
                    {
                        day: 5,
                        title: 'Reframe Failure',
                        description: 'View a past failure as a necessary step to success',
                        actionItems: [
                            'Identify a past failure',
                            'List what you learned',
                            'See it as data',
                            'Reframe as progress'
                        ]
                    },
                    {
                        day: 6,
                        title: 'Take Bold Action',
                        description: 'Do something you\'ve been avoiding due to fear',
                        actionItems: [
                            'Identify avoided action',
                            'Prepare yourself',
                            'Take the action',
                            'Celebrate your courage'
                        ]
                    },
                    {
                        day: 7,
                        title: 'Celebrate Breakthroughs',
                        description: 'Acknowledge all the obstacles you overcame this week',
                        actionItems: [
                            'List every breakthrough',
                            'Acknowledge your strength',
                            'Celebrate your progress',
                            'Set intention for more'
                        ]
                    }
                ]
            }
        ],
        mantras: [
            {
                id: 'weekly-10',
                text: 'I break through obstacles and limiting beliefs. Nothing can hold me back.',
                type: 'weekly'
            },
            {
                id: 'daily-10-1',
                text: 'I identify and release limiting beliefs that no longer serve me.',
                type: 'daily',
                day: 1
            },
            {
                id: 'daily-10-2',
                text: 'I challenge my stories and rewrite empowering narratives.',
                type: 'daily',
                day: 2
            },
            {
                id: 'daily-10-3',
                text: 'I face obstacles directly and overcome them with determination.',
                type: 'daily',
                day: 3
            },
            {
                id: 'daily-10-4',
                text: 'I ask for help when needed and accept support graciously.',
                type: 'daily',
                day: 4
            },
            {
                id: 'daily-10-5',
                text: 'I reframe failures as feedback and stepping stones to success.',
                type: 'daily',
                day: 5
            },
            {
                id: 'daily-10-6',
                text: 'I take bold action despite fear and create breakthroughs.',
                type: 'daily',
                day: 6
            },
            {
                id: 'daily-10-7',
                text: 'I celebrate every breakthrough and the strength it reveals.',
                type: 'daily',
                day: 7
            }
        ],
        prompts: [
            {
                id: 'prompt-10-1',
                text: 'What limiting beliefs did I identify? How are they holding me back?',
                type: 'daily',
                day: 1
            },
            {
                id: 'prompt-10-2',
                text: 'What stories did I challenge? What new narrative did I create?',
                type: 'daily',
                day: 2
            },
            {
                id: 'prompt-10-3',
                text: 'What obstacle did I face? How did I overcome it?',
                type: 'daily',
                day: 3
            },
            {
                id: 'prompt-10-4',
                text: 'What support did I seek? How did it help?',
                type: 'daily',
                day: 4
            },
            {
                id: 'prompt-10-5',
                text: 'How did I reframe a failure? What did I learn?',
                type: 'daily',
                day: 5
            },
            {
                id: 'prompt-10-6',
                text: 'What bold action did I take? What breakthrough did it create?',
                type: 'daily',
                day: 6
            },
            {
                id: 'prompt-10-7',
                text: 'What breakthroughs did I achieve this week?',
                type: 'daily',
                day: 7
            },
            {
                id: 'weekly-prompt-10',
                text: 'Reflect on Week 10: What obstacles did I overcome? How did I grow?',
                type: 'weekly'
            }
        ]
    },
    {
        id: 11,
        title: 'Mastery Week',
        theme: 'Refining Skills',
        description: 'Focus on mastery and excellence, refining your skills and deepening your expertise in areas that matter.',
        unlocked: false,
        focusAreas: [
            {
                id: 'mastery',
                title: 'Skill Refinement',
                description: 'Develop mastery through deliberate practice',
                dailyChallenges: [
                    {
                        day: 1,
                        title: 'Identify Mastery Areas',
                        description: 'Choose skills you want to master',
                        actionItems: [
                            'List skills you want to develop',
                            'Prioritize by impact',
                            'Choose 1-2 focus areas',
                            'Set mastery goals'
                        ]
                    },
                    {
                        day: 2,
                        title: 'Practice Deliberately',
                        description: 'Engage in focused, intentional practice',
                        actionItems: [
                            'Choose specific skill',
                            'Focus on weaknesses',
                            'Practice with intention',
                            'Seek immediate feedback'
                        ]
                    },
                    {
                        day: 3,
                        title: 'Study Experts',
                        description: 'Learn from those who have mastered your skill',
                        actionItems: [
                            'Identify experts',
                            'Study their methods',
                            'Learn their principles',
                            'Adapt their approaches'
                        ]
                    },
                    {
                        day: 4,
                        title: 'Push Your Limits',
                        description: 'Practice at the edge of your ability',
                        actionItems: [
                            'Identify current level',
                            'Choose stretch challenge',
                            'Practice at edge',
                            'Notice improvement'
                        ]
                    },
                    {
                        day: 5,
                        title: 'Get Expert Feedback',
                        description: 'Seek feedback from someone more skilled',
                        actionItems: [
                            'Identify expert',
                            'Prepare your work',
                            'Ask specific questions',
                            'Apply the feedback'
                        ]
                    },
                    {
                        day: 6,
                        title: 'Teach What You Learn',
                        description: 'Explain your skill to someone else',
                        actionItems: [
                            'Choose what to teach',
                            'Break it down simply',
                            'Explain clearly',
                            'Answer questions'
                        ]
                    },
                    {
                        day: 7,
                        title: 'Reflect on Mastery Journey',
                        description: 'Assess your progress and plan next steps',
                        actionItems: [
                            'Review your progress',
                            'Identify improvements',
                            'Celebrate growth',
                            'Plan continued practice'
                        ]
                    }
                ]
            }
        ],
        mantras: [
            {
                id: 'weekly-11',
                text: 'I commit to mastery. I practice deliberately and refine my skills daily.',
                type: 'weekly'
            },
            {
                id: 'daily-11-1',
                text: 'I choose mastery areas that align with my purpose.',
                type: 'daily',
                day: 1
            },
            {
                id: 'daily-11-2',
                text: 'I practice deliberately and intentionally every day.',
                type: 'daily',
                day: 2
            },
            {
                id: 'daily-11-3',
                text: 'I learn from masters and adapt their wisdom.',
                type: 'daily',
                day: 3
            },
            {
                id: 'daily-11-4',
                text: 'I push my limits and expand my capabilities.',
                type: 'daily',
                day: 4
            },
            {
                id: 'daily-11-5',
                text: 'I seek expert feedback to accelerate my growth.',
                type: 'daily',
                day: 5
            },
            {
                id: 'daily-11-6',
                text: 'Teaching deepens my understanding and mastery.',
                type: 'daily',
                day: 6
            },
            {
                id: 'daily-11-7',
                text: 'I reflect on my mastery journey and commit to continued growth.',
                type: 'daily',
                day: 7
            }
        ],
        prompts: [
            {
                id: 'prompt-11-1',
                text: 'What mastery areas did I choose? Why are they important?',
                type: 'daily',
                day: 1
            },
            {
                id: 'prompt-11-2',
                text: 'How did I practice deliberately today? What did I improve?',
                type: 'daily',
                day: 2
            },
            {
                id: 'prompt-11-3',
                text: 'What did I learn from studying experts?',
                type: 'daily',
                day: 3
            },
            {
                id: 'prompt-11-4',
                text: 'How did I push my limits? What did I discover?',
                type: 'daily',
                day: 4
            },
            {
                id: 'prompt-11-5',
                text: 'What feedback did I receive? How will I apply it?',
                type: 'daily',
                day: 5
            },
            {
                id: 'prompt-11-6',
                text: 'What did I teach? How did it deepen my understanding?',
                type: 'daily',
                day: 6
            },
            {
                id: 'prompt-11-7',
                text: 'How have I progressed toward mastery? What\'s next?',
                type: 'daily',
                day: 7
            },
            {
                id: 'weekly-prompt-11',
                text: 'Reflect on Week 11: How did I develop mastery? What skills did I refine?',
                type: 'weekly'
            }
        ]
    },
    {
        id: 12,
        title: 'Victory Week',
        theme: 'Celebrating Achievements',
        description: 'Celebrate your journey, acknowledge your achievements, and set intentions for continued growth beyond these 12 weeks.',
        unlocked: false,
        focusAreas: [
            {
                id: 'celebration',
                title: 'Achievement Recognition',
                description: 'Acknowledge and celebrate your transformation',
                dailyChallenges: [
                    {
                        day: 1,
                        title: 'Review Your Journey',
                        description: 'Reflect on all 12 weeks and your transformation',
                        actionItems: [
                            'Review each week',
                            'Note key learnings',
                            'Identify growth areas',
                            'Acknowledge progress'
                        ]
                    },
                    {
                        day: 2,
                        title: 'List Your Achievements',
                        description: 'Document everything you accomplished',
                        actionItems: [
                            'List all achievements',
                            'Big and small',
                            'Be comprehensive',
                            'Celebrate each one'
                        ]
                    },
                    {
                        day: 3,
                        title: 'Measure Your Progress',
                        description: 'Compare where you are now to where you started',
                        actionItems: [
                            'Review baseline metrics',
                            'Measure current state',
                            'Calculate progress',
                            'Acknowledge the growth'
                        ]
                    },
                    {
                        day: 4,
                        title: 'Express Gratitude',
                        description: 'Thank those who supported your journey',
                        actionItems: [
                            'List supporters',
                            'Express appreciation',
                            'Be specific',
                            'Share your wins'
                        ]
                    },
                    {
                        day: 5,
                        title: 'Share Your Story',
                        description: 'Tell someone about your transformation',
                        actionItems: [
                            'Choose who to share with',
                            'Tell your story',
                            'Highlight key moments',
                            'Inspire others'
                        ]
                    },
                    {
                        day: 6,
                        title: 'Set Future Goals',
                        description: 'Create goals for continued growth',
                        actionItems: [
                            'Reflect on what\'s next',
                            'Set new goals',
                            'Build on progress',
                            'Commit to continued growth'
                        ]
                    },
                    {
                        day: 7,
                        title: 'Celebrate Your Victory',
                        description: 'Have a meaningful celebration of your achievement',
                        actionItems: [
                            'Plan your celebration',
                            'Include others',
                            'Acknowledge yourself',
                            'Enjoy the moment'
                        ]
                    }
                ]
            }
        ],
        mantras: [
            {
                id: 'weekly-12',
                text: 'I celebrate my victory and all that I have become. This is just the beginning.',
                type: 'weekly'
            },
            {
                id: 'daily-12-1',
                text: 'I honor my journey and all the growth it brought.',
                type: 'daily',
                day: 1
            },
            {
                id: 'daily-12-2',
                text: 'I celebrate every achievement, big and small.',
                type: 'daily',
                day: 2
            },
            {
                id: 'daily-12-3',
                text: 'I acknowledge my progress and how far I have come.',
                type: 'daily',
                day: 3
            },
            {
                id: 'daily-12-4',
                text: 'I express gratitude for all who supported my journey.',
                type: 'daily',
                day: 4
            },
            {
                id: 'daily-12-5',
                text: 'I share my story and inspire others with my transformation.',
                type: 'daily',
                day: 5
            },
            {
                id: 'daily-12-6',
                text: 'I set new goals and commit to continued growth.',
                type: 'daily',
                day: 6
            },
            {
                id: 'daily-12-7',
                text: 'I celebrate my victory and look forward to what\'s next.',
                type: 'daily',
                day: 7
            }
        ],
        prompts: [
            {
                id: 'prompt-12-1',
                text: 'How have I transformed over these 12 weeks? What stands out?',
                type: 'daily',
                day: 1
            },
            {
                id: 'prompt-12-2',
                text: 'What achievements am I most proud of?',
                type: 'daily',
                day: 2
            },
            {
                id: 'prompt-12-3',
                text: 'How much progress did I make? What metrics show my growth?',
                type: 'daily',
                day: 3
            },
            {
                id: 'prompt-12-4',
                text: 'Who supported my journey? How can I thank them?',
                type: 'daily',
                day: 4
            },
            {
                id: 'prompt-12-5',
                text: 'How did sharing my story impact me and others?',
                type: 'daily',
                day: 5
            },
            {
                id: 'prompt-12-6',
                text: 'What goals will I pursue next? How will I continue growing?',
                type: 'daily',
                day: 6
            },
            {
                id: 'prompt-12-7',
                text: 'How will I celebrate this victory? What does it mean to me?',
                type: 'daily',
                day: 7
            },
            {
                id: 'weekly-prompt-12',
                text: 'Reflect on Week 12: How do I feel about my transformation? What will I carry forward? What\'s next in my journey?',
                type: 'weekly'
            }
        ]
    }
];