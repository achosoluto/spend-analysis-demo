// Spend Analysis Demo - Main Application
// Global state management and initialization

// Global application state
window.AppState = {
    scenario: 'before', // 'before' or 'after'
    businessUnit: 'All',
    region: 'All',
    data: null,
    charts: {},
    initialized: false
};

// Main application initialization
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Initializing Spend Analysis Demo...');
    
    try {
        // Load data
        await loadData();
        
        // Initialize UI controls
        initializeControls();
        
        // Initialize charts with intersection observer
        initializeChartsLazy();
        
        // Update initial state
        updateAllKPIs();
        
        AppState.initialized = true;
        console.log('Application initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
        showError('Failed to load demo data. Please refresh the page.');
    }
});

// Load aggregated data for charts
async function loadData() {
    try {
        const response = await fetch('assets/data/aggregates.json');
        if (!response.ok) {
            // If aggregates.json doesn't exist, use mock data
            AppState.data = generateMockAggregates();
            console.log('Using mock data for demonstration');
            return;
        }
        
        AppState.data = await response.json();
        console.log('Loaded aggregated data:', Object.keys(AppState.data));
        
    } catch (error) {
        console.warn('Could not load data file, using mock data:', error);
        AppState.data = generateMockAggregates();
    }
}

// Initialize UI controls
function initializeControls() {
    const toggle = document.getElementById('toggleBeforeAfter');
    if (toggle) {
        toggle.addEventListener('change', handleScenarioToggle);
    }
    
    // Add smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
    });
}

// Handle scenario toggle (before/after)
function handleScenarioToggle(event) {
    AppState.scenario = event.target.checked ? 'after' : 'before';
    console.log('Scenario changed to:', AppState.scenario);
    
    // Update all visualizations
    updateAllKPIs();
    updateAllCharts();
}

// Update all KPI displays
function updateAllKPIs() {
    updateThesis1KPIs();
    updateThesis2KPIs();
    updateThesis3KPIs();
    updateThesis4KPIs();
    updateThesis5KPIs();
}

// Update Thesis 1 KPIs
function updateThesis1KPIs() {
    const isAfter = AppState.scenario === 'after';
    
    // Classification coverage
    const coverage = isAfter ? 98 : 70;
    updateKPI('t1-classification-coverage', `${coverage}%`);
    updateKPIDelta('t1-classification-delta', isAfter, 70, 98, '%');
    
    // Duplicate suppliers
    const duplicates = isAfter ? 87 : 487;
    updateKPI('t1-duplicates', duplicates.toLocaleString());
    updateKPIDelta('t1-duplicates-delta', isAfter, 487, 87, ' duplicates');
    
    // Missing category spend
    const missing = isAfter ? 0.2 : 2.3;
    updateKPI('t1-missing-category', `$${missing}M`);
    updateKPIDelta('t1-missing-delta', isAfter, 2.3, 0.2, 'M');
}

// Update Thesis 2 KPIs
function updateThesis2KPIs() {
    const isAfter = AppState.scenario === 'after';
    
    // Supplier count
    const suppliers = isAfter ? 763 : 1247;
    updateKPI('t2-supplier-count', suppliers.toLocaleString());
    updateKPIDelta('t2-supplier-delta', isAfter, 1247, 763, ' suppliers');
    
    // Top 20 share
    const top20 = isAfter ? 84 : 76;
    updateKPI('t2-top20-share', `${top20}%`);
    updateKPIDelta('t2-top20-delta', !isAfter, 76, 84, '%');
    
    // Price improvement
    const improvement = isAfter ? 5.2 : 0;
    updateKPI('t2-price-improvement', `${improvement}%`);
    updateKPIDelta('t2-price-delta', !isAfter, 0, 5.2, '% savings');
}

// Update Thesis 3 KPIs
function updateThesis3KPIs() {
    const isAfter = AppState.scenario === 'after';
    
    // Maverick spend
    const maverick = isAfter ? 7 : 22;
    updateKPI('t3-maverick-spend', `${maverick}%`);
    updateKPIDelta('t3-maverick-delta', isAfter, 22, 7, '%');
    
    // Contract coverage
    const coverage = isAfter ? 91 : 64;
    updateKPI('t3-contract-coverage', `${coverage}%`);
    updateKPIDelta('t3-contract-delta', !isAfter, 64, 91, '%');
    
    // Exceptions rate
    const exceptions = isAfter ? 7 : 18;
    updateKPI('t3-exceptions-rate', `${exceptions}%`);
    updateKPIDelta('t3-exceptions-delta', isAfter, 18, 7, '%');
}

// Update Thesis 4 KPIs
function updateThesis4KPIs() {
    const isAfter = AppState.scenario === 'after';
    
    // Price variance
    const variance = isAfter ? 6 : 18;
    updateKPI('t4-price-variance', `${variance}%`);
    updateKPIDelta('t4-variance-delta', isAfter, 18, 6, '%');
    
    // Above benchmark
    const above = isAfter ? 89 : 342;
    updateKPI('t4-above-benchmark', above.toLocaleString());
    updateKPIDelta('t4-benchmark-delta', isAfter, 342, 89, ' items');
    
    // Standardization coverage
    const standard = isAfter ? 94 : 67;
    updateKPI('t4-standardization', `${standard}%`);
    updateKPIDelta('t4-standard-delta', !isAfter, 67, 94, '%');
}

