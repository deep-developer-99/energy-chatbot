// Energy Optimization Chatbot Application
class EcoBotChatbot {
    constructor() {
        this.currentTipIndex = 0;
        this.chatHistory = [];
        this.isTyping = false;
        
        // Energy data from the provided JSON
        this.energyData = {
            energyTips: [
                {
                    category: "lighting",
                    tip: "Switch to LED bulbs - they use 75% less energy and last 25 times longer than incandescent bulbs",
                    savings: "Up to $75/year per household"
                },
                {
                    category: "hvac", 
                    tip: "Set thermostat to 68°F in winter and 78°F in summer for optimal efficiency",
                    savings: "Up to 10% on heating/cooling costs"
                },
                {
                    category: "appliances",
                    tip: "Choose ENERGY STAR certified appliances - they use 10-50% less energy",
                    savings: "Up to $300/year on utilities"
                },
                {
                    category: "water",
                    tip: "Install low-flow showerheads and faucets to reduce hot water usage",
                    savings: "Up to $70/year on water heating"
                }
            ],
            applianceRecommendations: [
                {
                    type: "refrigerator",
                    model: "ENERGY STAR French Door",
                    efficiency: "5-star rating",
                    annualCost: "$45-65",
                    features: ["LED lighting", "Smart temperature controls", "High-efficiency compressor"]
                },
                {
                    type: "washing_machine", 
                    model: "ENERGY STAR Front-Load",
                    efficiency: "4.5-star rating",
                    annualCost: "$25-35",
                    features: ["Cold water cleaning", "High-efficiency motor", "Load sensing"]
                },
                {
                    type: "air_conditioner",
                    model: "ENERGY STAR Central AC",  
                    efficiency: "16+ SEER rating",
                    annualCost: "$200-300",
                    features: ["Variable speed compressor", "Smart thermostat compatible", "Zoned cooling"]
                }
            ],
            renewableOptions: [
                {
                    type: "solar",
                    description: "Solar panels convert sunlight into electricity",
                    cost: "$15,000-25,000 installed",
                    payback: "6-10 years",
                    savings: "50-90% reduction in electricity bills",
                    suitability: "Best for sunny locations with south-facing roofs"
                },
                {
                    type: "wind",
                    description: "Small wind turbines generate electricity from wind",
                    cost: "$10,000-20,000 installed", 
                    payback: "10-15 years",
                    savings: "30-50% reduction in electricity bills",
                    suitability: "Requires consistent wind speeds of 10+ mph"
                },
                {
                    type: "geothermal",
                    description: "Heat pumps use ground temperature for heating/cooling",
                    cost: "$20,000-30,000 installed",
                    payback: "8-12 years", 
                    savings: "25-50% reduction in heating/cooling costs",
                    suitability: "Works in most climates, requires yard space"
                }
            ],
            smartHomeDevices: [
                {
                    device: "Smart Thermostat",
                    benefit: "Automatic temperature scheduling and remote control",
                    savings: "10-15% on heating/cooling",
                    cost: "$150-300"
                },
                {
                    device: "Smart Lighting",
                    benefit: "Automated on/off scheduling and dimming",
                    savings: "60% on lighting costs",
                    cost: "$15-50 per bulb"
                },
                {
                    device: "Smart Power Strips",
                    benefit: "Eliminate phantom loads from electronics",
                    savings: "5-10% on electricity bills", 
                    cost: "$30-80"
                },
                {
                    device: "Smart Water Heater Controller",
                    benefit: "Optimize water heating schedules",
                    savings: "10-15% on water heating costs",
                    cost: "$200-400"
                }
            ],
            businessTips: [
                {
                    category: "office_lighting",
                    tip: "Upgrade to LED lighting with occupancy sensors",
                    savings: "Up to 75% reduction in lighting costs",
                    implementation: "Low complexity - 1-2 weeks"
                },
                {
                    category: "hvac_commercial", 
                    tip: "Install programmable thermostats and zone controls",
                    savings: "15-25% reduction in heating/cooling costs",
                    implementation: "Medium complexity - 1-2 months"
                },
                {
                    category: "equipment",
                    tip: "Upgrade to ENERGY STAR certified office equipment",
                    savings: "10-30% reduction in equipment energy use",
                    implementation: "Low complexity - ongoing replacements"
                }
            ]
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.startTipsCarousel();
        this.loadChatHistory();
    }

    bindEvents() {
        // Chat form submission
        const chatForm = document.getElementById('chatForm');
        const messageInput = document.getElementById('messageInput');
        
        if (chatForm) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.sendMessage();
            });
        }

        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Quick action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Tips carousel controls
        const prevBtn = document.getElementById('prevTip');
        const nextBtn = document.getElementById('nextTip');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.previousTip();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.nextTip();
            });
        }

        // Chat actions
        const exportBtn = document.getElementById('exportChat');
        const clearBtn = document.getElementById('clearChat');
        
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.exportChat();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.clearChat();
            });
        }

        // Calculator modal
        const closeCalculatorBtn = document.getElementById('closeCalculator');
        const calculateBtn = document.getElementById('calculateSavings');
        const calculatorModal = document.getElementById('calculatorModal');
        
        if (closeCalculatorBtn) {
            closeCalculatorBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeCalculator();
            });
        }

        if (calculateBtn) {
            calculateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.calculateSavings();
            });
        }

        // Close modal on backdrop click only
        if (calculatorModal) {
            calculatorModal.addEventListener('click', (e) => {
                // Only close if clicking the modal backdrop, not the content
                if (e.target === calculatorModal) {
                    this.closeCalculator();
                }
            });
        }

        // Prevent modal content clicks from closing the modal
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Prevent form inputs from closing modal
        const modalInputs = document.querySelectorAll('#calculatorModal input, #calculatorModal select');
        modalInputs.forEach(input => {
            input.addEventListener('click', (e) => {
                e.stopPropagation();
            });
            input.addEventListener('focus', (e) => {
                e.stopPropagation();
            });
        });
    }

    sendMessage() {
        const input = document.getElementById('messageInput');
        if (!input) return;
        
        const message = input.value.trim();
        
        if (!message || this.isTyping) return;

        this.addMessage(message, 'user');
        input.value = '';
        
        // Show typing indicator and generate response
        this.showTypingIndicator();
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
        }, 1000 + Math.random() * 1500);
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        messageDiv.className = `message ${sender}-message fade-in`;
        messageDiv.innerHTML = `
            <div class="message-avatar">${sender === 'user' ? '👤' : '🤖'}</div>
            <div class="message-content">
                ${typeof content === 'string' ? `<p>${content}</p>` : content}
            </div>
            <div class="message-time">${time}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Save to history
        this.chatHistory.push({
            content: typeof content === 'string' ? content : content.outerHTML,
            sender,
            timestamp: new Date().toISOString()
        });
        
        this.saveChatHistory();
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Intent classification
        if (this.containsWords(message, ['audit', 'efficiency', 'energy usage', 'consumption'])) {
            return this.getEnergyAuditResponse();
        }
        
        if (this.containsWords(message, ['appliance', 'refrigerator', 'washing machine', 'ac', 'air conditioner'])) {
            return this.getApplianceResponse();
        }
        
        if (this.containsWords(message, ['renewable', 'solar', 'wind', 'geothermal', 'clean energy'])) {
            return this.getRenewableResponse();
        }
        
        if (this.containsWords(message, ['smart home', 'automation', 'thermostat', 'smart lighting'])) {
            return this.getSmartHomeResponse();
        }
        
        if (this.containsWords(message, ['cost', 'savings', 'calculate', 'money', 'bill'])) {
            return this.getCostResponse();
        }
        
        if (this.containsWords(message, ['business', 'office', 'commercial', 'company'])) {
            return this.getBusinessResponse();
        }
        
        if (this.containsWords(message, ['lighting', 'led', 'bulb', 'lights'])) {
            return this.getLightingResponse();
        }
        
        if (this.containsWords(message, ['heating', 'cooling', 'hvac', 'thermostat', 'temperature'])) {
            return this.getHVACResponse();
        }
        
        // Default response
        return this.getDefaultResponse();
    }

    containsWords(text, words) {
        return words.some(word => text.includes(word));
    }

    getEnergyAuditResponse() {
        return `
            <p>🔍 <strong>Energy Audit Tips:</strong></p>
            <p>Here's how to conduct a comprehensive energy audit of your home:</p>
            <ul>
                <li><strong>Check for air leaks:</strong> Look around windows, doors, and outlets</li>
                <li><strong>Inspect insulation:</strong> Ensure adequate insulation in attic and walls</li>
                <li><strong>Review energy bills:</strong> Compare usage patterns over 12 months</li>
                <li><strong>Test major appliances:</strong> Check age and efficiency ratings</li>
                <li><strong>Examine lighting:</strong> Count non-LED bulbs that need replacing</li>
            </ul>
            <p>💡 <strong>Quick wins:</strong> Start with LED bulbs and programmable thermostats - these typically provide immediate savings!</p>
        `;
    }

    getApplianceResponse() {
        const appliances = this.energyData.applianceRecommendations;
        let response = '<p>⭐ <strong>Top Energy-Efficient Appliance Recommendations:</strong></p>';
        
        appliances.forEach(appliance => {
            response += `
                <div style="margin: 12px 0; padding: 12px; background: rgba(33, 128, 141, 0.1); border-radius: 8px;">
                    <p><strong>${appliance.type.replace('_', ' ').toUpperCase()}:</strong> ${appliance.model}</p>
                    <p>• Efficiency: ${appliance.efficiency}</p>
                    <p>• Annual operating cost: ${appliance.annualCost}</p>
                    <p>• Key features: ${appliance.features.join(', ')}</p>
                </div>
            `;
        });
        
        response += '<p>🏆 Look for the ENERGY STAR label when shopping - it guarantees superior efficiency!</p>';
        return response;
    }

    getRenewableResponse() {
        const renewables = this.energyData.renewableOptions;
        let response = '<p>🌱 <strong>Renewable Energy Options:</strong></p>';
        
        renewables.forEach(option => {
            response += `
                <div style="margin: 12px 0; padding: 12px; background: rgba(34, 197, 94, 0.1); border-radius: 8px;">
                    <p><strong>${option.type.toUpperCase()}:</strong></p>
                    <p>${option.description}</p>
                    <p>• Installation cost: ${option.cost}</p>
                    <p>• Payback period: ${option.payback}</p>
                    <p>• Potential savings: ${option.savings}</p>
                    <p>• Best for: ${option.suitability}</p>
                </div>
            `;
        });
        
        response += '<p>💰 Many areas offer tax incentives and rebates for renewable energy installations!</p>';
        return response;
    }

    getSmartHomeResponse() {
        const devices = this.energyData.smartHomeDevices;
        let response = '<p>🏠 <strong>Smart Home Energy Solutions:</strong></p>';
        
        devices.forEach(device => {
            response += `
                <div style="margin: 12px 0; padding: 12px; background: rgba(59, 130, 246, 0.1); border-radius: 8px;">
                    <p><strong>${device.device}:</strong></p>
                    <p>${device.benefit}</p>
                    <p>• Potential savings: ${device.savings}</p>
                    <p>• Investment: ${device.cost}</p>
                </div>
            `;
        });
        
        response += '<p>📱 Start with a smart thermostat - it\'s often the highest ROI smart home investment!</p>';
        return response;
    }

    getCostResponse() {
        return `
            <p>💰 <strong>Energy Cost Analysis:</strong></p>
            <p>Let me help you understand potential savings:</p>
            <ul>
                <li><strong>LED lighting upgrade:</strong> Save $75-100/year</li>
                <li><strong>Smart thermostat:</strong> Save 10-15% on heating/cooling</li>
                <li><strong>ENERGY STAR appliances:</strong> Save $300+/year</li>
                <li><strong>Complete home upgrade:</strong> Save 20-30% total energy costs</li>
            </ul>
            <p>🧮 Would you like to use our <strong>Energy Savings Calculator</strong> for personalized estimates? Just click the calculator button in the sidebar!</p>
        `;
    }

    getBusinessResponse() {
        const businessTips = this.energyData.businessTips;
        let response = '<p>🏢 <strong>Business Energy Optimization:</strong></p>';
        
        businessTips.forEach(tip => {
            response += `
                <div style="margin: 12px 0; padding: 12px; background: rgba(245, 158, 11, 0.1); border-radius: 8px;">
                    <p><strong>${tip.category.replace('_', ' ').toUpperCase()}:</strong></p>
                    <p>${tip.tip}</p>
                    <p>• Potential savings: ${tip.savings}</p>
                    <p>• Implementation: ${tip.implementation}</p>
                </div>
            `;
        });
        
        response += '<p>📊 Business energy audits often qualify for utility rebates and tax incentives!</p>';
        return response;
    }

    getLightingResponse() {
        const lightingTip = this.energyData.energyTips.find(tip => tip.category === 'lighting');
        return `
            <p>💡 <strong>Lighting Optimization:</strong></p>
            <p>${lightingTip.tip}</p>
            <p><strong>Savings potential:</strong> ${lightingTip.savings}</p>
            <p><strong>Additional lighting tips:</strong></p>
            <ul>
                <li>Use motion sensors in less-used areas</li>
                <li>Maximize natural light with mirrors and light colors</li>
                <li>Install dimmer switches for ambiance and energy savings</li>
                <li>Choose warm white LEDs (2700K-3000K) for comfort</li>
            </ul>
            <p>🌟 Pro tip: Replace your 5 most-used bulbs first for maximum impact!</p>
        `;
    }

    getHVACResponse() {
        const hvacTip = this.energyData.energyTips.find(tip => tip.category === 'hvac');
        return `
            <p>🌡️ <strong>HVAC Optimization:</strong></p>
            <p>${hvacTip.tip}</p>
            <p><strong>Savings potential:</strong> ${hvacTip.savings}</p>
            <p><strong>Additional HVAC tips:</strong></p>
            <ul>
                <li>Change air filters every 1-3 months</li>
                <li>Seal ductwork to prevent energy loss</li>
                <li>Use ceiling fans to feel cooler at higher temperatures</li>
                <li>Close vents in unused rooms</li>
                <li>Consider a programmable or smart thermostat</li>
            </ul>
            <p>❄️ Every degree adjustment can save 6-8% on your energy bill!</p>
        `;
    }

    getDefaultResponse() {
        const responses = [
            "I'd be happy to help you optimize your energy consumption! You can ask me about energy audits, appliance recommendations, renewable energy, smart home solutions, or cost calculations.",
            "That's a great question about energy efficiency! I can provide advice on lighting, HVAC systems, appliances, renewable energy options, and smart home automation. What specific area interests you most?",
            "Let me help you save energy and money! I have expertise in home energy audits, ENERGY STAR appliances, solar/wind/geothermal systems, and smart home devices. What would you like to explore?",
            "Energy optimization is my specialty! Whether you're interested in quick wins like LED lighting or major investments like solar panels, I can guide you through your options. What's your energy goal?"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    handleQuickAction(action) {
        const actions = {
            'energy-audit': () => {
                this.showTypingIndicator();
                setTimeout(() => {
                    this.hideTypingIndicator();
                    this.addMessage(this.getEnergyAuditResponse(), 'bot');
                }, 800);
            },
            'appliances': () => {
                this.showTypingIndicator();
                setTimeout(() => {
                    this.hideTypingIndicator();
                    this.addMessage(this.getApplianceResponse(), 'bot');
                }, 800);
            },
            'renewable': () => {
                this.showTypingIndicator();
                setTimeout(() => {
                    this.hideTypingIndicator();
                    this.addMessage(this.getRenewableResponse(), 'bot');
                }, 800);
            },
            'smart-home': () => {
                this.showTypingIndicator();
                setTimeout(() => {
                    this.hideTypingIndicator();
                    this.addMessage(this.getSmartHomeResponse(), 'bot');
                }, 800);
            },
            'calculator': () => this.openCalculator()
        };

        if (actions[action]) {
            actions[action]();
        }
    }

    // Tips Carousel
    startTipsCarousel() {
        setInterval(() => {
            this.nextTip();
        }, 5000);
    }

    nextTip() {
        const tips = document.querySelectorAll('.tip-item');
        if (tips.length === 0) return;
        
        tips[this.currentTipIndex].classList.remove('active');
        this.currentTipIndex = (this.currentTipIndex + 1) % tips.length;
        tips[this.currentTipIndex].classList.add('active');
    }

    previousTip() {
        const tips = document.querySelectorAll('.tip-item');
        if (tips.length === 0) return;
        
        tips[this.currentTipIndex].classList.remove('active');
        this.currentTipIndex = this.currentTipIndex === 0 ? tips.length - 1 : this.currentTipIndex - 1;
        tips[this.currentTipIndex].classList.add('active');
    }

    // Typing indicator
    showTypingIndicator() {
        this.isTyping = true;
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.classList.remove('hidden');
            const messagesContainer = document.getElementById('chatMessages');
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.classList.add('hidden');
        }
    }

    // Calculator functionality
    openCalculator() {
        const modal = document.getElementById('calculatorModal');
        if (modal) {
            modal.classList.remove('hidden');
            // Reset results
            const results = document.getElementById('calculatorResults');
            if (results) {
                results.classList.add('hidden');
            }
        }
    }

    closeCalculator() {
        const modal = document.getElementById('calculatorModal');
        if (modal) {
            modal.classList.add('hidden');
        }
        const results = document.getElementById('calculatorResults');
        if (results) {
            results.classList.add('hidden');
        }
    }

    calculateSavings() {
        const currentBillInput = document.getElementById('currentBill');
        const homeTypeSelect = document.getElementById('homeType');
        const improvementTypeSelect = document.getElementById('improvementType');
        
        if (!currentBillInput || !homeTypeSelect || !improvementTypeSelect) {
            console.error('Calculator form elements not found');
            return;
        }
        
        const currentBill = parseFloat(currentBillInput.value);
        const homeType = homeTypeSelect.value;
        const improvementType = improvementTypeSelect.value;

        if (!currentBill || currentBill <= 0) {
            alert('Please enter a valid monthly electric bill amount.');
            return;
        }

        // Calculate savings based on improvement type
        const savingsRates = {
            'led_lighting': { rate: 0.15, cost: 200, co2: 500 },
            'smart_thermostat': { rate: 0.12, cost: 250, co2: 800 },
            'energy_star_appliances': { rate: 0.25, cost: 2000, co2: 1200 },
            'solar_panels': { rate: 0.70, cost: 20000, co2: 3000 },
            'comprehensive': { rate: 0.35, cost: 8000, co2: 2000 }
        };

        // Home type multipliers
        const homeMultipliers = {
            'apartment': 0.7,
            'house': 1.0,
            'large_house': 1.4
        };

        const improvement = savingsRates[improvementType];
        const multiplier = homeMultipliers[homeType];
        
        const annualSavings = Math.round((currentBill * 12 * improvement.rate * multiplier));
        const monthlySavings = Math.round(annualSavings / 12);
        const paybackYears = Math.round((improvement.cost * multiplier) / annualSavings * 10) / 10;
        const co2Reduction = Math.round(improvement.co2 * multiplier);

        // Display results
        const annualSavingsEl = document.getElementById('annualSavings');
        const monthlySavingsEl = document.getElementById('monthlySavings');
        const paybackPeriodEl = document.getElementById('paybackPeriod');
        const co2ReductionEl = document.getElementById('co2Reduction');
        const resultsEl = document.getElementById('calculatorResults');
        
        if (annualSavingsEl) annualSavingsEl.textContent = `$${annualSavings}`;
        if (monthlySavingsEl) monthlySavingsEl.textContent = `$${monthlySavings}`;
        if (paybackPeriodEl) paybackPeriodEl.textContent = `${paybackYears} years`;
        if (co2ReductionEl) co2ReductionEl.textContent = `${co2Reduction} lbs/year`;
        
        if (resultsEl) {
            resultsEl.classList.remove('hidden');
        }
    }

    // Chat management
    exportChat() {
        if (this.chatHistory.length === 0) {
            alert('No chat history to export.');
            return;
        }

        let exportContent = 'EcoBot Energy Consultation Report\n';
        exportContent += '=====================================\n';
        exportContent += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

        this.chatHistory.forEach(message => {
            const sender = message.sender === 'user' ? 'You' : 'EcoBot';
            const time = new Date(message.timestamp).toLocaleTimeString();
            exportContent += `[${time}] ${sender}: ${message.content.replace(/<[^>]*>/g, '')}\n\n`;
        });

        exportContent += '\n---\nThis report was generated by EcoBot - Energy Optimization Assistant\nPowered by IBM Cloud Technologies';

        // Create and download file
        const blob = new Blob([exportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ecobot-consultation-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    clearChat() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            this.chatHistory = [];
            const messagesContainer = document.getElementById('chatMessages');
            if (messagesContainer) {
                // Keep only the welcome message
                const welcomeMessage = messagesContainer.firstElementChild;
                messagesContainer.innerHTML = '';
                if (welcomeMessage) {
                    messagesContainer.appendChild(welcomeMessage);
                }
            }
            this.saveChatHistory();
        }
    }

    // Local storage management (Note: These are simplified for demo purposes)
    saveChatHistory() {
        // In a real application, this would save to a backend service
        // For demo purposes, we'll just keep it in memory
    }

    loadChatHistory() {
        // In a real application, this would load from a backend service
        // For demo purposes, chat starts fresh each time
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EcoBotChatbot();
});