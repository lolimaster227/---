// Business Scenario Calculator for Дачу-строй.рф
class BusinessCalculator {
    constructor() {
        this.scenarios = {
            conservative: {
                name: "Консервативный",
                deals_per_month: 12,
                avg_check: 200000,
                cost_percentage: 65,
                fixed_costs: 310000,
                marketing: 80000,
                investments: 1700000,
                description: "Низкие риски, быстрый старт без производства",
                color: "#2E86AB"
            },
            basic: {
                name: "Базовый", 
                deals_per_month: 18,
                avg_check: 300000,
                cost_percentage: 60,
                fixed_costs: 587000,
                marketing: 120000,
                investments: 4700000,
                description: "Мини-производство, оптимальное соотношение риск/доходность",
                color: "#A23B72"
            },
            aggressive: {
                name: "Агрессивный",
                deals_per_month: 25,
                avg_check: 350000,
                cost_percentage: 55,
                fixed_costs: 938000,
                marketing: 200000,
                investments: 12500000,
                description: "Полное производство, максимальная прибыль и масштабирование",
                color: "#F18F01"
            }
        };

        this.currentScenario = 'conservative';
        this.originalScenarios = JSON.parse(JSON.stringify(this.scenarios));
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateCalculations();
        this.updateComparisonTable();
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.scenario-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const scenario = e.target.dataset.scenario;
                this.showScenarioDetail(scenario);
            });
        });

        document.getElementById('compare-all').addEventListener('click', () => {
            this.showComparison();
        });

        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showHome();
            });
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const scenario = e.target.dataset.scenario;
                this.switchScenario(scenario);
            });
        });

        // Controls
        document.getElementById('deals-slider').addEventListener('input', (e) => {
            this.updateParameter('deals_per_month', parseInt(e.target.value));
            document.getElementById('deals-value').textContent = e.target.value;
        });

        document.getElementById('avg-check-input').addEventListener('input', (e) => {
            this.updateParameter('avg_check', parseInt(e.target.value) || 0);
        });

        document.getElementById('cost-slider').addEventListener('input', (e) => {
            this.updateParameter('cost_percentage', parseInt(e.target.value));
            document.getElementById('cost-value').textContent = e.target.value;
        });

        document.getElementById('fixed-costs-input').addEventListener('input', (e) => {
            this.updateParameter('fixed_costs', parseInt(e.target.value) || 0);
        });

        document.getElementById('marketing-input').addEventListener('input', (e) => {
            this.updateParameter('marketing', parseInt(e.target.value) || 0);
        });

        // Reset button
        document.getElementById('reset-scenario').addEventListener('click', () => {
            this.resetScenario();
        });

        // Export button
        document.getElementById('export-data').addEventListener('click', () => {
            this.exportData();
        });
    }

    showHome() {
        document.getElementById('home').style.display = 'block';
        document.getElementById('scenario-detail').style.display = 'none';
        document.getElementById('comparison').style.display = 'none';
    }

    showScenarioDetail(scenario) {
        this.currentScenario = scenario;
        document.getElementById('home').style.display = 'none';
        document.getElementById('scenario-detail').style.display = 'block';
        document.getElementById('comparison').style.display = 'none';
        
        this.updateScenarioControls();
        this.updateActiveTab();
    }

    showComparison() {
        document.getElementById('home').style.display = 'none';
        document.getElementById('scenario-detail').style.display = 'none';
        document.getElementById('comparison').style.display = 'block';
        
        this.updateComparisonTable();
    }

    switchScenario(scenario) {
        this.currentScenario = scenario;
        this.updateScenarioControls();
        this.updateActiveTab();
    }

    updateActiveTab() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-scenario="${this.currentScenario}"]`).classList.add('active');
    }

    updateScenarioControls() {
        const scenario = this.scenarios[this.currentScenario];
        
        document.getElementById('current-scenario-name').textContent = scenario.name;
        document.getElementById('deals-slider').value = scenario.deals_per_month;
        document.getElementById('deals-value').textContent = scenario.deals_per_month;
        document.getElementById('avg-check-input').value = scenario.avg_check;
        document.getElementById('cost-slider').value = scenario.cost_percentage;
        document.getElementById('cost-value').textContent = scenario.cost_percentage;
        document.getElementById('fixed-costs-input').value = scenario.fixed_costs;
        document.getElementById('marketing-input').value = scenario.marketing;
        
        this.updateCalculations();
    }

    updateParameter(param, value) {
        this.scenarios[this.currentScenario][param] = value;
        this.updateCalculations();
        this.updateComparisonTable();
    }

    calculateMetrics(scenario) {
        const revenueMonth = scenario.deals_per_month * scenario.avg_check;
        const revenueYear = revenueMonth * 12;
        
        const variableCosts = revenueMonth * (scenario.cost_percentage / 100);
        const grossProfitMonth = revenueMonth - variableCosts;
        const grossProfitYear = grossProfitMonth * 12;
        
        const totalFixedCosts = scenario.fixed_costs + scenario.marketing;
        const netProfitMonth = grossProfitMonth - totalFixedCosts;
        const netProfitYear = netProfitMonth * 12;
        
        const roi = scenario.investments > 0 ? (netProfitYear / scenario.investments) * 100 : 0;
        const paybackMonths = scenario.investments > 0 && netProfitMonth > 0 ? 
            Math.ceil(scenario.investments / netProfitMonth) : 0;
        const grossMargin = revenueMonth > 0 ? (grossProfitMonth / revenueMonth) * 100 : 0;
        
        return {
            revenueMonth,
            revenueYear,
            variableCosts,
            grossProfitMonth,
            grossProfitYear,
            totalFixedCosts,
            netProfitMonth,
            netProfitYear,
            roi,
            paybackMonths,
            grossMargin
        };
    }

    updateCalculations() {
        const scenario = this.scenarios[this.currentScenario];
        const metrics = this.calculateMetrics(scenario);
        
        // Update revenue
        document.getElementById('revenue-month').textContent = this.formatCurrency(metrics.revenueMonth);
        document.getElementById('revenue-year').textContent = this.formatCurrency(metrics.revenueYear) + '/год';
        
        // Update gross profit
        document.getElementById('gross-profit-month').textContent = this.formatCurrency(metrics.grossProfitMonth);
        document.getElementById('gross-profit-year').textContent = this.formatCurrency(metrics.grossProfitYear) + '/год';
        
        // Update net profit
        document.getElementById('net-profit-month').textContent = this.formatCurrency(metrics.netProfitMonth);
        document.getElementById('net-profit-year').textContent = this.formatCurrency(metrics.netProfitYear) + '/год';
        
        // Update ROI
        document.getElementById('roi-value').textContent = Math.round(metrics.roi) + '%';
        
        // Update payback period
        document.getElementById('payback-value').textContent = metrics.paybackMonths;
        
        // Update margin
        document.getElementById('margin-value').textContent = Math.round(metrics.grossMargin) + '%';
        
        // Update cost breakdown
        document.getElementById('variable-costs').textContent = this.formatCurrency(metrics.variableCosts);
        document.getElementById('fixed-costs-display').textContent = this.formatCurrency(scenario.fixed_costs);
        document.getElementById('marketing-costs').textContent = this.formatCurrency(scenario.marketing);
    }

    updateComparisonTable() {
        Object.keys(this.scenarios).forEach(key => {
            const scenario = this.scenarios[key];
            const metrics = this.calculateMetrics(scenario);
            
            document.getElementById(`comp-revenue-${key}`).textContent = this.formatCurrency(metrics.revenueMonth);
            document.getElementById(`comp-profit-${key}`).textContent = this.formatCurrency(metrics.netProfitMonth);
            document.getElementById(`comp-roi-${key}`).textContent = Math.round(metrics.roi) + '%';
            document.getElementById(`comp-payback-${key}`).textContent = metrics.paybackMonths + ' мес.';
        });
    }

    resetScenario() {
        this.scenarios[this.currentScenario] = JSON.parse(JSON.stringify(this.originalScenarios[this.currentScenario]));
        this.updateScenarioControls();
        this.updateComparisonTable();
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    exportData() {
        const data = [];
        
        // Headers
        data.push(['Показатель', 'Консервативный', 'Базовый', 'Агрессивный']);
        
        // Basic parameters
        data.push(['Инвестиции', 
            this.formatCurrency(this.scenarios.conservative.investments),
            this.formatCurrency(this.scenarios.basic.investments),
            this.formatCurrency(this.scenarios.aggressive.investments)
        ]);
        
        data.push(['Сделки в месяц', 
            this.scenarios.conservative.deals_per_month,
            this.scenarios.basic.deals_per_month,
            this.scenarios.aggressive.deals_per_month
        ]);
        
        data.push(['Средний чек', 
            this.formatCurrency(this.scenarios.conservative.avg_check),
            this.formatCurrency(this.scenarios.basic.avg_check),
            this.formatCurrency(this.scenarios.aggressive.avg_check)
        ]);
        
        // Calculated metrics
        Object.keys(this.scenarios).forEach((key, index) => {
            const scenario = this.scenarios[key];
            const metrics = this.calculateMetrics(scenario);
            
            if (index === 0) {
                data.push(['Выручка (месяц)', 
                    this.formatCurrency(metrics.revenueMonth),
                    '', ''
                ]);
                data.push(['Чистая прибыль (месяц)', 
                    this.formatCurrency(metrics.netProfitMonth),
                    '', ''
                ]);
                data.push(['ROI (год)', 
                    Math.round(metrics.roi) + '%',
                    '', ''
                ]);
                data.push(['Срок окупаемости', 
                    metrics.paybackMonths + ' мес.',
                    '', ''
                ]);
            } else {
                const rowIndex = data.length - 4 + (index - 1);
                data[data.length - 4][index + 1] = this.formatCurrency(metrics.revenueMonth);
                data[data.length - 3][index + 1] = this.formatCurrency(metrics.netProfitMonth);
                data[data.length - 2][index + 1] = Math.round(metrics.roi) + '%';
                data[data.length - 1][index + 1] = metrics.paybackMonths + ' мес.';
            }
        });
        
        // Convert to CSV
        const csvContent = data.map(row => row.join(',')).join('\n');
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'business_scenarios_analysis.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Initialize the calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BusinessCalculator();
});

// Add smooth scrolling for better UX
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Add loading states for better UX
function addLoadingState(element) {
    element.classList.add('loading');
    setTimeout(() => {
        element.classList.remove('loading');
    }, 300);
}

// Format numbers with thousand separators
function formatNumber(num) {
    return new Intl.NumberFormat('ru-RU').format(num);
}

// Validate input fields
function validateInput(input, min, max) {
    const value = parseInt(input.value);
    if (isNaN(value) || value < min) {
        input.value = min;
        return min;
    } else if (value > max) {
        input.value = max;
        return max;
    }
    return value;
}

// Add input validation
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            const min = parseInt(input.getAttribute('min')) || 0;
            const max = parseInt(input.getAttribute('max')) || Infinity;
            validateInput(input, min, max);
        });
    });
});

// Add tooltips for better UX
const tooltips = {
    'deals-slider': 'Количество заключаемых сделок в месяц',
    'avg-check-input': 'Средняя стоимость одной сделки в рублях',
    'cost-slider': 'Процент себестоимости от выручки',
    'fixed-costs-input': 'Постоянные ежемесячные расходы в рублях',
    'marketing-input': 'Ежемесячный бюджет на маркетинг в рублях'
};

Object.keys(tooltips).forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        element.setAttribute('title', tooltips[id]);
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key to go back to home
    if (e.key === 'Escape') {
        const homeSection = document.getElementById('home');
        if (homeSection.style.display === 'none') {
            homeSection.style.display = 'block';
            document.getElementById('scenario-detail').style.display = 'none';
            document.getElementById('comparison').style.display = 'none';
        }
    }
    
    // Tab navigation between scenarios
    if (e.key === 'Tab' && e.shiftKey) {
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) {
            e.preventDefault();
            const tabs = Array.from(document.querySelectorAll('.tab-btn'));
            const currentIndex = tabs.indexOf(activeTab);
            const nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
            tabs[nextIndex].click();
        }
    }
});

// Add performance monitoring
const performanceMonitor = {
    start: performance.now(),
    logCalculation: function(operation) {
        const now = performance.now();
        if (now - this.start > 100) {
            console.warn(`Slow calculation detected: ${operation} took ${now - this.start}ms`);
        }
        this.start = now;
    }
};

// Add error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    // Show user-friendly error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-error);
        color: white;
        padding: 16px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    errorMessage.textContent = 'Произошла ошибка при расчете. Пожалуйста, обновите страницу.';
    document.body.appendChild(errorMessage);
    
    setTimeout(() => {
        errorMessage.remove();
    }, 5000);
});