// Update Thesis 5 KPIs
function updateThesis5KPIs() {
    const isAfter = AppState.scenario === 'after';
    
    // Average terms
    const terms = isAfter ? 50 : 42;
    updateKPI('t5-avg-terms', `${terms}`);
    updateKPIDelta('t5-terms-delta', !isAfter, 42, 50, ' days');
    
    // Discount capture
    const discount = isAfter ? 65 : 23;
    updateKPI('t5-discount-capture', `${discount}%`);
    updateKPIDelta('t5-discount-delta', !isAfter, 23, 65, '%');
    
    // DPO trend
    const dpo = isAfter ? 53 : 45;
    updateKPI('t5-dpo-trend', `${dpo}`);
    updateKPIDelta('t5-dpo-delta', !isAfter, 45, 53, ' days');
}

// Helper function to update KPI value
function updateKPI(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

// Helper function to update KPI delta indicator
function updateKPIDelta(elementId, isImprovement, beforeVal, afterVal, unit) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const change = afterVal - beforeVal;
    const percent = beforeVal !== 0 ? Math.abs((change / beforeVal) * 100) : 0;
    
    if (AppState.scenario === 'before') {
        element.textContent = '';
        element.className = 'kpi-delta';
        return;
    }
    
    const deltaClass = isImprovement ? 'positive' : 'negative';
    element.className = `kpi-delta ${deltaClass}`;
    element.textContent = `${percent.toFixed(0)}% improvement`;
}

// Initialize charts with lazy loading
function initializeChartsLazy() {
    const chartElements = document.querySelectorAll('.chart');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !AppState.charts[entry.target.id]) {
                initializeChart(entry.target.id);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    chartElements.forEach(el => {
        observer.observe(el);
        el.classList.add('loading');
    });
}

// Initialize individual chart
function initializeChart(chartId) {
    const element = document.getElementById(chartId);
    if (!element) return;
    
    try {
        // Remove loading state
        element.classList.remove('loading');
        
        // Initialize echarts instance
        const chart = echarts.init(element);
        AppState.charts[chartId] = chart;
        
        // Configure based on chart type
        switch(chartId) {
            case 't1-treemap':
                configureTreemap(chart);
                break;
            case 't1-sankey':
                configureSankey(chart);
                break;
            case 't2-pareto':
                configurePareto(chart);
                break;
            case 't2-suppliers':
                configureSupplierBar(chart);
                break;
            case 't3-complianceStack':
                configureComplianceStack(chart);
                break;
            case 't3-heatmap':
                configureHeatmap(chart);
                break;
            case 't4-boxplot':
                configureBoxplot(chart);
                break;
            case 't4-controlChart':
                configureControlChart(chart);
                break;
            case 't5-termsHistogram':
                configureHistogram(chart);
                break;
            case 't5-waterfall':
                configureWaterfall(chart);
                break;
        }
        
        console.log(`Initialized chart: ${chartId}`);
        
    } catch (error) {
        console.error(`Failed to initialize chart ${chartId}:`, error);
        showChartError(element);
    }
}

// Update all charts when scenario changes
function updateAllCharts() {
    Object.entries(AppState.charts).forEach(([chartId, chart]) => {
        updateChart(chartId, chart);
    });
}

// Update individual chart
function updateChart(chartId, chart) {
    if (!chart) return;
    
    try {
        // Update chart based on type
        switch(chartId) {
            case 't1-treemap':
                updateTreemap(chart);
                break;
            case 't1-sankey':
                updateSankey(chart);
                break;
            case 't2-pareto':
                updatePareto(chart);
                break;
            case 't2-suppliers':
                updateSupplierBar(chart);
                break;
            case 't3-complianceStack':
                updateComplianceStack(chart);
                break;
            case 't3-heatmap':
                updateHeatmap(chart);
                break;
            case 't4-boxplot':
                updateBoxplot(chart);
                break;
            case 't4-controlChart':
                updateControlChart(chart);
                break;
            case 't5-termsHistogram':
                updateHistogram(chart);
                break;
            case 't5-waterfall':
                updateWaterfall(chart);
                break;
        }
    } catch (error) {
        console.error(`Failed to update chart ${chartId}:`, error);
    }
}

// Smooth scrolling for navigation
function handleSmoothScroll(event) {
    event.preventDefault();
    const target = document.querySelector(event.target.getAttribute('href'));
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Error handling
function showError(message) {
    console.error(message);
    // Could enhance with toast notifications
}

function showChartError(element) {
    element.innerHTML = '<div style="color: #666; text-align: center; padding: 2rem;">Chart failed to load</div>';
}

// Generate mock data if aggregates.json is not available
function generateMockAggregates() {
    return {
        metadata: {
            generated: new Date().toISOString(),
            scenarios: ['before', 'after'],
            description: 'Mock data for demonstration purposes'
        },
        // Will be populated by individual chart functions
        t1: { treemap: {}, sankey: {} },
        t2: { pareto: {}, suppliers: {} },
        t3: { compliance: {}, heatmap: {} },
        t4: { boxplot: {}, control: {} },
        t5: { histogram: {}, waterfall: {} }
    };
}

// Window resize handler
window.addEventListener('resize', function() {
    Object.values(AppState.charts).forEach(chart => {
        if (chart) {
            chart.resize();
        }
    });
});